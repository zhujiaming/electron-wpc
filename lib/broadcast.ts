import { ipcMain, BrowserWindow } from 'electron';
interface CookTask {
    (resolve: Function, reject: Function, args: any): void;
}
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
export function registBrodcastTransfer(key: string, funcCookArgs: CookTask | null) {
    function startBroadCast(params: any) {
        let returnValue = 0;
        BrowserWindow.getAllWindows().forEach(windowItem => {
            const webContentsItem = windowItem.webContents;
            if (webContentsItem.id != params.senderId) {
                if (params.key) {
                    try {
                        webContentsItem.send(params.key, params.args);
                    } catch (e) {
                        console.error('send broadcast msg error.', e);
                        returnValue = -1;
                    }
                } else {
                    console.error('broadcast key is null.');
                    returnValue = -2;
                }
            }
        });
        return returnValue;
    }
    if (!key) {
        throw new Error('broadcast key is invalid:' + JSON.stringify(key));
    }
    if (ipcMain.listenerCount(key) > 0) {
        throw new Error('receiver key has been registed.need alert.')
    }
    ipcMain.on(key, (event: any, args: any) => {
        const senderId = event.sender.id;
        if (funcCookArgs) {
            //需要加工参数
            funcCookArgs((new_args: any) => {
                const returnValue = startBroadCast({ senderId, key, args: new_args });
                event.sender.send(key + '-reply', { code: returnValue, info: null });
            }, (err: any) => {
                event.sender.send(key + '-reply', { code: -3, info: err });
            }, args);
        } else {
            //不需要加工参数
            try {
                const returnValue = startBroadCast({ senderId, key, args });
                event.sender.send(key + '-reply', { code: returnValue, info: null });
            } catch (e) {
                event.sender.send(key + '-reply', { code: -4, info: e });
            }
        }
    });
}

export function unRegistBrodcastTransfer(...keys: string[]) {
    keys.forEach(k => {
        ipcMain.removeAllListeners(k);
    })
}