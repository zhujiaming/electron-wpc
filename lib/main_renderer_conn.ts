/*
 * @Author: zhujm
 * @Date: 2022-09-04 14:29:05
 * @Last Modified by: zhujm
 * @Last Modified time: 2022-09-04 14:29:05
 */

import { BrowserWindow, ipcMain, ipcRenderer } from "electron";

/**
 * 渲染进程发送消息给主进程，并监听主进程处理完成事件，获取处理结果
 *
 * renderer --> main
 *      /|\        |
 *       |        \|/
 *       <-- [process]
 */

interface Handler {
  (resolve: Function, reject: Function, args: any): void;
}

class ReplayData {
  code: number = 0;
  data: any;
}

const TIMEOUT = 5 * 1000;

export default class WPCMainRendererConn {
  win?: BrowserWindow;
  delayTime: number = TIMEOUT;

  bindWindow(win: BrowserWindow) {
    this.win = win;
  }

  _getReplyEventId(eventId: string) {
    return `${eventId}_reply`;
  }

  on(eventId: string, handler: Handler) {
    ipcMain.on(eventId, (event: any, args: any) => {
      if (!this.win) {
        throw new Error(
          "[WPCMainRendererConn] BrowserWindow is null,use bindWindow() set BrowserWindow"
        );
      }
      var replyArgsWrapper: ReplayData = new ReplayData();
      try {
        handler &&
          handler(
            (reply_args: any) => {
              //console.log("resolve run:", reply_args);
              replyArgsWrapper.code = 0;
              replyArgsWrapper.data = reply_args;
              this.win?.webContents.send(
                this._getReplyEventId(eventId),
                replyArgsWrapper
              );
            },
            (error: any) => {
              //console.log("reject run:", error);
              replyArgsWrapper.code = -1;
              replyArgsWrapper.data = error;
              this.win?.webContents.send(
                this._getReplyEventId(eventId),
                replyArgsWrapper
              );
            },
            args
          );
      } catch (e) {
        replyArgsWrapper.code = -1;
        replyArgsWrapper.data = e;
        this.win?.webContents.send(
          this._getReplyEventId(eventId),
          replyArgsWrapper
        );
      }
    });
  }

  removeListener(eventId: string) {
    ipcMain.removeAllListeners(eventId);
  }

  send(eventId: string, args: any) {
    const taskPromiss = new Promise((resolve, reject) => {
      ipcRenderer.send(eventId, args);
      ipcRenderer.once(
        this._getReplyEventId(eventId),
        (event: any, args_reply: any) => {
          var replyData: ReplayData = args_reply as ReplayData;
          if (replyData.code == 0) {
            resolve(replyData.data);
          } else {
            reject(replyData.data);
          }
        }
      );
    });
    const delayPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("timeout");
        ipcRenderer.removeAllListeners(this._getReplyEventId(eventId));
      }, this.delayTime);
    });
    return Promise.race([taskPromiss, delayPromise]);
  }

  setTimeOut(delay: number) {
    this.delayTime = delay;
  }
}
