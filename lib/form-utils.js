'use strict';

var fs = require('fs');
var path = require('path');

function loadFiles(type, dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).filter(function(file) {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
        }).forEach(function(file) {
            var object = require(path.join(dir, file));
            type[object.getName()] = object;
        });
    }
}

module.exports = {
    loadFiles: loadFiles
};
