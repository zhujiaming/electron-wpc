/**
 * 生产者使用该对象接收指令处理并回复
 */
interface Handler {
    (resolve: Function, reject: Function, args: any): void;
}
export default class WindowMsgProvider {
    test(): void;
    on(channel: string, handler: Handler): void;
    removeAllListeners(...channels: string[]): void;
}
export {};
