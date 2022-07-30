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
        }, req.user.role);

        res.status(StatusCodes.OK).send(`User ${username} succesfully edited.`);
    }

    async listAllUsers(req, res) {
        const users = await this.usersService.getAll();

        res.status(StatusCodes.OK).json(users);
    }

    async deleteUser(req, res) {
        const { username } = req.body;

        await this.usersService.deleteUserByUsername(username, req.user.role);

        res.status(StatusCodes.OK).send(`User ${username} succesfully deleted.`);
    }
}

module.exports = UsersController;