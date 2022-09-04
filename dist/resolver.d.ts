/**
 * 使用该对象发送指令至接收者
 */
export default class WindowMsgResolver {
    tag: string;
    delayTime: number;
    constructor(tag: string);
    send(key: string, args: any): Promise<unknown>;
    setTimeOut(delay: number): void;
}
