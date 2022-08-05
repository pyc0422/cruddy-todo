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

  const readFiles = (dirname) => {
    const readDirPr = new Promise( (resolve, reject) => {
      fs.readdir(dirname,
        (err, filenames) => (err) ? reject(err) : resolve(filenames));
    });

    return readDirPr.then( filenames => Promise.all(filenames.map((filename) => {
      return new Promise ( (resolve, reject) => {
        fs.readFile(dirname + '/' + filename, 'utf-8', function(err, content) {
          if (err) {
            reject(err);
          } else {
            var id = filename.split('.')[0];
            resolve({id, text: content});
          }
        });
      });
    })).catch( error => Promise.reject(error)));
  };

  readFiles(exports.dataDir)
    .then( allContents => {
      console.log('allcontents: ', allContents);
      callback(null, allContents);
    }, error => console.log(error));
  // var promise = fs.readdir(exports.dataDir, function(err, items) {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     // var data = _.map(items, (text) => {
  //     //   var id = text.split('.')[0];
  //     //   return {id, text: id};
  //     // });

  //     return items.forEach((text) => {
  //       fs.readFile(exports.dataDir + '/' + text, 'utf8', function(err, content) {
  //         console.log({text: content});
  //         if (err) {
  //           callback(err);
  //         } else {
  //           var id = text.split('.')[0];
  //           console.log('before return: ', {id, text: content});
  //           callback(null, {id, text: content});
  //         }
  //       }).then((content) => {data.push(content);});
  //     });
  //     Promise.all(promise).then((values)=> {
  //       console.log('values: ', values);
  //       callback(null, values);
  //     }).catch((err) => {console.log(err);})

  //   }
  // });
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
