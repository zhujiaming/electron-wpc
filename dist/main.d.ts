import { BrowserWindow } from 'electron';
/**
 * 窗口的通讯接收者注册
 * 用于main进程注册ProviderWindow
 * @param providerWin
 * @param tagIds
 */
export declare function registProviderWindow(providerWin: BrowserWindow, ...tagIds: string[]): void;
export declare function unRegistProviderWindow(...tags: string[]): void;
