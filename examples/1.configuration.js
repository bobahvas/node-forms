'use strict';

var path = require('path');
var Form = require('node-forms');

Form.configure({
    validators: path.join(__dirname, 'validators'),
    filters: path.join(__dirname, 'validators')
});
