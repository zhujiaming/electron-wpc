import { BrowserWindow, ipcMain } from 'electron';
/**
 * 窗口间通讯，main进程注册
 */
/* eslint-disable */
export default class WinConnBradge {
    private id!: string;

    private winA!: BrowserWindow | null;
    private winB!: BrowserWindow | null;

    private winTagA!: string;
    private winTagB!: string;

    private isUnbind: boolean = false;

    constructor() {
        this.id = 'WinConnBradgeId' + new Date().toString();
    }

    /**
     * 
     * @param winA 窗口A
     * @param winTagA 窗口A的唯一标识
     * @param WinB 窗口B
     * @param winTagB 窗口B的唯一标识
     * @param id AB之间通讯的id
     */
    bind(
        winA: BrowserWindow,
        winTagA: string,
        WinB: BrowserWindow,
        winTagB: string,
        id: string
    ) {
        this.winA = winA;
        this.winB = WinB;
        this.winTagA = winTagA;
        this.winTagB = winTagB;
        this.id = id;
        this.init();
    }

    unBind() {
        this.isUnbind = true;
        this.winA = null;
        this.winB = null;
        ipcMain.removeAllListeners(this.id);
    }

    init() {
        if (this.winA != null) {
            ipcMain.on(this.id, (event: string, message: any) => {
                if (this.isUnbind) {
                    return;
                }
                this.handleConn(message);
            });
        }
    }

    private checkWinEnable(win?: BrowserWindow) {
        return !(win == null || !win.isClosable() || win.isDestroyed());
    }

    /**
     *  转发消息到对应的window page
     * @param arg {key:'winA#xxxx',params:{xxx}}
     *
     */
    private handleConn(arg: any) {
        console.log('hand conn mesg:',arg);
        const key: string = arg.key;
        let keyargs = key.split('#');

        if (keyargs.length != 2) {
            return;
        }

        const targetWinTag = keyargs[0];
        const keySend = keyargs[1];

        if (
            targetWinTag === this.winTagA &&
            this.winA !== null &&
            this.checkWinEnable(this.winA)
        ) {
            this.winA.webContents.send(keySend, arg.params);
        } else if (this.winB !== null && this.checkWinEnable(this.winB)) {
            this.winB.webContents.send(keySend, arg.params);
        }
    }
}
