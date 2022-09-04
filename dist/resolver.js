"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: zhujm
 * @Date: 2020-01-02 14:28:49
 * @Last Modified by: zhujm
 * @Last Modified time: 2020-03-08 12:49:52
 */
var electron_1 = require("electron");
var TIMEOUT = 5 * 1000;
/**
 * 使用该对象发送指令至接收者
 */
var WindowMsgResolver = /** @class */ (function () {
    function WindowMsgResolver(tag) {
        this.delayTime = TIMEOUT;
        this.tag = tag;
    }
    WindowMsgResolver.prototype.send = function (key, args) {
        var _this = this;
        var id = this.tag + Date.now().toString();
        var args_warp = { key: key, args: args, id: id };
        var taskPromise = new Promise(function (resolve, reject) {
            electron_1.ipcRenderer.send(_this.tag, args_warp);
            electron_1.ipcRenderer.once(id, function (event, args_reply) {
                if (args_reply.replytype == 'error') {
                    reject(args_reply.reply);
                }
                else {
                    resolve(args_reply.reply);
                }
            });
        });
        var delayPromise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject('timeout');
                electron_1.ipcRenderer.removeAllListeners(id);
            }, _this.delayTime);
        });
        return Promise.race([delayPromise, taskPromise]);
    };
    WindowMsgResolver.prototype.setTimeOut = function (delay) {
        this.delayTime = delay;
    };
    return WindowMsgResolver;
}());
exports.default = WindowMsgResolver;
