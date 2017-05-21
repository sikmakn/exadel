const url = require('url');
const util = require('util');
const _ = require('lodash');
const DiskDB = require('diskdb');

const defaultOptions = {
  host: '127.0.0.1',
  port: 27017,
  stringify: false,
  collection: 'sessions',
  expireAfter: 1000 * 60 * 60 * 24 * 14, // 2 weeks
  autoReconnect: false,
  ssl: false,
  w: 1,
};

function getStore(Store) {
  function MyStore(options, callback) {
    Store.call(this, this.options);
    if (typeof options === 'string') {
      this.options = parseUrl(options);
    } else {
      this.options = _.clone(options || {});
      this.options.expireAfter =
        this.options.expireAfter || defaultOptions.expireAfter;
    }

    if (!this.options.hasOwnProperty('stringify')) {
      this.options.stringify = defaultOptions.stringify;
    }

    this.collectionName = this.options.collection || defaultOptions.collection;
    this.collection = DiskDB.connect('./private/db', [
      this.collectionName,
    ]).store;
    if (callback) this.getDatabase(callback);
  }

  util.inherits(MyStore, Store);

  MyStore.prototype.serialize = function (obj) {
    if (this.options.stringify) {
      return JSON.stringify(obj);
    }
    return obj;
  };

  MyStore.prototype.deserialize = function (str) {
    if (this.options.stringify) {
      return JSON.parse(str);
    }
    return str;
  };

  MyStore.prototype.get = function (sid, cb) {
    const sessObj = this.collection.findOne({ sid });
    if (sessObj) {
      cb(null, sessObj.session);
    } else {
      cb(new Error('Can`t find session'));
    }
    if (!sessObj.expires || new Date() < sessObj.expires) {
      cb(null, this.deserialize(sessObj));
      return;
    }
    this.destroy(sid, cb);
  };

  MyStore.prototype.set = function (sid, session, cb) {
    const s = {
      sid,
      cookie: this.serialize(session.cookie),
     // options: this.options || defaultOptions,
    };

    if (session && session.cookie && session.cookie._expires) {
      s.expires = new Date(session.cookie._expires);
    } else {
      s.cookie.expires = new Date(Date.now() + this.options.expireAfter);
    }
    const sessObj = this.collection.update({ sid }, s, { upsert: true });
    if (sessObj) {
      cb(null, sessObj);
    } else {
      cb(new Error('Can`t save session'));
    }
  };

  MyStore.prototype.destroy = function (sid, cb) {
    const sessObj = this.db.findOne({ sid });
    this.db.remove({ sid }, false);
    if (this.db.findOne({ sid })) {
      cb(new Error('Can`t delete session'));
    } else {
      cb(null, sessObj);
    }
  };

  MyStore.prototype.length = function (cb) {
    cb(null, this.db.count());
  };

  MyStore.prototype.clear = function (cb) {
    this.db.remove();
    cb();
  };

  return MyStore;
}

function parseUrl(path) {
  const parsed = {};

  const dbUri = url.parse(path);

  if (dbUri.port) {
    parsed.port = parseInt(dbUri.port);
  }

  if (dbUri.pathname != undefined) {
    const pathname = dbUri.pathname.split('/');

    if (pathname.length >= 2 && pathname[1]) {
      parsed.db = pathname[1];
    }

    if (pathname.length >= 3 && pathname[2]) {
      parsed.collection = pathname[2];
    }
  }

  if (dbUri.hostname != undefined) {
    parsed.host = dbUri.hostname;
  }

  if (dbUri.auth != undefined) {
    const auth = dbUri.auth.split(':');

    if (auth.length >= 1) {
      parsed.username = auth[0];
    }

    if (auth.length >= 2) {
      parsed.password = auth[1];
    }
  }

  return parsed;
}

module.exports = connect =>
  getStore(connect.Store ? connect.Store : connect.session.Store);
