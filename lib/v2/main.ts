import { BrowserWindow, ipcMain, webContents } from 'electron';
/**
 * main进程注册ProviderWindow
 */
/* eslint-disable */
export function registProviderWindow(providerWin: BrowserWindow, tag: string) {
    const webContentsId = providerWin.webContents.id;
    ipcMain.on(tag, (event: any, args: any) => {
        args['id_f'] = event.sender.id;
        ipcMain.once(args.id, (event: any, args: any) => {
            const targetWebContents = webContents.fromId(args.id_f);
            targetWebContents && targetWebContents.send(args.id, args);
        })
        console.log('main receive tag=>', tag);
        console.log('args==>', args);
        const targetWebContents = webContents.fromId(webContentsId);
        if (!targetWebContents) { console.error('provider webcontents is null!', tag) }
        targetWebContents && targetWebContents.send(args.key, args);
    });
}

export function unRegistProviderWindow(tag: string) {
    ipcMain.removeAllListeners(tag);
}

