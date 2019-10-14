import { ipcRenderer } from 'electron';
/**
 * 窗口间通讯，render进程注册
 */
/* eslint-disable */
export default class WinConnBridgeHandle {
    targetWinId: string;
    connId: string;

    constructor(connId: string, targetWinId: string) {
        console.log('initconn handle targetWinId:',targetWinId);
        this.targetWinId = targetWinId;
        this.connId = connId;
    }

    getKey(eventName: string): string {
        if(eventName.indexOf('#')>=0){
            throw new Error('eventName can not contains "#"');
        }
        return this.targetWinId + '#' + eventName;
    }

    /**
     * {key:'winA#xxxx',params:{xxx}}
     */
    getArgs(eventName: string, args: any) {
        console.log('getargs:',eventName);
        return {
            key: this.getKey(eventName),
            params: args,
        };
    }

    send(eventName: string, ...args: any[]): void {
        ipcRenderer.send(this.connId, this.getArgs(eventName, args));
    }

    on(eventName: string, callbcak: Function) {
        ipcRenderer.on(eventName, callbcak);
    }

    once(eventName: string, callbcak: Function) {
        ipcRenderer.on(eventName, callbcak);
    }
}
