const UserAlreadyExistsError = require('./errors/user-already-exists-error');

class AccountsService {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async register({
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

    async login({
        username,
        password,
    }) {
        return this.usersService.findUser({
            username,
            password,
        });
    }
}

module.exports = AccountsService;