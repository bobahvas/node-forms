# node-forms

A library for form validation

####Installation
To install node-forms in the directory and save it in the dependencies list. For example:
```
$ npm install node-forms —save
```
To install node-forms temporarily and not add it to the dependencies list, omit the —save option:
```
$ npm install node-forms
```

####Quick Start
```js
var Form = require('node-forms');

var form = new Form();
form.setRules([
    {attributes: ['name', 'password'], validator: 'required'},
    {attributes: ['type'], validator: 'safe'}
]);
form.setAttributes({
    name: 'Test name'
});
form.validate().then(function(response) {
    console.log(response);
    console.log(form.getAttribute('name'));
    console.log(form.getAttribute('password'));
    console.log(form.getAttribute('type'));
    console.log(form.getErrors());
    console.log(form.getAttributes());
});
```

Or simpler:
```js
var Form = require('node-forms');

var form = new Form({
    rules: [
        {attributes: ['name', 'password'], validator: 'required'},
        {attributes: ['type'], validator: 'safe'}
    ],
    attributes: {
        name: 'Test name'
    },
    language: 'en'
});
form.validate().then(function(formErrors) {
    console.log(formErrors);
});
```

#### Configuration
Set paths to dirs with your custom validators and filters.
If name of your custom validator (or custom filter) matches with name of default validator (or default filter) node-forms will take your new validator (filter).
```js
var path = require('path');
var Form = require('node-forms');

Form.configure({
    validators: path.join(__dirname, 'validators'),
    filters: path.join(__dirname, 'filters')
});
```

Redeclare translation method
```js
Form.i18n = function(message, params, language) {
    return your_custom_function(message, params, language);
};
```

#### Customizing Error Messages
Most validators have default error messages. You can customize the error message of a rule by specifying the message property when declaring the rule, like the following:
```js
var form = new Form({
    rules: [
        {attributes: ['name'], validator: 'required', params: {
            message: 'Very important attribute'
        }}
    ]
});
```
Some validators may support additional error messages to more precisely describe different causes of validation failures. You may configure these error messages like configuring other properties of validators in a validation rule. All variables from `params` property are available into `i18n` function. For more see `number` or `string` validators.

#### Filters
###### trim
```js
var form = new Form({
    rules: [
        {attributes: ['name'], validator: 'required', filters: 'trim'}
    ],
    attributes: {
        name: ' Test name '
    }
});
```
This filter does not perform data validation. Instead, it will trim the surrounding white spaces around the input value.

#### Validators
###### safe
```js
var form = new Form({
    rules: [
        {attributes: ['name'], validator: 'safe'}
    ],
    attributes: {
        name: 'Test name'
    }
});
```
This validator does not perform data validation. Instead, it is used to mark an attribute to be a safe attribute.

###### required
```js
var form = new Form({
    rules: [
        {attributes: ['name'], validator: 'required'}
    ]
});
```
This validator checks if the input value is provided and not empty.

###### range
```js
var form = new Form({
    rules: [
        {attributes: ['type'], validator: 'range', params: {
            values: [1, 2, 3],
            not: false
        }}
    ]
});
```
This validator checks if the input value can be found among the given list of values.

* `values`: a list of given values within which the input value should be looked for.
* `not`: whether the validation result should be inverted. Defaults to false. When this property is set true, the validator checks if the input value is NOT among the given list of values.
* `skipOnEmpty`: whether the validation can be skipped if the input is empty. Defaults to `false`, which means the input is required.

###### compare
```js
var form = new Form({
    rules: [
        {attributes: ['password', 'password_confirm'], validator: 'required', filters: 'trim'},
        {attributes: ['password_confirm'], validator: 'compare', params: {
            compareAttribute: 'password'
        }}
    ],
    attributes: {
        password: '123456',
        password_confirm: '1234567'
    }
});
```
Or
```js
var form = new Form({
    rules: [
        {attributes: ['number'], validator: 'compare', params: {
            compareValue: 10,
            operator: '>'
        }}
    ],
    attributes: {
        number: 1
    }
});
```
This validator compares the specified input value with another one.

