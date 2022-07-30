const express = require('express');
const { wrap } = require('express-promise-wrap')
const config = require('config');

const extractUserFromJWT = require('../middleware/extract-user-from-jwt');
const allow = require('../middleware/allow');

class TimezoneRoutes {
    constructor(timezonesController) {
        const router = express.Router();

        const {
            admin: ADMIN,
            user: USER,
        } = config.get('roles');
        router.use(extractUserFromJWT);

        //TODO verify privileges inside
        router.post(
            '/add',
            allow([USER, ADMIN]),
            wrap(timezonesController.addTimezone.bind(timezonesController))
        );
        router.patch(
            '/edit',
            allow([USER, ADMIN]),
            wrap(timezonesController.editTimezone.bind(timezonesController))
        );
        router.delete(
            '/delete',
            allow([USER, ADMIN]),
            wrap(timezonesController.deleteTimezone.bind(timezonesController))
        );
        router.get(
            '/list',
            allow([USER, ADMIN]),
            wrap(timezonesController.listTimezones.bind(timezonesController))
        );

        this.router = router;
    }

    getRouter() {
        return this.router;
    }
}

module.exports = TimezoneRoutes;