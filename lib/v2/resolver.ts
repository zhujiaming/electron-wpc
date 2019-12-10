import { ipcRenderer } from 'electron';
const TIMEOUT = 5*1000;
/**
 * 消费者使用该对象发送指令至生产者
 */
export default class ResolverDelegate{
    tag:string;
    delayTime:number = TIMEOUT;
    constructor(tag:string){
        this.tag = tag;
    }

    send(key:string,args:any){
        const id = this.tag+Date.now().toString();
        const args_warp = {key,args,id};
        const taskPromise = new Promise((resolve,reject)=>{
            ipcRenderer.send(this.tag,args_warp);
            ipcRenderer.once(id,(event:any,_args:any)=>{
                resolve(_args._reply);
            });
        });
        const delayPromise = new Promise((resolve,reject) => {
            setTimeout(()=>{
                reject('timeout');
                ipcRenderer.removeAllListeners(id);
            }, this.delayTime);
        });
        return Promise.race([
            delayPromise,
            taskPromise
        ]);
    }

    setTimeOut(delay:number){
        this.delayTime = delay;
    }
}