* `compareAttribute`: the name of the attribute whose value should be compared with.
* `compareValue`: a constant value that the input value should be compared with.
* `operator`: the comparison operator. Defaults to `==`.
    * `==`: check if two values are equal. The comparison is done is non-strict mode.
    * `===`: check if two values are equal. The comparison is done is strict mode.
    * `!=`: check if two values are NOT equal. The comparison is done is non-strict mode.
    * `!==`: check if two values are NOT equal. The comparison is done is strict mode.
    * `>`: check if value being validated is greater than the value being compared with.
    * `>=`: check if value being validated is greater than or equal to the value being compared with.
    * `<`: check if value being validated is less than the value being compared with.
    * `<=`: check if value being validated is less than or equal to the value being compared with.


###### number
```js
var form = new Form({
    rules: [
        {attributes: ['number'], validator: 'number', params: {
            integerOnly: true,
            min: 2
        }}
    ],
    attributes: {
        number: 1.2
    }
});
```
This validator checks if the input value is a number. It is equivalent to the double validator.

* `integerOnly`: whether the attribute value can only be an integer. Defaults to false.
* `max`: the upper limit (inclusive) of the value. Set `messageTooSmall` for the customized message used when the number is too small.
* `min`: the lower limit (inclusive) of the value. Set `messageTooBig` param for the customized message used when the number is too big.
* `skipOnEmpty`: whether the validation can be skipped if the input is empty. Defaults to `false`, which means the input is required.

###### string
```js
var form = new Form({
    rules: [
        {attributes: ['word'], validator: 'string', params: {
            min: 1,
            max: 3
        }}
    ],
    attributes: {
        word: 'hello'
    }
});
```
This validator checks if the input value is a valid string with certain length.

* `length`: specifies the length limit of the input string being validated. Set `messageNotEqual` for the customized message.
* `min`: the minimum length of the input string. Set `messageTooShort` for the customized message.
* `max`: the maximum length of the input string. Set `messageTooLong` for the customized message.
* `skipOnEmpty`: whether the validation can be skipped if the input is empty. Defaults to `false`, which means the input is required.

#### Creating custom validators and filters
Besides using the core validators included in the `node-forms` releases, you may also create your own validators. You may create inline validators or standalone validators.

###### Inline validators or filters
Inline validator or filter is an anonymous function.

For validators, first of all, you must set error message `this.params.message`. Inside error message you can use all variables, passed into validator.
It must return boolean value - result of attribute validation.
```js
var form = new Form({
    rules: [
        {attributes: ['name'], validator: function(attributes, attribute, params) {
            this.params.values = ['Alex', 'John'];
            this.params.customText = '!!!';
            this.params.message = '"{attribute}" is invalid{customText}';

            var result = params.values.indexOf(attributes[attribute].value);
            if (params['not']) {
                return -1 === result;
            }
            return -1 !== result;
        }}
    ]
});
```

For filters, you must return prepared attribute value.
```js
var form = new Form({
    rules: [
        {attributes: ['name'], validator: 'safe', filters: ['trim', function(attributes, attribute) {
            var value = attributes[attribute].value;
            return value + '!!';
        }]}
    ],
    attributes: {
        name: ' John ! '
    }
});
```

###### Standalone validators or filters
You can use `es6` classes for custom validators or filters.

Your custom file with validators or filters logic must be placed into validators directory, which attached to `node-forms` plugin. For more information see configuration section.

If you want redeclare logic of an exist plugin, you should set the same name in `getName()` function.

There is an example of standalone validator.
```js
'use strict';

function Validator() {
    this.message = '"{attribute}" is invalid';
}

Validator.getName = function() {
    return 'range';
};

Validator.prototype.getMessage = function() {
    return this.message;
};

Validator.prototype.validate = function(attributes, attribute, params) {
    var result = params.values.indexOf(attributes[attribute].value);
    if (params['not']) {
        return -1 === result;
    }
    return -1 !== result;
};

module.exports = Validator;
```

There is an example of standalone filter.
```js
'use strict';

function Filter() {

}

Filter.getName = function() {
    return 'trim';
};

Filter.prototype.filter = function(attributes, attribute) {
    var value = attributes[attribute].value;
    if (typeof value === 'string') {
        return value.trim();
    }
    return value;
};

module.exports = Filter;
```

