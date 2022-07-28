const express = require('express');

class AccountRoutes {
    constructor(accountsController) {
        this.accountsController = accountsController;

        const router = express.Router();

        router.post('/login', accountsController.login.bind(accountsController));
        router.post('/register', accountsController.register.bind(accountsController));

        this.router = router;
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AccountRoutes;