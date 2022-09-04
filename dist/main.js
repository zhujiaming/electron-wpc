"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: zhujm
 * @Date: 2020-01-02 14:28:32
 * @Last Modified by: zhujm
 * @Last Modified time: 2020-03-08 15:09:59
 */
var electron_1 = require("electron");
/**
 * 窗口的通讯接收者注册
 * 用于main进程注册ProviderWindow
 * @param providerWin
 * @param tagIds
 */
function registProviderWindow(providerWin) {
    var tagIds = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        tagIds[_i - 1] = arguments[_i];
    }
    function callback(commondId) {
        return function (event, args_dup) {
            var targetWebContents = electron_1.webContents.fromId(args_dup.id_f);
            targetWebContents &&
                targetWebContents.send(commondId, {
                    replytype: args_dup._reply_type,
                    reply: args_dup._reply,
                });
        };
    }
    function checkTagIdValid(tagId) {
        if (!tagId) {
            throw new Error('tagId is null.');
        }
        if (electron_1.ipcMain.listenerCount(tagId) > 0) {
            throw new Error('tagId has been registed.need alert.');
        }
    }
    var webContentsId = providerWin.webContents.id;
    tagIds.forEach(function (tagId) {
        checkTagIdValid(tagId);
        electron_1.ipcMain.on(tagId, function (event, args) {
            args['id_f'] = event.sender.id;
            var commondId = args.id;
            var commondKey = args.key;
            electron_1.ipcMain.once(commondId, callback(commondId));
            var targetWebContents = electron_1.webContents.fromId(webContentsId);
            if (!targetWebContents) {
                //console.warn('provider webcontents is null!', tagId);
            }
            targetWebContents && targetWebContents.send(commondKey, args);
        });
    });
}
exports.registProviderWindow = registProviderWindow;
function unRegistProviderWindow() {
    var tags = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tags[_i] = arguments[_i];
    }
    tags.forEach(function (tag) {
        electron_1.ipcMain.removeAllListeners(tag);
    });
}
exports.unRegistProviderWindow = unRegistProviderWindow;
