'use strict';

var Q = require('q');
var path = require('path');
var formUtils = require('./form-utils');
var MessageFormat = require('messageformat');
var mf = new MessageFormat();

function Form(options) {
    options = options || {};

    this.language = 'en';
    this.scenario = 'default';

    this.errors = {};
    this.scenarios = {};

    if (options.scenario) {
        this.setScenario(options.scenario)
    }
    if (options.rules) {
        this.setRules(options.rules)
    }
    if (options.attributes) {
        this.setAttributes(options.attributes)
    }
    if (options.language) {
        this.setLanguage(options.language)
    }

    Form.init();
}

Form.validators = {};
Form.filters = {};
Form.dirs = {
    validators: [
        path.join(__dirname, 'validators')
    ],
    filters: [
        path.join(__dirname, 'filters')
    ]
};

Form.init = function() {
    Form.dirs.validators.forEach(function(dir) {
        formUtils.loadFiles(Form.validators, dir);
    });
    Form.dirs.filters.forEach(function(dir) {
        formUtils.loadFiles(Form.filters, dir);
    });
};

Form.configure = function(options) {
    if (options.validators) {
        Form.dirs.validators.push(options.validators);
    }
    if (options.filters) {
        Form.dirs.filters.push(options.filters);
    }
    Form.init();
};

Form.i18n = function(message, params, language) {
    return mf.compile(message)(params);
};

Form.prototype.setScenario = function(scenario) {
    this.scenario = scenario;
};

Form.prototype.setLanguage = function(language) {
    this.language = language;
};

Form.prototype.clearScenarios = function() {
    this.scenarios = {
        default: []
    };
};

Form.prototype.setScenarios = function(rules) {
    this.clearScenarios();
    rules.forEach(function(rule) {
        if (rule.on) {
            rule.on.forEach(function(scenario) {
                this.scenarios[scenario] = [];
            }.bind(this));
        }
        if (rule.except) {
            rule.except.forEach(function(scenario) {
                this.scenarios[scenario] = [];
            }.bind(this));
        }
    }.bind(this));
};

Form.prototype.setRules = function(rules) {
    this.setScenarios(rules);

    rules.forEach(function(rule) {
        if (!rule.attributes) {
            throw new Error('Empty attributes');
        }
        if (rule.validator) {
            if (!rule.on && !rule.except) {
                for (var scenarioForWithout in this.scenarios) {
                    if (this.scenarios.hasOwnProperty(scenarioForWithout)) {
                        this.setRule(scenarioForWithout, rule);
                    }
                }
            }
            if (rule.on) {
                rule.on.forEach(function(scenario) {
                    if (!rule.except || -1 === rule.except.indexOf(scenario)) {
                        this.setRule(scenario, rule);
                    }
                }.bind(this));
            }
            if (rule.except) {
                for (var scenario in this.scenarios) {
                    if (this.scenarios.hasOwnProperty(scenario)) {
                        if (-1 === rule.except.indexOf(scenario)) {
                            this.setRule(scenario, rule);
                        }
                    }
                }
            }
        }
    }.bind(this));
};

Form.prototype.setRule = function(scenario, rule) {
    rule.attributes.forEach(function(attribute) {
        var params = rule.params || [];
        params['attribute'] = attribute;
        this.scenarios[scenario][attribute] = this.scenarios[scenario][attribute] || {validators: [], filters: []};
        this.scenarios[scenario][attribute].validators.push({
            validator: rule.validator,
            attributes: rule.attributes,
            params: params
        });
        if (rule.filters) {
            if (!Array.isArray(rule.filters)) {
                rule.filters = [rule.filters];
            }
            rule.filters.forEach(function(filter) {
                this.scenarios[scenario][attribute].filters.push(filter);
            }.bind(this));
        }
    }.bind(this));
};

