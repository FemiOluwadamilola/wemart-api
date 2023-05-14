const productionLog = require('./prod-log');
const developmentLog = require('./dev-log');
let logger = null
if(process.env.NODE_ENV === 'development'){
   logger = developmentLog()
}else{
  logger = productionLog()
}

module.exports = logger;
