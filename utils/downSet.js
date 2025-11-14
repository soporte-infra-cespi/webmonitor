var _ = require('lodash');
var logger =  require('./../logger.js');
var downInstances = [];

function put(municipality){
  if(!contains(municipality)){
    downInstances.push({instance:municipality, date: new Date()});
  }
}

function remove(municipality){
  _.remove(downInstances, function(downLog){
    return downLog.instance.nombre == municipality.nombre;
  });
}

function getLog(municipality){
    return _.find(downInstances, function(downLog){
      return downLog.instance.nombre == municipality.nombre;
    });
}

function contains(municipality){
  return _.some(downInstances, function(downLog){
    return downLog.instance.nombre == municipality.nombre;
  });
}

function filterByNew(instances) {
  logger.info(`currently down instances ${downInstances.map(d => d.instance.nombre).sort().join(', ')}`)
  const newNames = new Set(instances.map(i => i.nombre));
  downInstances = downInstances.filter(di => 
    newNames.has(di.instance.nombre)
  );
  logger.info(`currently down instances ${downInstances.map(d => d.instance.nombre).sort().join(', ')}`)
}

module.exports = {
  put:put,
  remove:remove,
  contains:contains,
  getLog:getLog,
  filterByNew:filterByNew
}
