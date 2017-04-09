/**
 * Created by Никита on 01.04.2017.
 */
"use strict";
const DiskDB = require('diskdb');
const db = DiskDB.connect(__dirname + '/db', ['users']);

function userInformation(login, password) {
    this.login = login;
    this.password = password;
}

function findUserOrRegister(name, password) {
    const user = db.users.findOne({login: name});

    if (user) {
        if (user.password === password) {
            return 'successfully_login';
        } else {
            return 'wrong_password';
        }
    } else {
        db.users.save(new userInformation(name, password));
        return 'successfully_registered';
    }
}

exports.findUserOrRegister = findUserOrRegister;