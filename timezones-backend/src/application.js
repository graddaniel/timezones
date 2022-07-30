const express = require('express');
const cors = require('cors');
const config = require('config');

const handleErrors = require('./middleware/handle-errors');

const AccountRoutes = require('./routes/account-routes');
const UserRoutes = require('./routes/user-routes');


const AccountsController = require('./controllers/accounts-controller');
const UsersController = require('./controllers/users-controller');

const AccountsService = require('./services/accounts/accounts-service');
const DatabaseService = require('./services/database-service');
const UsersService = require('./services/users/users-service');


class Application {
    static Services = {
        DatabaseService: 'DatabaseService',
        UsersService: 'UsersService',
        AccountsService: 'AccountsService',
    };

    static Controllers = {
        AccountsController: 'AccountsController',
        UsersController: 'UsersController',
    };

    async start() {
        if (!process.env.JWT_TOKEN_SECRET) {
            console.error("Missing JWT_TOKEN_SECRET environmental variable.");

            process.exit(1);
        }

        await this.createServices();

        this.createControllers();

        this.expressApp = express();

        const {
            host: CORS_HOST,
            port: CORS_PORT,
        } = config.get('cors');
        this.expressApp.use(cors({
            origin: `http://${CORS_HOST}:${CORS_PORT}`,
        }));

        this.expressApp.use(express.json())

        this.createRoutes();

        this.expressApp.use(handleErrors);
        
        const {
            port: SERVER_PORT
        } = config.get('server');
        this.server = this.expressApp.listen(SERVER_PORT, () => console.log(`Listening on port: ${SERVER_PORT}`));
    }

    async stop(callback) {
        this.server.close(callback);

        const databaseService = this.servicesMap.get(Application.Services.DatabaseService);
        await databaseService.terminate();
    }

    async createServices() {
        const servicesMap = new Map();
        
        const databaseService = new DatabaseService(config.get('mongo'));
        await databaseService.init();
        servicesMap.set(Application.Services.DatabaseService, databaseService);
    
        const usersService = new UsersService(databaseService);
        servicesMap.set(Application.Services.UsersService, usersService);
    
        const accountsService = new AccountsService(usersService);
        servicesMap.set(Application.Services.AccountsService, accountsService);
    
        this.servicesMap = servicesMap;
    }
    
    createControllers() {
        const controllersMap = new Map();

        const accountsController = new AccountsController(
            this.servicesMap.get(Application.Services.AccountsService),
        );
        controllersMap.set(
            Application.Controllers.AccountsController,
            accountsController,
        );

        const usersController = new UsersController(
            this.servicesMap.get(Application.Services.UsersService),
        );
        controllersMap.set(
            Application.Controllers.UsersController,
            usersController,
        );
    
        this.controllersMap = controllersMap;
    }

    createRoutes() {
        //TODO Account or Accounts? fix that! Controller also plural?
        const accountRoutes = new AccountRoutes(
            this.controllersMap.get(Application.Controllers.AccountsController),
        );
        this.expressApp.use('/account', accountRoutes.getRouter());

        const userRoutes = new UserRoutes(
            this.controllersMap.get(Application.Controllers.UsersController),
        );
        this.expressApp.use('/user', userRoutes.getRouter());
    }
}

module.exports = Application;