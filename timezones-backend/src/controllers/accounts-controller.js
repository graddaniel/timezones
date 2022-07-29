const { StatusCodes } = require('http-status-codes');

class AccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }

    async register(req, res) {
        const {
            username,
            password,
        } = req.body;

        await this.accountsService.register({
            username,
            password,
        });

        res.status(StatusCodes.OK).send(`User ${username} has been created.`);
    }

    async login(req, res) {

    }

    async editAccount(req, res) {}
}

module.exports = AccountsController;