const { StatusCodes } = require('http-status-codes');

const TimezoneValidator = require('../services/timezones/timezone-validator');
const UserValidator = require('../services/users/user-validator');

class TimezonesController {
    constructor(timezonesService) {
        this.timezonesService = timezonesService;
    }

    async addTimezone(req, res) {
        const {
            name,
            cityName,
            timeDifference,
            username,
        } = req.body;

        const newTimezone = {
            name,
            cityName,
            timeDifference,
            username,
        };

        await TimezoneValidator.validateEditedTimezone(newTimezone);
        await UserValidator.validateUsername(username);

        await this.timezonesService.addTimezone(newTimezone, req.user);

        res.status(StatusCodes.OK).send('Timezone succesfully added.');
    }

    async editTimezone(req, res) {
        const {
            id,
            name,
            cityName,
            timeDifference,
            username,
        } = req.body;

        const editedTimezone = {
            name,
            cityName,
            timeDifference,
            username,
        }
        
        await TimezoneValidator.validateEditedTimezone(editedTimezone);
        await UserValidator.validateUsername(username);

        await this.timezonesService.editTimezoneById(id, editedTimezone, req.user);

        res.status(StatusCodes.OK).send('Timezone succesfully edited.');
    }

    async deleteTimezone(req, res) {
        const {
            id,
        } = req.query;

        await this.timezonesService.deleteTimezoneById(id, req.user);

        res.status(StatusCodes.OK).send('Timezone succesfully edited.');
    }

    async listTimezones(req, res) {
        const { name } = req.query;

        await TimezoneValidator.validateEditedTimezone({ name });

        const timezones = await this.timezonesService.getTimezonesByUser(req.user, name);

        res.status(StatusCodes.OK).json(timezones);
    }
}

module.exports = TimezonesController;