Form.prototype.validate = function(attributeNames, clearErrors) {

    if (!this.scenarios[this.scenario]) {
        throw new Error('Unknown scenario');
    }

    clearErrors = clearErrors || true;
    if (clearErrors) {
        this.clearErrors();
    }

    if (!attributeNames) {
        attributeNames = [];
        for (var index in this.scenarios[this.scenario]) {
            if (this.scenarios[this.scenario].hasOwnProperty(index)) {
                attributeNames.push(index);
            }
        }
    }
    return Q.when().then(function() {
        var promises = [];
        attributeNames.forEach(function(attributeName) {
            var promise = Q.when(false);
            var attribute = this.scenarios[this.scenario][attributeName];
            if (attribute) {
                attribute.filters.forEach(function(filter) {
                    promise = promise.then(function() {
                        if (typeof filter === 'function') {
                            return Q.fcall(function() {
                                return filter.call(filter, this.scenarios[this.scenario], attributeName);
                            }.bind(this)).then(function(value) {
                                this.scenarios[this.scenario][attributeName].value = value;
                            }.bind(this));
                        } else {
                            if (Form.filters[filter]) {
                                var filterItem = new Form.filters[filter]();
                                return Q.fcall(function() {
                                    return filterItem.filter.call(undefined, this.scenarios[this.scenario], attributeName);
                                }.bind(this)).then(function(value) {
                                    this.scenarios[this.scenario][attributeName].value = value;
                                }.bind(this));
                            }
                        }
                    }.bind(this));
                }.bind(this));
            }
            promises.push(promise);
        }.bind(this));
        return Q.all(promises);
    }.bind(this)).then(function() {
        var promises = [];
        attributeNames.forEach(function(attributeName) {
            var promise = Q.when(false);
            var attribute = this.scenarios[this.scenario][attributeName];
            if (attribute) {
                attribute.validators.forEach(function(validator) {
                    promise = promise.then(function(error) {
                        if (error) {
                            return error;
                        }
                        if (typeof validator.validator === 'function') {
                            return Q.fcall(function() {
                                return validator.validator.call(validator, this.scenarios[this.scenario], attributeName, validator.params);
                            }.bind(this)).then(function(value) {
                                if (!validator.params.message) {
                                    throw new Error('Error message cannot be empty');
                                }
                                if (!value) {
                                    this.errors[attributeName] = Form.i18n(validator.params.message, validator.params, this.language);
                                }
                                return !value;
                            }.bind(this));
                        } else {
                            if (Form.validators[validator.validator]) {
                                var validatorItem = new Form.validators[validator.validator](validator.params);
                                return Q.fcall(function() {
                                    return validatorItem.validate.call(validatorItem, this.scenarios[this.scenario], attributeName, validator.params);
                                }.bind(this)).then(function(value) {
                                    if (!value) {
                                        this.errors[attributeName] = Form.i18n(validator.params.message || validatorItem.getMessage(), validator.params, this.language);
                                    }
                                    return !value;
                                }.bind(this));
                            } else {
                                return true;
                            }
                        }
                    }.bind(this));
                }.bind(this));
            }
            promises.push(promise);
        }.bind(this));

        return Q.all(promises).then(function() {
            return this.getErrors();
        }.bind(this))
    }.bind(this));
};

Form.prototype.getAttribute = function(attribute) {
    var object = this.scenarios[this.scenario][attribute];
    if (object) {
        return object.value;
    }
    return null;
};

Form.prototype.getAttribute = function(attribute) {
    var object = this.scenarios[this.scenario][attribute];
    if (object) {
        return object.value;
    }
    return null;
};

Form.prototype.getAttributes = function() {
    var attributes = {};
    for (var attribute in this.scenarios[this.scenario]) {
        if (this.scenarios[this.scenario].hasOwnProperty(attribute)) {
            attributes[attribute] = this.scenarios[this.scenario][attribute].value;
        }
    }
    return attributes;
};

Form.prototype.setAttributes = function(attributes) {
    for (var attribute in attributes) {
        if (attributes.hasOwnProperty(attribute)) {
            for (var scenario in this.scenarios) {
                if (this.scenarios.hasOwnProperty(scenario)) {
                    if (this.scenarios[scenario][attribute]) {
                        this.scenarios[scenario][attribute].value = attributes[attribute];
                    }
                }
            }
        }
    }
};

Form.prototype.clearErrors = function(attribute) {
    if (attribute) {
        this.errors[attribute] = undefined;
    } else {
        this.errors = {};
    }
};

Form.prototype.getErrors = function() {
    return this.errors;
};

Form.prototype.hasErrors = function(attribute) {
    if (attribute) {
        return !!this.errors[attribute];
    }
    return Object.keys(this.errors).length > 0;
};

module.exports = Form;
