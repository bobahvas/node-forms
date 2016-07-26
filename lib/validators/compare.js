'use strict';

var util = require('util');

function Validator(params) {
    this.message = util.format('"%s" must compare with "%s"', params.attribute, params.compareAttribute);
}

Validator.getName = function() {
    return 'compare';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute, params) {
    if (attributes[attribute] && attributes[params.compareAttribute]) {
        return attributes[attribute].value == attributes[params.compareAttribute].value;
    }
    return false;
};

module.exports = Validator;
