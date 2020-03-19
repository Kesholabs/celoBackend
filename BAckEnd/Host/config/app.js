const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../../swagger.json')


module.exports = function () {
    let server = express(),
        create,
        start;

    create = (config ) => {
        let routes = require('../routes')

        server.set('env',config.env)
        server.set('port',config.port)
        server.set('hostname',config.hostname)

        server.use(bodyParser.json())
        server.use(bodyParser.urlencoded({
            extended :false
        }))

      
        routes.init(server)
        server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    }

    start = () => {
        let hostname = server.get('hostname')
        port = server.get('port')
        server.listen(port,function(){
            console.log('<-----------------server started--------------------->')
        })
    }
    return {
        create:create,
        start:start
    }

}