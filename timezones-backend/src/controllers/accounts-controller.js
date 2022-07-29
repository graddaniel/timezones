const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const config = require('config');


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

        await this.accountsService.createAccount({
            username,
            password,
        });

        res.status(StatusCodes.OK).send(`User ${username} has been created.`);
    }

    async login(req, res) {
        const {
            username,
            password,
        } = req.body;

        const account = await this.accountsService.findAccount({
            username,
            password,
        });

        const jwtToken = jwt.sign(
            this.extractTokenData(account),
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: JWT_EXPIRY_TIME }
        );

        res.status(StatusCodes.OK).send(jwtToken);
    }

    async editAccount(req, res) {}

    extractTokenData(account) {
        const {
            _id,
            username,
            accessLevel,
        } = account;

        return {
            _id,
            username,
            accessLevel,
        };
    }
}

module.exports = AccountsController;