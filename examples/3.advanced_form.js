'use strict';

var path = require('path');
//var Form = require('node-forms');
var Form = require('../');

var form = new Form({
    rules: [
        {attributes: ['name', 'password'], validator: 'required', filter: 'trim'},
        {attributes: ['email'], validator: 'email'},
        {attributes: ['age'], validator: 'number', params: {
            min: 18,
            integerOnly: false,
            messageTooSmall: 'You should be older than 18'
        }},
        {attributes: ['string'], validator: 'string', params: {
            length: 4,
            messageTooShort: 'Too short'
        }},
        {attributes: ['type'], validator: 'safe'}
    ],
    attributes: {
        name: 'Test name',
        email: 'test@@example.com',
        age: 12,
        string: '12'
    }
});
form.validate().then(function(response) {
    console.log(response);
}).catch(function(error) {
    console.log(error);
});