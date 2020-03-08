/*
 * @Author: zhujm
 * @Date: 2020-01-02 14:28:49
 * @Last Modified by: zhujm
 * @Last Modified time: 2020-03-08 12:49:52
 */
import { ipcRenderer } from 'electron';
const TIMEOUT = 5 * 1000;
/**
 * 使用该对象发送指令至接收者
 */
export default class WindowMsgResolver {
    tag: string;
    delayTime: number = TIMEOUT;
    constructor(tag: string) {
        this.tag = tag;
    }

    send(key: string, args: any) {
        const id = this.tag + Date.now().toString();
        const args_warp = { key, args, id };
        const taskPromise = new Promise((resolve, reject) => {
            ipcRenderer.send(this.tag, args_warp);
            ipcRenderer.once(id, (event: any, args_reply: any) => {
                if (args_reply.replytype == 'error') {
                    reject(args_reply.reply);
                } else {
                    resolve(args_reply.reply);
                }
            });
        });
        const delayPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('timeout');
                ipcRenderer.removeAllListeners(id);
            }, this.delayTime);
        });
        return Promise.race([delayPromise, taskPromise]);
    }

    setTimeOut(delay: number) {
        this.delayTime = delay;
    }
}