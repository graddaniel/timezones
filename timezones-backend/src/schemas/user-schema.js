const mongoose = require('mongoose');
const config = require('config');

const roles = config.get('roles')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(roles),
        default: roles.user,
    }
}, {
    versionKey: false,
});

module.exports = UserSchema;