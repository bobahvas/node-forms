'use strict';

var util = require('util');

function Validator(params) {
    this.min = params.min || null;
    this.max = params.max || null;
    this.length = params.length || null;
    this.message = params.message || 'Value must be a string';
    if (this.min) {
        this.messageTooShort = params.messageTooShort || util.format('Value must contain at least %s', this.min);
    }
    if (this.max) {
        this.messageTooLong = params.messageTooLong || util.format('Value must contain at most %s', this.max);
    }
    if (this.length) {
        this.messageNotEqual = params.messageNotEqual || util.format('Value must contain %s', this.length);
    }
}

Validator.getName = function() {
    return 'string';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute, params) {
    var value = attributes[attribute].value;
    if (typeof value !== 'string') {
        return false;
    }
    var length = value.length;
    if (this.min && length < this.min) {
        this.message = this.messageTooShort;
        return false;
    }
    if (this.max && length > this.max) {
        this.message = this.messageTooLong;
        return false;
    }
    if (this.length && length !== this.length) {
        this.message = this.messageNotEqual;
        return false;
    }
    return true;
};

module.exports = Validator;
