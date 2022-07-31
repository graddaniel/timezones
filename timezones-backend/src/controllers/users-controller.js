const { StatusCodes } = require('http-status-codes');

const UserValidator = require('../services/users/user-validator');


class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    async addUser(req, res) {
        const {
            username,
            password,
            role,
        } = req.body;

        const newUser = {
            username,
            password,
            role,
        };

        await UserValidator.validateNewUser(newUser);

        await this.usersService.createUser(newUser, req.user.role);

        res.status(StatusCodes.OK).send(`User ${username} succesfully added.`);
    }

    async editUser(req, res) {
        const {
            username,
            password,
            role,
        } = req.body;

        const editedUser = {
            username,
            password,
            role,
        };

        await UserValidator.validateEditedUser(editedUser);

        await this.usersService.editUser(editedUser, req.user.role);

        res.status(StatusCodes.OK).send(`User ${username} succesfully edited.`);
    }

    async listUsers(req, res) {
        const users = await this.usersService.getUsers(req.user.role);

        res.status(StatusCodes.OK).json(users);
    }

    async getAllUsernames(req, res) {
        const usernames = await this.usersService.getAllUsernames();

        res.status(StatusCodes.OK).json(usernames);
    }

    async deleteUser(req, res) {
        const { username } = req.query;

        await UserValidator.validateUsername(username);

        await this.usersService.deleteUserByUsername(username, req.user.role);

        res.status(StatusCodes.OK).send(`User ${username} succesfully deleted.`);
    }
}

module.exports = UsersController;