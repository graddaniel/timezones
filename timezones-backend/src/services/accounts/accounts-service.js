const AccountCredentialsNotFound = require('./errors/account-credentials-not-valid-error');


class AccountsService {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async createAccount({
        username,
        password,
    }) {
        await this.usersService.createUserFromCredentials({
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
            throw new AccountCredentialsNotFound();
        }

        return user;
    }
}

module.exports = AccountsService;