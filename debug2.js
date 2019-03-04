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
    
    this.removeAllConsoles = function () {
        for (var i = 0; i < this.debugConsoles.length; i++) {
            var c = this.debugConsoles[i];
            if (c.kill) {
                c.kill();
            }
        }
        this.debugConsoles = [];    
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
        if (disabled &&  (disabled.all || (event && disabled[event.toUpperCase()]))) {
            return;
        }

        if (typeof message == 'object') {
            message = JSON.Stringify(message);
        }

        var d = new Date();
        var timestamp =
            ('00' + d.getDate()).slice(-2) + '-' +
            ('00' + (d.getMonth() + 1)).slice(-2) + '-' +
            d.getFullYear() + ' ' +
            ('00' + d.getHours()).slice(-2) + ':' +
            ('00' + d.getMinutes()).slice(-2) + ':' +
            ('00' + d.getSeconds()).slice(-2) + '.' +
            ('000' + d.getMilliseconds()).slice(-3);

        var msg = {event : event, message : message, source : source, timestamp : timestamp};

        if (this.lastMessages) {
            var lastMsg = this.lastMessages[event];
            if (lastMsg && lastMsg.message === message && lastMsg.source === source) {
                return;
            }

            this.lastMessages[event] = msg;
        }

        this.notify(msg);
    };
    
    this.disable = function (source, event) {
        if (source != undefined) {
            var disabled = this.disabledSources[source];
            disabled = disabled ? disabled : {};

            if (event && event != 'all') {
                disabled[event.toUpperCase()] = true;
            } else {
                disabled = {all: true};
            }

            this.disabledSources[source] = disabled;
        }
        
        return this;
    };
    
    this.enableAll = function () {
        this.disabledSources = {};    
    };
    
    this.enable = function (source, event) {
        if (source != undefined) {
            var disabled = this.disabledSources[source];
            if (disabled) {
                if (event && event != 'all') {
                    delete disabled[event.toUpperCase()];

                    if (Object.keys(disabled).length === 0) {
                        delete this.disabledSources[source];
                    }
                } else {
                    delete this.disabledSources[source];
                }
            }
        }
        
        return this;
    };

    this.disableDuplicates = function() {
        this.lastMessages = {};
    }

    this.enableDuplicates = function() {
        this.lastMessages = undefined;
    }
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
        var text =  msg.event ? msg.event.toUpperCase() + ': ' + msg.message : msg.message;
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
    exports = undefined;
} 
