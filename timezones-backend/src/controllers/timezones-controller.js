const { StatusCodes } = require('http-status-codes');


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

        await this.timezonesService.addTimezone({
            name,
            cityName,
            timeDifference,
            username,
        }, req.user);

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

        await this.timezonesService.editTimezoneById(id, {
            name,
            cityName,
            timeDifference,
            username,
        }, req.user);

        res.status(StatusCodes.OK).send('Timezone succesfully edited.');
    }

    async deleteTimezone(req, res) {
        const {
            id,
        } = req.body;

        await this.timezonesService.deleteTimezoneById(id, req.user);

        res.status(StatusCodes.OK).send('Timezone succesfully edited.');
    }

    async listTimezones(req, res) {
        const timezones = await this.timezonesService.getTimezonesByUser(req.user);

        res.status(StatusCodes.OK).json(timezones);
    }
}

module.exports = TimezonesController;