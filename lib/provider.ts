/*
 * @Author: zhujm
 * @Date: 2020-01-02 14:29:05
 * @Last Modified by: zhujm
 * @Last Modified time: 2020-03-08 13:40:26
 */
import { ipcRenderer } from 'electron';
/**
 * 生产者使用该对象接收指令处理并回复
 */

interface Handler {
    (resolve: Function, reject: Function, args: any): void;
}


export default class WindowMsgProvider {

     test(){
        try {
            throw new Error('手动抛出异常');
        } catch (error) {
            //console.log(error);
        } finally {
            //console.log('执行了finally语句块');
        }
    }
    

    on(channel: string, handler: Handler) {
        ipcRenderer.on(channel, (event: any, commondArgs: any) => {
            const commondId = commondArgs.id;
            // //console.log('commondArgs:', commondArgs);
            try {
                handler &&
                    handler(
                        (reply_args: any) => {
                            //console.log('resolve run:', reply_args);
                            commondArgs['_reply_type'] = 'nomal';
                            commondArgs['_reply'] = reply_args;
                            ipcRenderer.send(commondId, commondArgs);
                        },
                        (error: any) => {
                            //console.log('reject run:', error);
                            commondArgs['_reply_type'] = 'error';
                            commondArgs['_reply'] = error;
                            ipcRenderer.send(commondId, commondArgs);
                        },
                        commondArgs.args
                    );
            } catch (error) {
                const e = error as Error;
                //console.error('handle commond error;', e);
                commondArgs['_reply_type'] = 'error';
                var errmsg = e.message;
                commondArgs['_reply'] = errmsg ? errmsg : "unkown error,check provider renderer process's log.";
                ipcRenderer.send(commondId, commondArgs);
            }
        });
    }

    removeAllListeners(...channels: string[]) {
        channels.forEach(channel => {
            ipcRenderer.removeAllListeners(channel);
        });
    }
}
