var D = require('../debug2.js');
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

_Log('This message will be displayed now!', 'disabled-source');
_Debug('This message will be displayed now!', 'disabled-source');
_Error('This message will be displayed now!', 'disabled-source');

_DEBUGGER
    .disable('disabled-source', 'DEBUG');

_Log('This message will be displayed again!', 'disabled-source');
_Debug('This message will be not displayed!', 'disabled-source');

_DEBUGGER
    .enable('disabled-source', 'DEBUG')
    .disable(undefined, 'all')
    .enable('unexisted');

_DEBUGGER
    .disable('source1', 'DEBUG')
    .disable('source1', 'ERROR');


_DEBUGGER
    .enable('source1', 'DEBUG')
    .enable('source1', 'WARNING');


_DEBUGGER
    .enable('source1', 'ERROR')
    .enable('source1', 'WARNING');


_DEBUGGER.removeAllConsoles();
_Log('Should not be displayed');

console.log('');
console.log('Testing disable/enable duplicates');

_DEBUGGER
    .addConsole(new SimpleDebugConsole())

_DEBUGGER.disableDuplicates();

_Log('Log - should be displayed only once');
_Log('Log - should be displayed only once');
_Error('Error - should be displayed only once');
_Error('Error - should be displayed only once');
_Log('Log - should be displayed only once');

_Log('Log - should be displayed only once', 'Test');
_Log('Log - should be displayed only once'); // should be displayed

_DEBUGGER.enableDuplicates();

_Log('Log - should be displayed');
_Log('Log - should be displayed');
_Log('Log - should be displayed');

