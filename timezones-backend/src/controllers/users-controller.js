const { StatusCodes } = require('http-status-codes');


class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async editUser(req, res) {
        const {
            username,
            password,
            role,
        } = req.body;

        await this.usersService.editUser({
            username,
            password,
            role,
        }, {
            role: req.user.role,
        });

        res.status(StatusCodes.OK).send(`Account ${username} succesfully edited.`);
    }

    async listAllUsers(req, res) {
        const users = await this.usersService.getAll();

        res.status(StatusCodes.OK).json(users);
    }
}

module.exports = UsersController;