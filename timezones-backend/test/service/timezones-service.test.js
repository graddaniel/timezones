const TimezonesService = require('../../src/services/timezones/timezones-service');
const TimezonesRepository = require('../../src/services/timezones/timezones-repository');
const UsersService = require('../../src/services/users/users-service');


const TimezoneNotFoundError = require('../../src/services/timezones/errors/timezone-not-found-error');
const UserNotFoundError = require('../../src/services/users/errors/user-not-found-error');

const InsufficientPrivilegesError = require('../../src/generic-errors/insufficient-privileges-error');

jest.mock('../../src/services/timezones/timezones-repository');
jest.mock('../../src/services/users/users-service');


describe('TimezonesService', () => {
    let timezonesRepository = null;
    let usersService = null;
    let timezonesService = null;

    beforeAll(() => {
        timezonesRepository = new TimezonesRepository();
        usersService = new UsersService();

        timezonesService = new TimezonesService(
            timezonesRepository,
            usersService,
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addTimezone', () => {
        it('succesfully adds a timezone', async () => {
            usersService.findUserByUsername = jest.fn(() => ({})); // some user
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };
            const currentUser = {
                username: "user1",
                role: "user",
            }

            await timezonesService.addTimezone(timezone, currentUser);

            expect(usersService.findUserByUsername).toHaveBeenCalledWith(timezone.username);
            expect(timezonesRepository.createTimezone).toHaveBeenCalledWith(timezone);
        });

        it('succesfully adds a timezone, to another user, as admin', async () => {
            usersService.findUserByUsername = jest.fn(() => ({})); // some user
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };
            const currentUser = {
                username: "admin1",
                role: "admin",
            }

            await timezonesService.addTimezone(timezone, currentUser);

            expect(usersService.findUserByUsername).toHaveBeenCalledWith(timezone.username);
            expect(timezonesRepository.createTimezone).toHaveBeenCalledWith(timezone);
        });

        it('fails to adds a timezone to another user, as user', async () => {
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };
            const currentUser = {
                username: "user2",
                role: "user",
            }

            await expect(() => timezonesService.addTimezone(timezone, currentUser))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(usersService.findUserByUsername).not.toHaveBeenCalled();
            expect(timezonesRepository.createTimezone).not.toHaveBeenCalled();
        });

        it('fails to adds a timezone, when user is not found', async () => {
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };
            const currentUser = {
                username: "admin1",
                role: "admin",
            }

            await expect(() => timezonesService.addTimezone(timezone, currentUser))
                .rejects.toThrow(new UserNotFoundError(timezone.username));

            expect(usersService.findUserByUsername).toHaveBeenCalledWith(timezone.username);

            expect(timezonesRepository.createTimezone).not.toHaveBeenCalled();
        });
    });

    describe('editTimezoneById', () => {
        it('succesfully edits a timezone', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);
            usersService.findUserByUsername = jest.fn(() => user);

            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };
            const user = {
                username: "user1",
                password: "pass1",
                role: "user",
            };

            const currentUser = {
                username: user.username,
                role: user.role,
            }
            const id = "123";

            await timezonesService.editTimezoneById(id, timezone, currentUser);

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });
            expect(usersService.findUserByUsername).toHaveBeenCalledWith(timezone.username);
            expect(timezonesRepository.updateTimezone).toHaveBeenCalledWith({
                _id: id,
            }, timezone);
        });

        it('fails to edit a timezone, when timezone is not found', async () => {
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };
            const currentUser = {
                username: "user1",
                role: "user",
            }
            const id = "123";

            await expect(() => timezonesService.editTimezoneById(id, timezone, currentUser))
                .rejects.toThrow(new TimezoneNotFoundError(id));

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });

            expect(usersService.findUserByUsername).not.toHaveBeenCalled();
            expect(timezonesRepository.updateTimezone).not.toHaveBeenCalled();
        });

        it('succesfully edits another user\'s timezone, as admin', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);
            usersService.findUserByUsername = jest.fn(() => user);
            const user = {
                username: "user2",
                password: "pass2",
                role: "user",
            };

            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };

            const newTimezone = {
                name: "zone2",
                cityName: "atlantis",
                timeDifference: "-2:00",
                username: user.username,
            };

            const currentUser = {
                username: "admin1",
                role: "admin",
            }
            const id = "123";

            await timezonesService.editTimezoneById(id, newTimezone, currentUser);

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });
            expect(usersService.findUserByUsername).toHaveBeenCalledWith(newTimezone.username);
            expect(timezonesRepository.updateTimezone).toHaveBeenCalledWith({
                _id: id,
            }, newTimezone);
        });

        it('fails to edit a timezone with another user, as user', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };

            const newTimezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user2",
            };

            const currentUser = {
                username: "user1",
                role: "user",
            }
            const id = "123";

            await expect(() => timezonesService.editTimezoneById(id, newTimezone, currentUser))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });

            expect(usersService.findUserByUsername).not.toHaveBeenCalled();
            expect(timezonesRepository.updateTimezone).not.toHaveBeenCalled();
        });

        it('fails to edit another user\'s timezone, as user', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user2",
            };

            const newTimezone = {
                name: "zone2",
                cityName: "atlantis",
                timeDifference: "-2:00",
                username: "user2",
            };

            const currentUser = {
                username: "user1",
                role: "user",
            }
            const id = "123";

            await expect(() => timezonesService.editTimezoneById(id, newTimezone, currentUser))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });

            expect(usersService.findUserByUsername).not.toHaveBeenCalled();
            expect(timezonesRepository.updateTimezone).not.toHaveBeenCalled();
        });

        it('fails to edit a timezone, when user is not found', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);

            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };

            const currentUser = {
                username: "user1",
                role: "user",
            }
            const id = "123";

            await expect(() => timezonesService.editTimezoneById(id, timezone, currentUser))
                .rejects.toThrow(new UserNotFoundError(timezone.username));

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });
            expect(usersService.findUserByUsername).toHaveBeenCalledWith(timezone.username);

            expect(timezonesRepository.updateTimezone).not.toHaveBeenCalled();
        });
    });

    describe('deleteTimezoneById', () => {
        it('succesfully deletes a timezone', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };

            const currentUser = {
                username: timezone.username,
                role: "user",
            }
            const id = "123";

            await timezonesService.deleteTimezoneById(id, currentUser);

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });
            expect(timezonesRepository.deleteTimezone).toHaveBeenCalledWith({
                _id: id,
            });
        });

        it('succesfully deletes another user\'s timezone, as admin', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };

            const currentUser = {
                username: "admin1",
                role: "admin",
            }
            const id = "123";

            await timezonesService.deleteTimezoneById(id, currentUser);

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });
            expect(timezonesRepository.deleteTimezone).toHaveBeenCalledWith({
                _id: id,
            });
        });

        it('fails to delete another user\'s timezone, as user', async () => {
            timezonesRepository.findTimezone = jest.fn(() => timezone);
            const timezone = {
                name: "zone1",
                cityName: "atlantis",
                timeDifference: "-1:00",
                username: "user1",
            };

            const currentUser = {
                username: "user2",
                role: "user",
            }
            const id = "123";

            await expect(() => timezonesService.deleteTimezoneById(id, currentUser))
                .rejects.toThrow(new InsufficientPrivilegesError());

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });

            expect(timezonesRepository.deleteTimezone).not.toHaveBeenCalled();
        });

        it('fails to delete a timezone, when timezone is not found', async () => {
            const currentUser = {
                username: "user1",
                role: "user",
            }
            const id = "123";

            await expect(() => timezonesService.deleteTimezoneById(id, currentUser))
                .rejects.toThrow(new TimezoneNotFoundError(id));

            expect(timezonesRepository.findTimezone).toHaveBeenCalledWith({
                _id: id,
            });

            expect(timezonesRepository.deleteTimezone).not.toHaveBeenCalled();
        });
    });

    describe('getTimezonesByUser', () => {
        it('successfully returns timezones', async () => {
            const user = {
                username: "user1",
                role: "user",
            };

            await timezonesService.getTimezonesByUser(user);

            expect(timezonesRepository.findTimezones).toHaveBeenCalledWith({
                username: user.username,
            });
        });

        it('successfully returns all timezones, as admin', async () => {
            const user = {
                username: "admin1",
                role: "admin",
            };

            await timezonesService.getTimezonesByUser(user);

            expect(timezonesRepository.findTimezones).toHaveBeenCalledWith({});
        });

        it('successfully returns timezones, filtered by name', async () => {
            const user = {
                username: "user1",
                role: "user",
            };
            const nameFilter = "filterString";

            await timezonesService.getTimezonesByUser(user, nameFilter);

            expect(timezonesRepository.findTimezones).toHaveBeenCalledWith({
                username: user.username,
                name: {
                    $regex: nameFilter,
                }
            });
        });
    });
});