class AccountsService {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async register({
        username,
        password,
    }) {
        return this.usersService.createUser({
            username,
            password,
        });
    }

    async login({
        username,
        password,
    }) {
        return this.usersService.userExists({
            username,
            password,
        });
    }
}

module.exports = AccountsService;