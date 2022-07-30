const express = require('express');
const { wrap } = require('express-promise-wrap');
const config = require('config');

const extractUserFromJWT = require('../middleware/extract-user-from-jwt');
const allow = require('../middleware/allow');

class UserRoutes {
    constructor(usersController) {
        const router = express.Router();

        const {
            manager: MANAGER,
            admin: ADMIN,
        } = config.get('roles');
        router.use(extractUserFromJWT);
        router.use(allow([MANAGER, ADMIN]));

        router.patch('/edit', wrap(usersController.editUser.bind(usersController)));
        router.get('/listAll', wrap(usersController.listAllUsers.bind(usersController)))

        this.router = router;
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UserRoutes;