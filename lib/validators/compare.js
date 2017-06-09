'use strict';

function Validator() {
    this.message = '"{attribute}" must compare with "{compareAttribute}"';
}

Validator.getName = function() {
    return 'compare';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute, params) {
    if (attributes[attribute]){
        if (params.compareAttribute) {
            return attributes[params.compareAttribute] && attributes[attribute].value === attributes[params.compareAttribute].value;
        } else if (params.compareValue) {
            switch (params.operator) {
                case '===':
                    this.message = '"{attribute}" must be equal to "{compareValue}"';
                    return attributes[attribute].value === params.compareValue;
                case '!=':
                    this.message = '"{attribute}" must not be equal to "{compareValue}"';
                    return attributes[attribute].value !== params.compareValue;
                case '!==':
                    this.message = '"{attribute}" must not be equal to "{compareValue}"';
                    return attributes[attribute].value !== params.compareValue;
                case '>':
                    this.message = '"{attribute}" must be greater than "{compareValue}"';
                    return attributes[attribute].value > params.compareValue;
                case '>=':
                    this.message = '"{attribute}" must be greater than or equal to "{compareValue}"';
                    return attributes[attribute].value >= params.compareValue;
                case '<':
                    this.message = '"{attribute}" must be less than "{compareValue}"';
                    return attributes[attribute].value < params.compareValue;
                case '<=':
                    this.message = '"{attribute}" must be less than or equal to "{compareValue}"';
                    return attributes[attribute].value <= params.compareValue;
                case '==':
                default:
                    this.message = '"{attribute}" must be equal to "{compareValue}"';
                    return attributes[attribute].value === params.compareValue;
            }
        }
    }
    return false;
};

module.exports = Validator;
