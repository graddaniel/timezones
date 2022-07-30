const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const config = require('config');

const AccountValidator = require('../services/accounts/account-validator');

const JWT_EXPIRY_TIME = config.get('jwtExpiryTime');

class AccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }

    async register(req, res) {
        const {
            username,
            password,
        } = req.body;

        const newAccountCredentials = {
            username,
            password,
        };

        await AccountValidator.validateAccountCredentials(newAccountCredentials);

        await this.accountsService.createAccount(newAccountCredentials);

        res.status(StatusCodes.OK).send(`User ${username} has been created.`);
    }

    async login(req, res) {
        const {
            username,
            password,
        } = req.body;

        const accountCredentials = {
            username,
            password,
        };

        await AccountValidator.validateAccountCredentials(accountCredentials);

        const account = await this.accountsService.verifyAccount(accountCredentials);

        const jwtToken = jwt.sign(
            this.extractTokenData(account),
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: JWT_EXPIRY_TIME }
        );

        res.status(StatusCodes.OK).send(jwtToken);
    }

    extractTokenData(account) {
        const {
            _id,
            username,
            role,
        } = account;

        return {
            _id,
            username,
            role,
        };
    }
}

module.exports = AccountsController;