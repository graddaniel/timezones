const AccountCredentialsNotFound = require('./errors/account-credentials-not-valid-error');


class AccountsService {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async createAccount({
        username,
        password,
    }) {
        await this.usersService.createUser({
            username,
            password,
        });
    }

    async validateAccount({
        username,
        password,
    }) {
        const user = await this.usersService.findUser({
            username,
            password,
        });

        if (!user) {
            throw new AccountCredentialsNotFound();
        }

        return user;
    }
}

module.exports = AccountsService;