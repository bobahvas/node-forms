'use strict';

function Validator(params) {
    this.min = params.min;
    this.max = params.max;
    this.length = params.length || null;
    this.skipOnEmpty = params.skipOnEmpty || false;
    this.message = params.message || 'Value must be a string';
    if (this.min !== undefined) {
        this.messageTooShort = params.messageTooShort || 'Value must contain at least {min, plural, one {# character} other {# characters}}';
    }
    if (this.max !== undefined) {
        this.messageTooLong = params.messageTooLong || 'Value must contain at most {max, plural, one {# character} other {# characters}}';
    }
    if (this.length !== undefined) {
        this.messageNotEqual = params.messageNotEqual || 'Value must contain {length plural, one {# character} other {# characters}}';
    }
}

Validator.getName = function() {
    return 'string';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute) {
    if (this.skipOnEmpty && (
            attributes[attribute].value === undefined ||
            attributes[attribute].value === null ||
            attributes[attribute].value === ''
        )) {
        return true;
    }
    var value = attributes[attribute].value;
    if (typeof value !== 'string') {
        return false;
    }
    var length = value.length;
    if (this.min !== undefined && length < this.min) {
        this.message = this.messageTooShort;
        return false;
    }
    if (this.max !== undefined && length > this.max) {
        this.message = this.messageTooLong;
        return false;
    }
    if (this.length !== undefined && length !== this.length) {
        this.message = this.messageNotEqual;
        return false;
    }
    return true;
};

module.exports = Validator;
