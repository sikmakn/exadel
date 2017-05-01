const DiskDB = require('diskdb');

const db = DiskDB.connect('./private/db', ['store']).store;

function sessStore(Store) {
  Store.call(this, {});
  this.set = function (sid, session, callback) {
    const sessObj = db.save({ sid, session });
    if (sessObj) {
      callback(null, session);
    } else {
      callback(new Error('Can`t save session'));
    }
  };

  this.get = function (sid, callback) {
    const sessObj = db.findOne({ sid });
    if (sessObj) {
      callback(null, sessObj);
    } else {
      callback(new Error('Can`t find session'));
    }
  };

  this.destroy = function (sid, callback) {
    const sessObj = db.findOne({ sid });
    db.remove({ sid }, false);
    if (db.findOne({ sid })) {
      callback(new Error('Can`t delete session'));
    } else {
      callback(null, sessObj);
    }
  };

  this.length = function (callback) {
    callback(null, db.count());
  };

  this.clear = function (callback) {
    db.remove();
    callback();
  };
}

module.exports = connect =>
  sessStore(connect.Store ? connect.Store : connect.session.Store);
