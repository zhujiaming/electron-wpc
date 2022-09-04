import { BrowserWindow } from "electron";
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
export default class WPCMainRendererConn {
    win?: BrowserWindow;
    delayTime: number;
    bindWindow(win: BrowserWindow): void;
    _getReplyEventId(eventId: string): string;
    on(eventId: string, handler: Handler): void;
    removeListener(eventId: string): void;
    send(eventId: string, args: any): Promise<unknown>;
    setTimeOut(delay: number): void;
}
export {};
