const AccountsService = require('../../src/services/accounts/accounts-service');
const UsersService = require('../../src/services/users/users-service');

const AccountCredentialsNotValid = require('../../src/services/accounts/errors/account-credentials-not-valid-error');

jest.mock('../../src/services/timezones/timezones-repository');
jest.mock('../../src/services/users/users-service');


describe('AccountsService', () => {
    let usersService = null;
    let accountsService = null;

    beforeAll(() => {
        usersService = new UsersService();
        accountsService = new AccountsService(usersService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createAccount', () => {
        it('succesfully creates an account', async () => {
            const credentials = {
                username: "user1",
                password: "pass1",
            };
            
            await accountsService.createAccount(credentials);

            expect(usersService.createUser).toHaveBeenCalledWith(credentials);
        });
    });

    describe('verifyAccount', () => {
        it('succesfully verifies an account', async () => {
            usersService.findUserByCredentials = jest.fn(() => ({...credentials}));
            const credentials = {
                username: "user1",
                password: "pass1",
            };
            
            const account = await accountsService.verifyAccount(credentials);

            expect(usersService.findUserByCredentials).toHaveBeenCalledWith(credentials);
            expect(account).toStrictEqual(credentials);
        });

        it('fails to verify an account, if it doesn\'t exist', async () => {
            const credentials = {
                username: "user1",
                password: "pass1",
            };
            
            await expect(() => accountsService.verifyAccount(credentials))
                .rejects.toThrow(new AccountCredentialsNotValid());

            expect(usersService.findUserByCredentials).toHaveBeenCalledWith(credentials);
        });
    });
});