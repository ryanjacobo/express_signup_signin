'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "fixed_usermodel",
    "created": "2020-07-17T01:46:07.093Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "Users",
        {
            "userid": {
                "type": Sequelize.INTEGER,
                "field": "userid",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "firstname": {
                "type": Sequelize.STRING(45),
                "field": "firstname",
                "allowNull": false
            },
            "lastname": {
                "type": Sequelize.STRING(45),
                "field": "lastname",
                "allowNull": false
            },
            "email": {
                "type": Sequelize.STRING,
                "field": "email",
                "allowNull": false,
                "unique": true
            },
            "username": {
                "type": Sequelize.STRING(45),
                "field": "username",
                "allowNull": false,
                "unique": true
            },
            "password": {
                "type": Sequelize.STRING,
                "field": "password",
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
