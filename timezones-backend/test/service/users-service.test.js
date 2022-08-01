const md5 = require('md5');

const UsersService = require('../../src/services/users/users-service');
const UsersRepository = require('../../src/services/users/users-repository');

const UserAlreadyExistsError = require('../../src/services/users/errors/user-already-exists-error');
const UserNotFoundError = require('../../src/services/users/errors/user-not-found-error');

const InsufficientPrivilegesError = require('../../src/generic-errors/insufficient-privileges-error');

jest.mock('../../src/services/users/users-repository');

describe('UsersService', () => {
    let usersUservice = null;
    let usersRepository = null;

    beforeAll(() => {
        usersRepository = new UsersRepository();
        usersUservice = new UsersService(usersRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createUser', () => {
        it('succesfully creates a regular user', async () => {
            const user = {
                username: "user1",
                password: "pass123",
                role: "user"
            };

            await usersUservice.createUser(user);

            expect(usersRepository.findUser).toHaveBeenCalledWith({
                username: user.username,
            });
            expect(usersRepository.createUser).toHaveBeenCalledWith({
                username: user.username,
                password: md5(user.password),
                role: user.role,
            });
        });

        it('fails to create a user, when it exists', async () => {
            usersRepository.findUser = jest.fn(() => user);

            const user = {
                username: "user1",
                password: "pass123",
                role: "user"
            };

            await expect(() => usersUservice.createUser(user))
                .rejects.toThrow(new UserAlreadyExistsError(user.username));

            expect(usersRepository.findUser).toHaveBeenCalledWith({
                username: user.username,
            });

            expect(usersRepository.createUser).not.toHaveBeenCalled();
        });

        it('succesfully creates an admin, when current user is an admin', async () => {
            const user = {
                username: "admin1",
                password: "pass123",
                role: "admin"
            };
            const userRole = "admin";

            await usersUservice.createUser(user, userRole);

            expect(usersRepository.findUser).toHaveBeenCalledWith({
                username: user.username,
            });
            expect(usersRepository.createUser).toHaveBeenCalledWith({
                username: user.username,
                password: md5(user.password),
                role: user.role,
            });
        });

        it('fails to create an admin, when current user is not an admin', async () => {
            usersRepository.findUser = jest.fn(() => user);

            const user = {
                username: "admin",
                password: "pass123",
                role: "admin"
            };
            const userRole = "user";

            await expect(() => usersUservice.createUser(user, userRole))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(usersRepository.findUser).not.toHaveBeenCalled();
            expect(usersRepository.createUser).not.toHaveBeenCalled();
        });

        it('fails to create a userManager, when current user is not an admin', async () => {
            usersRepository.findUser = jest.fn(() => user);

            const user = {
                username: "userManager1",
                password: "pass123",
                role: "userManager"
            };
            const userRole = "userManager";

            await expect(() => usersUservice.createUser(user, userRole))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(usersRepository.findUser).not.toHaveBeenCalled();
            expect(usersRepository.createUser).not.toHaveBeenCalled();
        });
    });

    describe('findUser', () => {
        it('succesfully finds a user', async () => {
            const credentials = {
                username: "user1",
                password: "pass123"
            };

            await usersUservice.findUserByCredentials(credentials);

            expect(usersRepository.findUser).toHaveBeenCalledWith({
                username: credentials.username,
                password: md5(credentials.password),
            });
        });
    });

    describe('editUser', () => {
        it('succesfully edits a user', async () => {
            usersRepository.findUser = jest.fn(() => user);

            const user = {
                username: "user1",
                password: "pass123",
                role: "user",
            };
            const userRole = "userManager";

            await usersUservice.editUser(user, userRole);

            expect(usersRepository.updateUser).toHaveBeenCalledWith({
                username: user.username
            }, {
                password: md5(user.password),
                role: user.role,
            });
        });

        it('succesfully edits a user, without hashing the password, when its already hashed', async () => {
            usersRepository.findUser = jest.fn(() => user);

            const user = {
                username: "user1",
                password: "482c811da5d5b4bc6d497ffa98491e38",
                role: "user",
            };
            const userRole = "userManager";

            await usersUservice.editUser(user, userRole);

            expect(usersRepository.updateUser).toHaveBeenCalledWith({
                username: user.username
            }, {
                password: user.password,
                role: user.role,
            });
        });

        it('fails to promote user to userManager, as userManager', async () => {
            usersRepository.findUser = jest.fn(() => ({
                username: "user1",
                password: "pass123",
                role: "user",
            }));

            const user = {
                username: "user1",
                password: "pass123",
                role: "userManager",
            };
            const userRole = "userManager";

            await expect(() => usersUservice.editUser(user, userRole))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(usersRepository.findUser).toHaveBeenCalledWith({
                username: user.username,
            });

            expect(usersRepository.updateUser).not.toHaveBeenCalledWith();
        });

        it('fails to demote admin to user, as userManager', async () => {
            usersRepository.findUser = jest.fn(() => ({
                username: "user1",
                password: "pass123",
                role: "admin",
            }));

            const user = {
                username: "user1",
                password: "pass123",
                role: "user",
            };
            const userRole = "userManager";

            await expect(() => usersUservice.editUser(user, userRole))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(usersRepository.findUser).toHaveBeenCalledWith({
                username: user.username,
            });

            expect(usersRepository.updateUser).not.toHaveBeenCalledWith();
        });

        it('fails to edit a user, when user is not found', async () => {
            const user = {
                username: "user1",
                password: "pass123",
                role: "user",
            };
            const userRole = "userManager";

            await expect(() => usersUservice.editUser(user, userRole))
                .rejects.toThrow(new UserNotFoundError(user.username));

            expect(usersRepository.updateUser).not.toHaveBeenCalled();
        });
    });

    describe('getUsers', () => {
        it('succesfully edits a user, as userManager', async () => {
            const userRole = "userManager";

            await usersUservice.getUsers(userRole);

            expect(usersRepository.findUsers).toHaveBeenCalledWith({
                role: "user"
            });
        });

        it('succesfully edits a user, as admin', async () => {
            const userRole = "admin";

            await usersUservice.getUsers(userRole);

            expect(usersRepository.findUsers).toHaveBeenCalledWith({});
        });
    });

    describe('getAllUsernames', () => {
        it('succesfully edits a user, as userManager', async () => {
            usersRepository.findUsers = jest.fn(() => ([
                {
                    username: "user1",
                },
                {
                    username: "user2",
                }
            ]));

            const usernames = await usersUservice.getAllUsernames();

            expect(usersRepository.findUsers).toHaveBeenCalledWith(
                {},
                { username: 1 }
            );
            expect(usernames).toStrictEqual(["user1", "user2"]);
        });
    });

    describe('deleteUserByUsername', () => {
        it('succesfully deletes a user, as userManager', async () => {
            const username = "user1";
            const role = "userManager";
            usersRepository.findUser = jest.fn(() => ({
                username,
                role: "user",
            }));

            await usersUservice.deleteUserByUsername(username, role);

            expect(usersRepository.findUser).toHaveBeenCalledWith(
                { username }
            );
            expect(usersRepository.deleteUser).toHaveBeenCalledWith(
                { username }
            );
        });

        it('fails to delete a userManager, as userManager', async () => {
            const username = "user1";
            const role = "userManager";
            usersRepository.findUser = jest.fn(() => ({
                username,
                role: "userManager",
            }));

            await expect(() => usersUservice.deleteUserByUsername(username, role))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(usersRepository.findUser).toHaveBeenCalledWith(
                { username }
            );

            expect(usersRepository.deleteUser).not.toHaveBeenCalled();
        });

        it('fails to delete a user, when user is not found', async () => {
            const username = "user1";
            const role = "userManager";

            await expect(() => usersUservice.deleteUserByUsername(username, role))
                .rejects.toThrow(new UserNotFoundError(username));

            expect(usersRepository.findUser).toHaveBeenCalledWith(
                { username }
            );

            expect(usersRepository.deleteUser).not.toHaveBeenCalled();
        });
    });

    describe('findUserByUsername', () => {
        it('succesfully finds a user, by its username', async () => {
            const username = "user1";

            await usersUservice.findUserByUsername(username);

            expect(usersRepository.findUser).toHaveBeenCalledWith({
                username,
            });
        });
    });
});