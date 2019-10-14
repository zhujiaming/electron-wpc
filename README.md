## electron-wpc

electron 窗口渲染的内容逻辑运行在renderer进程，窗口管理与应用管理逻辑运行在main进程，窗口之间的渲染内容的通讯无法直接进行，需要通过main进行中转，该工具通过封装该中转过程，实现Electron窗口间通讯。

### 集成与应用

[Electron针对窗口间通讯的一种实现](https://zhujm.top/2019/09/04/201909041838/)

### 运行示例

```powershell
npm install
npm run test
```

### 效果图
<img src="https://zhujm.top/images/electron-wpc.png" alt="demo" style="zoom:80%;" />


