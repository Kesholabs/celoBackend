 const server  = require('./Host/config/app')()
 const config = require('./Host/config/env_config/config')


 server.create(config)

 server.start()