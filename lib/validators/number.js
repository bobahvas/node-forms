'use strict';

function Validator(params) {
    this.integerOnly = params.integerOnly || false;
    this.min = params.min;
    this.max = params.max;
    this.skipOnEmpty = params.skipOnEmpty || false;
    this.message = params.message || params.integerOnly ? 'Value must be an integer' : 'Value must be a number';
    if (this.min !== undefined) {
        this.messageTooSmall = params.messageTooSmall ? params.messageTooSmall : 'Value must be no less than {min}';
    }
    if (params.max !== undefined) {
        this.messageTooBig = params.messageTooBig ? params.messageTooBig : 'Value must be no greater than {max}';
    }
    this.integerPattern = /^\s*[+-]?\d+\s*$/;
    this.numberPattern = /^\s*[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?\s*$/;
}

Validator.getName = function() {
    return 'number';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute, params) {
    if (this.skipOnEmpty && (
            attributes[attribute].value === undefined ||
            attributes[attribute].value === null ||
            attributes[attribute].value === ''
        )) {
        return true;
    }
    var pattern = this.integerOnly ? this.integerPattern : this.numberPattern;
    var value = '' + attributes[attribute].value;
    if (!value.match(pattern)) {
        return false;
    }
    if (this.min !== undefined) {
        this.message = this.messageTooSmall;
        if (attributes[attribute].value < params.min) {
            return false;
        }
    }
    if (params.max !== undefined) {
        this.message = this.messageTooBig;
        if (attributes[attribute].value > params.max) {
            return false;
        }
    }
    return true;
};

module.exports = Validator;
