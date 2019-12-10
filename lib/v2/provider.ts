import { ipcRenderer } from 'electron';
/**
 * 生产者使用该对象接收指令处理并回复
 */
export default class ProviderDelegate {
    on(channel: string, handle: Function) {
        ipcRenderer.on(channel, (event: any, args: any) => {
            handle && handle((reply_args: any) => {
                args['_reply'] = reply_args;
                ipcRenderer.send(args.id, args);
            }, args);
        });
    }

    removeAllListeners(channel: string) {
        ipcRenderer.removeAllListeners(channel);
    }
}