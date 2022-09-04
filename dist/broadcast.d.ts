interface CookTask {
    (resolve: Function, reject: Function, args: any): void;
}
/**
 * 全局广播消息至各个窗口（除去发送者窗口）
 * @param key 待广播事件
 * @param funcCookArgs 加工参数实现，如果不需要对参数加工，则不传
 */
export declare function registBrodcastTransfer(key: string, funcCookArgs: CookTask | null): void;
export declare function unRegistBrodcastTransfer(...keys: string[]): void;
export {};
