const express = require('express');
const cors = require('cors');
const config = require('config');

const DatabaseService = require('./services/database-service');
const UsersService = require('./services/users/users-service');
const AccountsService = require('./services/accounts/accounts-service');
const AccountsController = require('./controllers/accounts-controller');
const AccountRoutes = require('./routes/account-routes');
const handleErrors = require('./middleware/handle-errors');

class Application {
    static Services = {
        DatabaseService: 'DatabaseService',
        UsersService: 'UsersService',
        AccountsService: 'AccountsService',
    };

    static Controllers = {
        AccountsController: 'AccountsController',
    };

    async start() {
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
    
        this.controllersMap = controllersMap;
    }

    createRoutes() {
        //TODO Account or Accounts? unify that!
        const accountRoutes = new AccountRoutes(
            this.controllersMap.get(Application.Controllers.AccountsController),
        );

        this.expressApp.use('/account', accountRoutes.getRouter());
    }


}

module.exports = Application;