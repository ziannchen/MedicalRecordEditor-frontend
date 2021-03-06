const electron = require("electron");
const url = require("url");
const path = require("path");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const { ipcMain } = require("electron");
// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

// 当所有窗口被关闭了，退出。
app.on("window-all-closed", function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != "darwin") {
        app.quit();
    }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on("ready", function() {
    console.log(process.argv);
    let param = process.argv[process.argv.length - 1].split("=");
    // 创建浏览器窗口。
    console.log(param);
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    if (param.length != 2) {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, "/dist/index.html"),
                protocol: "file:",
                slashes: true,
                hash: "patients"
            })
        );
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, "/dist/index.html"),
                protocol: "file:",
                slashes: true,
                hash: "patients/" + param[1]
            })
        );
    }

    // 打开开发工具
    mainWindow.openDevTools();

    // 当 window 被关闭，这个事件会被发出
    mainWindow.on("closed", function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        mainWindow = null;
    });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("submit", (event, arg) => {
    console.log(arg); // prints "ping"
    event.reply("reply", "pong");
});