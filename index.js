// Module: Debug

var _DEBUGGER = new DebugLog();

var _Error = function(message, source) {
    _DEBUGGER.log('error', message, source);
};

var _Debug = function(message, source) {
    _DEBUGGER.log('debug', message, source);
};

var _Log = function(message, source) {
    _DEBUGGER.log('info' , message, source);
};

var _Warning = function(message, source) {
    _DEBUGGER.log('warning' , message, source);
};

function DebugLog() {
    var that = this;
    this.debugConsoles = [];
    this.disabledSources = {};

    this.addConsole = function(console) {
        this.debugConsoles.push(console);
        
        return this;
    };

    this.notify = function(msg) {
        for (var i = 0; i < this.debugConsoles.length; i++) {
            var dConsole = this.debugConsoles[i];
            if (dConsole.log) {
                dConsole.log(msg);
            }
        }
    };

    this.log = function(event, message, source) {
        var disabled = this.disabledSources[source];
        if (disabled &&  (disabled.all || disabled[event])) {
            return;
        }

        if (typeof message == 'object') {
            message = JSON.Stringify(message);
        }

        var msg = {event : event, message : message, source : source, timestamp : new Date()};

        this.notify(msg);
    };
    
    this.disable = function (source, event) {
        var obj = {};
        if (event) {
            obj[event] = true;
        } else {
            obj.all = true;
        }

        this.disabledSources[source] = obj;

        
        return this;
    };
    
    this.enable = function (source, event) {
        var disabled = this.disabledSources[source];
        if (!disabled) {
            return;
        }

        if (event) {
            delete disabled[event];
        } else {
            delete this.disabledSources[source];
        }
        
        return this;
    };
    
}

function SimpleDebugConsole() {

    this.log = function (msg) {
        var text =  this.msgToString(msg);

        if (typeof IR !== 'undefined') {
            IR.Log(text);
        } else {
            console.log(text);
        }
    };

    this.msgToString = function(msg) {
        var text =  msg.event ? msg.event + ': ' + msg.message : msg.message;
        if (msg.source) text += " (" + msg.source + ")";
        return text;
    };
    
}

// Necessary to use in IridiumMobile
if (typeof IR === 'object') {
    var exports = {};
}

exports._DEBUGGER = _DEBUGGER;
exports._Log = _Log;
exports._Debug = _Debug;
exports._Error = _Error;
exports.SimpleDebugConsole = SimpleDebugConsole;

// Necessary to use in IridiumMobile
if ((typeof IR === 'object') && (typeof module === 'object')) {
    module['debug2'] = exports;
    exports = null;
} 
