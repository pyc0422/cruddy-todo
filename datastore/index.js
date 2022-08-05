const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId((err, id)=>{ return id; });
  // console.log(id);
  // items[id] = text;
  // callback(null, { id, text });
  counter.getNextUniqueId((err, id)=>{
    var file = path.join(exports.dataDir, id + '.txt');
    //console.log(typeof text);
    fs.writeFile(file, text, 'utf8', (err) => {
      if (err) {
        console.log(err);
      } else {
        callback(null, { id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, function(err, items) {
    if (err) {
      callback(err);
    } else {
      var data = _.map(items, (text) => {
        var id = text.split('.')[0];
        return {id, text: id};
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  var file = path.join(exports.dataDir, id + '.txt');
  fs.readFile(file, 'utf8', function(err, content) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: content });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  var file = path.join(exports.dataDir, id + '.txt');
  exports.readOne(id, function(err, content) {
    if (err) {
      callback(err);
      return;
    }
    fs.writeFile(file, text, content, function(err) {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        content.text = text;
        callback(null, content);
      }
    });
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  var file = path.join(exports.dataDir, id + '.txt');
  fs.rm(file, function(err) { //fs.unlink works too
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
