'use strict';

function Validator() {
    this.message = 'Required';
}

Validator.getName = function() {
    return 'required';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute) {
    var value = attributes[attribute].value;
    if (value === null) {
        return false;
    } else {
        var type = typeof value;
        switch (type) {
            case 'string':
                return !!value.trim().length;
                break;
            case 'boolean':
            case 'number':
                return true;
        }
    }
    return false;
};

module.exports = Validator;
