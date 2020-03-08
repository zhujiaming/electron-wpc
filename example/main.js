const { app, BrowserWindow } = require('electron')
const { registProviderWindow, unRegistProviderWindow, registBrodcastTransfer, unRegistBrodcastTransfer } = require('../dist')
const PARAMS = require('./cfg');

let win1, win2, win3;

function createwindow() {

    const screen = require('electron').screen;
    let sw = screen.getPrimaryDisplay().workAreaSize.width;

    const width = 400;
    const height = 600;
    win1 = new BrowserWindow({
        // x: sw / 2 - width,
        // y: 200,
        width,
        height,
        center: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win1.loadFile('./example/index_provider.html')
    win1.webContents.openDevTools({ mode: "bottom" })

    win1.on('closed', () => {
        unRegistProviderWindow(PARAMS.TAG_WIN_PROVIDER);
        unRegistBrodcastTransfer(PARAMS.BROADCAST_EXAMPLE_KEY_1, PARAMS.BROADCAST_EXAMPLE_KEY_2);
        win1 = null
    })

    // ************ 在这里将一个窗口注册成ProviderWindow ****************
    registProviderWindow(win1, PARAMS.TAG_FOR_PROVIDER_WINDOW);//win1作为Provider

    // ************ 注册多窗口接收广播 ****************
    //注册多窗口接收广播
    registBrodcastTransfer(PARAMS.BROADCAST_EXAMPLE_KEY_1);
    //注册多窗口接收广播(对数据进行加工)
    registBrodcastTransfer(PARAMS.BROADCAST_EXAMPLE_KEY_2, (resolve, reject, args) => {
        // 对args进行加工
        args.id = args.id + 'xxx';
        resolve(args);
    });


    //------------------------------------------------------------------------------------------------
    win3 = new BrowserWindow({
        x: win1.x + width,
        y: win1.y,
        width,
        height,
        center: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win3.loadFile('./example/index_broadcast.html')
    win3.webContents.openDevTools({ mode: "bottom" })
    win3.on('closed', () => {
        win3 = null
    })

    //------------------------------------------------------------------------------------------------
    win2 = new BrowserWindow({
        x: win1.x - width,
        y: win1.y,
        width,
        height,
        center: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true
        }
    })
    win2.loadFile('./example/index_resolver.html')
    win2.webContents.openDevTools({ mode: "bottom" })
    win2.on('closed', () => {
        win2 = null
    })
}
app.on('ready', () => {
    createwindow()
})

app.on('win1dow-all-closed', () => {
    if (process.platform !== 'darwin1') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win1 === null || win2 === null) {
        createwindow()
    }
})