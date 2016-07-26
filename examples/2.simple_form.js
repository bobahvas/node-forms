'use strict';

var path = require('path');
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
}).then(function() {
    console.log(form.getErrors());
    console.log(form.getAttributes());
});

/* OR */

var form2 = new Form({
    rules: [
        {attributes: ['name', 'password'], validator: 'required'},
        {attributes: ['type'], validator: 'safe'}
    ],
    attributes: {
        name: 'Test name'
    }
});
form2.validate().then(function(response) {
    console.log(response);
});
