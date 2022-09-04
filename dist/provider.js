"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: zhujm
 * @Date: 2020-01-02 14:29:05
 * @Last Modified by: zhujm
 * @Last Modified time: 2020-03-08 13:40:26
 */
var electron_1 = require("electron");
var WindowMsgProvider = /** @class */ (function () {
    function WindowMsgProvider() {
    }
    WindowMsgProvider.prototype.test = function () {
        try {
            throw new Error('手动抛出异常');
        }
        catch (error) {
            //console.log(error);
        }
        finally {
            //console.log('执行了finally语句块');
        }
    };
    WindowMsgProvider.prototype.on = function (channel, handler) {
        electron_1.ipcRenderer.on(channel, function (event, commondArgs) {
            var commondId = commondArgs.id;
            // //console.log('commondArgs:', commondArgs);
            try {
                handler &&
                    handler(function (reply_args) {
                        //console.log('resolve run:', reply_args);
                        commondArgs['_reply_type'] = 'nomal';
                        commondArgs['_reply'] = reply_args;
                        electron_1.ipcRenderer.send(commondId, commondArgs);
                    }, function (error) {
                        //console.log('reject run:', error);
                        commondArgs['_reply_type'] = 'error';
                        commondArgs['_reply'] = error;
                        electron_1.ipcRenderer.send(commondId, commondArgs);
                    }, commondArgs.args);
            }
            catch (error) {
                var e = error;
                //console.error('handle commond error;', e);
                commondArgs['_reply_type'] = 'error';
                var errmsg = e.message;
                commondArgs['_reply'] = errmsg ? errmsg : "unkown error,check provider renderer process's log.";
                electron_1.ipcRenderer.send(commondId, commondArgs);
            }
        });
    };
    WindowMsgProvider.prototype.removeAllListeners = function () {
        var channels = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            channels[_i] = arguments[_i];
        }
        channels.forEach(function (channel) {
            electron_1.ipcRenderer.removeAllListeners(channel);
        });
    };
    return WindowMsgProvider;
}());
exports.default = WindowMsgProvider;
