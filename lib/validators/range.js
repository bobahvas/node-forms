'use strict';

function Validator() {
    this.message = '"{attribute}" is invalid';
}

Validator.getName = function() {
    return 'range';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute, params) {
    var result = params.values.indexOf(attributes[attribute].value);
    if (params['not']) {
        return -1 === result;
    }
    return -1 !== result;
};

module.exports = Validator;
