class AccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }

    async register(req, res) {
        //TODO temp
        const result = await this.accountsService.register({
            username: 'test',
            password: 'test',
        });

        res.send(result);
    }

    async login(req, res) {

    }
}

module.exports = AccountsController;