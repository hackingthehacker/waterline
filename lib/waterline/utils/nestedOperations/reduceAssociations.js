/**
 * Module Dependencies
 */

var hop = require('../helpers').object.hasOwnProperty;
var _ = require('lodash');

/**
 * Traverse an object representing values replace associated objects with their
 * foreign keys.
 *
 * @param {String} model
 * @param {Object} schema
 * @param {Object} values
 * @return {Object}
 * @api private
 */


module.exports = function(model, schema, values) {
  var self = this;

  Object.keys(values).forEach(function(key) {

    // Check to see if this key is a foreign key
    var attribute = schema[model].attributes[key];

    // If not a plainObject, check if this is a model instance and has a toObject method
    if(!_.isPlainObject(values[key])) {
      if(_.isObject(values[key]) && !Array.isArray(values[key]) && values[key].toObject && typeof values[key].toObject === 'function') {
        values[key] = values[key].toObject();
      } else {
        return;
      }
    }

    if(values[key] === null) return;

    if(!hop(values[key], attribute.on)) return;
    var fk = values[key][attribute.on];
    values[key] = fk;
  });

  return values;
};