###### Asynchronous operation
If you need, you can use `promises`.
For an example, if you are using [sequelize](https://github.com/sequelize/sequelize) ORM, you can use those validators:

Don't forget set right path to sequelize models.

###### Exist validator
```js
'use strict';

const models = require('../../models');

class Validator {

    constructor(params) {
        this.message = 'errors.form.exist';
    }

    static getName() {
        return 'exist';
    }

    getMessage() {
        return this.message;
    }

    validate(attributes, attribute, params) {
        if (params.skipOnEmpty && !attributes[attribute].value) {
            return true;
        } else {
            let where = {};
            where[params.targetAttribute] = attributes[attribute].value;

            let condition = params.filter || [];
            condition.push(where);

            let paranoid = true;
            if (params.paranoid !== undefined) {
                paranoid = params.paranoid;
            }

            return models[params.targetClass].find({
                attributes: [models.Sequelize.fn('NOW')],
                where: condition,
                paranoid: paranoid
            }).then((row) => {
                let result = !!row;
                if (params['not']) {
                    return !result;
                }
                return result;
            });
        }
    }

}

module.exports = Validator;
```

###### Unique validator
```js
'use strict';

const models = require('../../models');

class Validator {

    constructor(params) {
        this.message = 'errors.form.unique';
    }

    static getName() {
        return 'unique';
    }

    getMessage() {
        return this.message;
    }

    validate(attributes, attribute, params) {
        let where = {};
        where[params.targetAttribute] = attributes[attribute].value;
        let condition = params.filter || [];
        condition.push(where);
        return models[params.targetClass].find({attributes: [models.Sequelize.fn('NOW')], where: condition}).then(function(row) {
            return !row;
        });
    }

}

module.exports = Validator;
```

###### Third party libraries
Into custom validators you can use third party libraries.
There is an example of `email` validator, which used [validator](https://github.com/chriso/validator.js) plugin.

```js
'use strict';

const validator = require('validator');

class Validator {

    constructor() {
        this.message = 'errors.form.email';
    }

    static getName() {
        return 'email';
    }

    getMessage() {
        return this.message
    }

    validate(attributes, attribute) {
        return validator.isEmail(attributes[attribute].value);
    }

}

module.exports = Validator;
```

#### Methods

###### setLanguage(language)
Set needed language for error messages. By default `node-forms` uses `en` language.

###### setScenario(scenario)
A `node-forms` may be used in different scenarios. In different scenarios, may use different business rules and logic. By default, it supports only a single scenario named `default`.

Use `on` option in validator to apply rules to specific scenario.
```js
var form = new Form({
    rules: [
        {attributes: ['email', 'password'], validator: 'required'},
        {attributes: ['name'], validator: 'required', on: ['registration']}
    ]
});
form.setScenario('registration');
```
Attribute `name` will be required only if scenario `registration`.

Use `except` option in validator to apply rules to all scenarios, except specific scenario.
```js
var form = new Form({
    rules: [
        {attributes: ['email', 'password'], validator: 'required'},
        {attributes: ['name'], validator: 'required', except: ['registration']}
    ],
    scenario: 'registration'
});
```

###### setRules(rules)
Set list of rules.
```js
var form = new Form();
form.setRules([
    {attributes: ['name'], validator: 'safe'}
]);
```

###### setAttributes(attributes)
Set attributes list.
```js
form.setAttributes({
    name: 'John'
});
```

If you are using [express](https://github.com/expressjs/express) with body parser you can do the following:
```js
form.setAttributes(req.body);
```

###### getAttribute(attribute)
Return attribute value.

###### getAttributes()
Return an object with attributes and attributes values.
```js
{attributeName1: 'Value 1', attributeName2: 'Value 2'}
```
###### validate(attributeNames, clearErrors)
Performs the data validation.
This method executes the validation rules applicable to the current scenario.

* `attributeNames`: List of attribute names that should be validated. If this parameter is empty, it means any attribute listed in the applicable validation rules should be validated.
* `clearErrors`: Whether to call `clearErrors()` before performing validation

Return a promise with errors or empty object.

###### getErrors()
Return an object with error messages.
```js
{attributeName1: 'Error message 1', attributeName2: 'Error message 2'}
```

###### hasErrors(attribute)
Check any errors and return boolean. If pass attribute name it will check only it.

###### clearErrors(attribute)
Removes errors for all attributes or a single attribute.
