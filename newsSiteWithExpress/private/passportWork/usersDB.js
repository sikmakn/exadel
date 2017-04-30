/**
 * Created by Никита on 01.04.2017.
 */

const DiskDB = require('diskdb');

const db = DiskDB.connect('./private/db', ['users']);

function UserInformation(login, password) {
  this.login = login;
  this.password = password;
}

function findUserOrRegister(name, password) {
  const user = db.users.findOne({ login: name });

  if (user) {
    if (user.password === password) {
      return 'successfully_login';
    }
    return 'wrong_password';
  }
  db.users.save(new UserInformation(name, password));
  return 'successfully_registered';
}

exports.findUserOrRegister = findUserOrRegister;
exports.usersDB = db.users;
exports.UserInformation = UserInformation;
