const AccountCredentialsNotValid = require('./errors/account-credentials-not-valid-error');


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

    async verifyAccount({
        username,
        password,
    }) {
        const user = await this.usersService.findUserByCredentials({
            username,
            password,
        });

        if (!user) {
            throw new AccountCredentialsNotValid();
        }

        return user;
    }
}

module.exports = AccountsService;