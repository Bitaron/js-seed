'use strict';

var Dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionsConstants = require('./action.constant.js');
var assign = require('object-assign');

var TimeData = require('./time.data.bo');



var TimeStore = assign({}, EventEmitter.prototype, {

    getLocation: function() {
        return TimeStore.timeData;
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

TimeStore.timeData = new TimeData();

TimeStore.internals = {
    init: function(data) {
        return TimeStore.timeData.fetch(data).then(function successfulCallback(response) {
            TimeStore.emitChange();
        });
    }
};

Dispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.actionType) {
        case ActionsConstants.LOAD_LOCATION:
            TimeStore.internals.init(action.data);
            break;
        default:
            return true;
    }
    return true;
});

module.exports = LocationStore;