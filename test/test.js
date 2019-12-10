const { app, BrowserWindow } = require('electron')
const {WinConnBridge,registProviderWindow,unRegistProviderWindow} = require('../dist')
// 保持对win1dow对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，win1dow对象将会自动的关闭
let win1,win2,win3;
let winConnBridge;
const PARAMS = require('./cfg');

function createwindow() {

    const screen = require('electron').screen;
    let sw = screen.getPrimaryDisplay().workAreaSize.width;

    const width = 400;
    const height = 300;
    // 创建浏览器窗口。
    win1 = new BrowserWindow({
        x: sw / 2 - width,
        y: 200,
        width,
        height,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // 加载index.html文件
    win1.loadFile('./test/index1.html')

    // 打开开发者工具
    // win1.webContents.openDevTools()

    // 当 win1dow 被关闭，这个事件会被触发。
    win1.on('closed', () => {
        // 取消引用 win1dow 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 win1dow 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        winConnBridge&&winConnBridge.unBindConn();
        unRegistProviderWindow(PARAMS.TAG_WIN_PROVIDER)
        win1 = null
    })

    registProviderWindow(win1,PARAMS.TAG_WIN_PROVIDER);//win1作为Provider
    //------------------------
    // 创建浏览器窗口。
    win2 = new BrowserWindow({
        x: sw / 2,
        y: 230,
        width,
        height,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // 加载index.html文件
    win2.loadFile('./test/index3.html')

    // 打开开发者工具
    // win2.webContents.openDevTools()

    // 当 win1dow 被关闭，这个事件会被触发。
    win2.on('closed', () => {
        // 取消引用 win1dow 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 win1dow 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        winConnBridge&&winConnBridge.unBindConn();
        win2 = null
    })

    // 创建浏览器窗口。
    win3 = new BrowserWindow({
        x: sw / 2,
        y: 250,
        width,
        height,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // 加载index.html文件
    win3.loadFile('./test/index2.html')

    // 打开开发者工具
    // win3.webContents.openDevTools()

    // 当 win1dow 被关闭，这个事件会被触发。
    win3.on('closed', () => {
        // 取消引用 win1dow 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 win1dow 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        winConnBridge&&winConnBridge.unBindConn();
        win3 = null
    })

    initWinConnBridge();
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
    createwindow()
})

// 当全部窗口关闭时退出。
app.on('win1dow-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin1') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win1 === null || win2 === null) {
        createwindow()
    }
})

function initWinConnBridge() {
    winConnBridge = new WinConnBridge();
    winConnBridge.bindConn(win1, PARAMS.TAG_WIN1, win2, PARAMS.TAG_WIN2, PARAMS.CONN_ID);//bind两个窗口
}