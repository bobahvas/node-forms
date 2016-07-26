'use strict';

function Filter() {}

Filter.getName = function() {
    return 'trim';
};

Filter.prototype.filter = function(attributes, attribute) {
    var value = attributes[attribute].value;
    if (value !== undefined) {
        return value.trim();
    }
};

module.exports = Filter;
