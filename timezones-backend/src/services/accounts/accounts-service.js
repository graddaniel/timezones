const UserAlreadyExistsError = require('./errors/user-already-exists-error');
const UserCredentialsNotFoundError = require('./errors/user-credentials-not-found-error');


class AccountsService {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async createAccount({
        username,
        password,
    }) {
        const userExists = await this.usersService.userExists({
            username,
        });

        if (userExists) {
            throw new UserAlreadyExistsError(username);
        }

        await this.usersService.createUser({
            username,
            password,
        });
    }

    async findAccount({
        username,
        password,
    }) {
        const user = await this.usersService.findUser({
            username,
            password,
        });

        if (!user) {
            throw new UserCredentialsNotFoundError();
        }

        return user;
    }
}

module.exports = AccountsService;