'use strict';

var util = require('util');

function Validator(params) {
    this.integerOnly = params.integerOnly || false;
    this.min = params.min || null;
    this.max = params.max || null;
    this.message = params.message || params.integerOnly ? 'Value must be an integer' : 'Value must be a number';
    if (this.min) {
        this.messageTooSmall = params.messageTooSmall ? params.messageTooSmall : util.format('Value must be no less than %s', params.min);
    }
    if (params.max) {
        this.messageTooBig = params.messageTooBig ? params.messageTooBig : util.format('Value must be no greater than %s', params.max);
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
    var pattern = this.integerOnly ? this.integerPattern : this.numberPattern;
    var value = '' + attributes[attribute].value;
    if (!value.match(pattern)) {
        return false;
    }
    if (this.min) {
        this.message = this.messageTooSmall;
        return attributes[attribute].value >= params.min;
    }
    if (params.max) {
        this.message = this.messageTooBig;
        return attributes[attribute].value <= params.max;
    }
    return true;
};

module.exports = Validator;
