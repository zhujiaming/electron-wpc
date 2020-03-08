/*
 * @Author: zhujm
 * @Date: 2020-01-02 14:28:32
 * @Last Modified by: zhujm
 * @Last Modified time: 2020-03-08 15:09:59
 */
import { BrowserWindow, ipcMain, webContents } from 'electron';
/**
 * 窗口的通讯接收者注册
 * 用于main进程注册ProviderWindow
 * @param providerWin
 * @param tagIds
 */
export function registProviderWindow(
    providerWin: BrowserWindow,
    ...tagIds: string[]
) {
    function callback(commondId: string) {
        return (event: any, args_dup: any) => {
            const targetWebContents = webContents.fromId(args_dup.id_f);
            targetWebContents &&
                targetWebContents.send(commondId, {
                    replytype: args_dup._reply_type,
                    reply: args_dup._reply,
                });
        };
    }
    function checkTagIdValid(tagId: string) {
        if (!tagId) {
            throw new Error('tagId is null.')
        }
        if (ipcMain.listenerCount(tagId) > 0) {
            throw new Error('tagId has been registed.need alert.')
        }
    }
    const webContentsId = providerWin.webContents.id;
    tagIds.forEach(tagId => {
        checkTagIdValid(tagId);
        ipcMain.on(tagId, (event: any, args: any) => {
            args['id_f'] = event.sender.id;
            const commondId = args.id;
            const commondKey = args.key;
            ipcMain.once(commondId, callback(commondId));
            const targetWebContents = webContents.fromId(webContentsId);
            if (!targetWebContents) {
                console.warn('provider webcontents is null!', tagId);
            }
            targetWebContents && targetWebContents.send(commondKey, args);
        });
    });
}

export function unRegistProviderWindow(...tags: string[]) {
    tags.forEach(tag => {
        ipcMain.removeAllListeners(tag);
    });
}
