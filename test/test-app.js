var D = require('../index.js');
var _DEBUGGER = D._DEBUGGER;
var _Log = D._Log;
var _Error = D._Error;
var _Debug = D._Debug;
var SimpleDebugConsole = D.SimpleDebugConsole;

_DEBUGGER
    .addConsole(new SimpleDebugConsole())
    .disable('disabled-source');

_Log('This is a  message', 'test-app');
_Debug('This is a debug message', 'test-app');
_Error('This is a error message', 'test-app');

_Log('This message will be not displayed!', 'disabled-source');
_Debug('This message will be not displayed!', 'disabled-source');
_Error('This message will be not displayed!', 'disabled-source');

_DEBUGGER
    .enable('disabled-source');

_Log('This message will be displayed new!', 'disabled-source');
_Debug('This message will be displayed now!', 'disabled-source');
_Error('This message will be displayed now!', 'disabled-source');

_DEBUGGER
    .disable('disabled-source', 'DEBUG');

_Log('This message will be displayed again!', 'disabled-source');
_Debug('This message will be not displayed!', 'disabled-source');
