var Promise = require('bluebird');
const path = require('path');
const _ = require('underscore');
//const counter = require('./counter');
const counter = Promise.promisifyAll(require('./counter'));
//const fs = require('fs');
const fs = Promise.promisifyAll(require('fs'));

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (content, callback) => {
  // var id = counter.getNextUniqueId((err, id)=>{ return id; });
  // console.log(id);
  // items[id] = text;
  // callback(null, { id, text });
  console.log('index create content: ', content);
  counter.getNextUniqueId((err, id)=>{
    var file = path.join(exports.dataDir, id + '.txt');
    //console.log('index create content: ', content);
    var time = content.createTime;
    var text = content.text;
    console.log('time and text: ', time +'//' + text);
    fs.writeFile(file, JSON.stringify(content), 'utf8', (err) => {
      if (err) {
        console.log(err);
      } else {
        callback(null, { id, text: text, createTime: time});
      }
    });
  });
};

exports.readAll = (callback) => {
  // const readFiles = (dirname) => {
  //   const readDirPr = new Promise( (resolve, reject) => {
  //     fs.readdir(dirname,
  //       (err, filenames) => (err) ? reject(err) : resolve(filenames));
  //   });

  // return readDirPr.then( filenames => Promise.all(filenames.map((filename) => {
  //   return new Promise ( (resolve, reject) => {
  //     fs.readFile(dirname + '/' + filename, 'utf-8', function(err, content) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         var id = filename.split('.')[0];
  //         resolve({id, text: content});
  //       }
  //     });
  //   });
  //   })).catch( error => Promise.reject(error)));
  // };

  // readFiles(exports.dataDir)
  //   .then( allContents => {
  //     console.log('allcontents: ', allContents);
  //     callback(null, allContents);
  //   }, error => console.log(error));
  return new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, filenames) => (err) ? reject(err) : resolve(filenames));
  })
    .then( filenames => Promise.all(filenames.map((filename) => {
      return new Promise ( (resolve, reject) => {
        fs.readFile(exports.dataDir + '/' + filename, 'utf-8', function(err, content) {
          if (err) {
            reject(err);
          } else {
            var id = filename.split('.')[0];
            content = JSON.parse(content);
            resolve({id, text: content.text, createTime: content.createTime});
          }
        });
      });
    })).catch( error => Promise.reject(error)))
    .then((values) => { callback(null, values); });
};

exports.readOne = (id, callback) => {
  var file = path.join(exports.dataDir, id + '.txt');
  fs.readFile(file, 'utf8', function(err, content) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      content = JSON.parse(content);
      callback(null, { id, text: content.text, createTime: content.createTime });
    }
  });
};

exports.update = (id, text, callback) => {

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
