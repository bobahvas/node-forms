'use strict';

function Filter() {

}

Filter.getName = function() {
    return 'trim';
};

Filter.prototype.filter = function(attributes, attribute) {
    var value = attributes[attribute].value;
    if (typeof value === 'string') {
        return value.trim();
    }
    return value;
};

module.exports = Filter;
