/**
 * Created by Dominick Martelly on 7/6/2016.
 */

//Setup for our mongoDB
var config = {
    port: 27018,
    db: 'mongodb://localhost/ResumizerPro',
    host: 'localhost'
};

//So other modules can use this db config module
module.exports = config;