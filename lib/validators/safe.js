'use strict';

function Validator(options) {
    this.message = '';
}

Validator.getName = function() {
    return 'safe';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function() {
    return true;
};

module.exports = Validator;
