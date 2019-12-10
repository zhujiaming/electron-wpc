import WinConnBridge from './connbridge/main';
import WinConnBridgeHandle from './connbridge/renderer';
import { registProviderWindow, unRegistProviderWindow } from './v2/main';
import ResolverDelegate from './v2/resolver';
import ProviderDelegate from './v2/provider';


/**
 * 1.两个窗口间的通讯
 * 2.基于生产者消费者模式的通讯(生产者被动接受消费者消息并处理，并返回结果给消费者)
 */
export {
    WinConnBridge,
    WinConnBridgeHandle,
    //-----------------
    registProviderWindow,
    unRegistProviderWindow,
    ResolverDelegate,
    ProviderDelegate
};
