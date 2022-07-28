const md5 = require('md5');
const yup = require('yup');

//TODO complete the schema, add accessLevels enum
const schema = yup.object().shape({
    name: yup.string(),
    password: yup.string(),
    accessLevel: yup.string(),
});

class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    //TODO add result handling

    createUser({
        username,
        password,
    }) {
        const passwordHash = md5(password);

        return this.databaseService.createUser({
            username,
            password: passwordHash,
        });
    }

    userExists({
        username,
        password,
    }) {
        const passwordHash = md5(password);

        return this.databaseService.findUser({
            username,
            password: passwordHash
        });
    }
}

module.exports = UsersService;