const express = require('express');
const { wrap } = require('express-promise-wrap')

class AccountRoutes {
    constructor(accountsController) {
        this.accountsController = accountsController;

        const router = express.Router();

        router.post('/register', wrap(accountsController.register.bind(accountsController)));
        router.post('/login', wrap(accountsController.login.bind(accountsController)));
        router.patch('/edit', wrap(accountsController.editAccount.bind(accountsController)));

        this.router = router;
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AccountRoutes;