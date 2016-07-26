'use strict';

function Validator(options) {
    this.message = 'Required';
}

Validator.getName = function() {
    return 'required';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute) {
    return !!attributes[attribute].value;
};

module.exports = Validator;
