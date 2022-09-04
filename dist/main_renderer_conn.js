"use strict";
/*
 * @Author: zhujm
 * @Date: 2022-09-04 14:29:05
 * @Last Modified by: zhujm
 * @Last Modified time: 2022-09-04 14:29:05
 */
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ReplayData = /** @class */ (function () {
    function ReplayData() {
        this.code = 0;
    }
    return ReplayData;
}());
var TIMEOUT = 5 * 1000;
var WPCMainRendererConn = /** @class */ (function () {
    function WPCMainRendererConn() {
        this.delayTime = TIMEOUT;
    }
    WPCMainRendererConn.prototype.bindWindow = function (win) {
        this.win = win;
    };
    WPCMainRendererConn.prototype._getReplyEventId = function (eventId) {
        return eventId + "_reply";
    };
    WPCMainRendererConn.prototype.on = function (eventId, handler) {
        var _this = this;
        electron_1.ipcMain.on(eventId, function (event, args) {
            var _a;
            if (!_this.win) {
                throw new Error("[WPCMainRendererConn] BrowserWindow is null,use bindWindow() set BrowserWindow");
            }
            var replyArgsWrapper = new ReplayData();
            try {
                handler &&
                    handler(function (reply_args) {
                        var _a;
                        //console.log("resolve run:", reply_args);
                        replyArgsWrapper.code = 0;
                        replyArgsWrapper.data = reply_args;
                        (_a = _this.win) === null || _a === void 0 ? void 0 : _a.webContents.send(_this._getReplyEventId(eventId), replyArgsWrapper);
                    }, function (error) {
                        var _a;
                        //console.log("reject run:", error);
                        replyArgsWrapper.code = -1;
                        replyArgsWrapper.data = error;
                        (_a = _this.win) === null || _a === void 0 ? void 0 : _a.webContents.send(_this._getReplyEventId(eventId), replyArgsWrapper);
                    }, args);
            }
            catch (e) {
                replyArgsWrapper.code = -1;
                replyArgsWrapper.data = e;
                (_a = _this.win) === null || _a === void 0 ? void 0 : _a.webContents.send(_this._getReplyEventId(eventId), replyArgsWrapper);
            }
        });
    };
    WPCMainRendererConn.prototype.removeListener = function (eventId) {
        electron_1.ipcMain.removeAllListeners(eventId);
    };
    WPCMainRendererConn.prototype.send = function (eventId, args) {
        var _this = this;
        var taskPromiss = new Promise(function (resolve, reject) {
            electron_1.ipcRenderer.send(eventId, args);
            electron_1.ipcRenderer.once(_this._getReplyEventId(eventId), function (event, args_reply) {
                var replyData = args_reply;
                if (replyData.code == 0) {
                    resolve(replyData.data);
                }
                else {
                    reject(replyData.data);
                }
            });
        });
        var delayPromise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject("timeout");
                electron_1.ipcRenderer.removeAllListeners(_this._getReplyEventId(eventId));
            }, _this.delayTime);
        });
        return Promise.race([taskPromiss, delayPromise]);
    };
    WPCMainRendererConn.prototype.setTimeOut = function (delay) {
        this.delayTime = delay;
    };
    return WPCMainRendererConn;
}());
exports.default = WPCMainRendererConn;
