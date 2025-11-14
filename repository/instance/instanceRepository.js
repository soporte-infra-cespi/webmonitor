var _ = require('lodash');
var logger =  require('../../logger.js');
var config = require('../../config/config.js');
var providers = [];
var successFunction;

for (provider of config.get('INSTANCE_PROVIDERS').split(',')) {
   providers.push(require(`./providers/${provider}Provider/${provider}Provider.js`));
}

function listAll(onComplete) {
  successFunction = onComplete;
  getFromProviderIndex(0,[]);
}

function getFromProviderIndex(index,instances){
  if(index >= providers.length){
    let ignored = config.get('IGNORED_MUNICIPALITIES');
    let instancesToSend = instances;
    if (ignored !== undefined && ignored.trim() !== "") {
      ignored = config.get('IGNORED_MUNICIPALITIES').split(",")

      instancesToSend = _.filter(instances, inst => !_.includes(ignored, inst.nombre));
    }

    // remove down instances that are not on the new instancesToSend
    global.actuallyDown.filterByNew(instancesToSend)

    successFunction(instancesToSend);
  } else {
    providers[index].listAll(function(i){
      getFromProviderIndex(index+1,_.concat(instances,i));
    })
  }
  
}
  
module.exports = {
  listAll:listAll
}
