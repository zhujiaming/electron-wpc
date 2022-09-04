"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
/*
 * @Author: zhujm
 * @Date: 2020-01-02 14:28:39
 * @Last Modified by: zhujm
 * @Last Modified time: 2020-03-08 15:10:59
 */
/**
 * 全局广播消息至各个窗口（除去发送者窗口）
 * @param key 待广播事件
 * @param funcCookArgs 加工参数实现，如果不需要对参数加工，则不传
 */
function registBrodcastTransfer(key, funcCookArgs) {
    function startBroadCast(params) {
        var returnValue = 0;
        electron_1.BrowserWindow.getAllWindows().forEach(function (windowItem) {
            var webContentsItem = windowItem.webContents;
            if (webContentsItem.id != params.senderId) {
                if (params.key) {
                    try {
                        webContentsItem.send(params.key, params.args);
                    }
                    catch (e) {
                        //console.error('send broadcast msg error.', e);
                        returnValue = -1;
                    }
                }
                else {
                    //console.error('broadcast key is null.');
                    returnValue = -2;
                }
            }
        });
        return returnValue;
    }
    if (!key) {
        throw new Error('broadcast key is invalid:' + JSON.stringify(key));
    }
    if (electron_1.ipcMain.listenerCount(key) > 0) {
        throw new Error('receiver key has been registed.need alert.');
    }
    electron_1.ipcMain.on(key, function (event, args) {
        var senderId = event.sender.id;
        if (funcCookArgs) {
            //需要加工参数
            funcCookArgs(function (new_args) {
                var returnValue = startBroadCast({ senderId: senderId, key: key, args: new_args });
                event.sender.send(key + '-reply', { code: returnValue, info: null });
            }, function (err) {
                event.sender.send(key + '-reply', { code: -3, info: err });
            }, args);
        }
        else {
            //不需要加工参数
            try {
                var returnValue = startBroadCast({ senderId: senderId, key: key, args: args });
                event.sender.send(key + '-reply', { code: returnValue, info: null });
            }
            catch (e) {
                event.sender.send(key + '-reply', { code: -4, info: e });
            }
        }
    });
}
exports.registBrodcastTransfer = registBrodcastTransfer;
function unRegistBrodcastTransfer() {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
    }
    keys.forEach(function (k) {
        electron_1.ipcMain.removeAllListeners(k);
    });
}
exports.unRegistBrodcastTransfer = unRegistBrodcastTransfer;
