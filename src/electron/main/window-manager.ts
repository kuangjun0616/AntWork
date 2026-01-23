/**
 * 窗口管理器
 * 负责创建和配置应用主窗口
 *
 * @author Claude Code
 * @created 2025-01-23
 * @Email noreply@anthropic.com
 * @copyright AGPL-3.0
 */

import { BrowserWindow, globalShortcut } from "electron";
import { isDev, DEV_PORT } from "../util.js";
import { getPreloadPath, getUIPath, getIconPath } from "../pathResolver.js";
import { cleanup } from "./lifecycle.js";

let mainWindow: BrowserWindow | null = null;

/**
 * 获取主窗口实例
 */
export function getMainWindow(): BrowserWindow | null {
    return mainWindow;
}

/**
 * 创建主窗口
 */
export function createMainWindow(): BrowserWindow {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: getPreloadPath(),
            devTools: true,
        },
        icon: getIconPath(),
        titleBarStyle: "hiddenInset",
        backgroundColor: "#FAF9F6",
        trafficLightPosition: { x: 15, y: 18 }
    });

    // 加载页面
    if (isDev()) {
        mainWindow.loadURL(`http://localhost:${DEV_PORT}`);
    } else {
        mainWindow.loadFile(getUIPath());
    }

    // 开发模式下自动打开开发者工具
    if (isDev() || process.env.OPEN_DEVTOOLS === '1') {
        mainWindow.webContents.openDevTools({ mode: 'bottom' });
    }

    // 设置 CSP 安全头
    setupSecurityHeaders();

    // 设置快捷键
    setupShortcuts();

    // 设置上下文菜单
    setupContextMenu();

    return mainWindow;
}

/**
 * 设置 CSP 安全头
 */
function setupSecurityHeaders(): void {
    if (!mainWindow) return;

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        // 开发环境：允许本地开发服务器和内联脚本
        // 生产环境：严格限制资源来源
        const csp = isDev()
            ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*; style-src 'self' 'unsafe-inline' http://localhost:*;"
            : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.anthropic.com https://*.anthropic.com;";

        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [csp]
            }
        });
    });
}

/**
 * 设置全局快捷键
 */
function setupShortcuts(): void {
    // Cmd/Ctrl+Q 退出应用
    globalShortcut.register('CommandOrControl+Q', () => {
        cleanup();
        // 需要动态导入 app 来避免循环依赖
        import("electron").then(({ app }) => {
            app.quit();
        });
    });

    // F12 打开开发者工具
    globalShortcut.register('F12', () => {
        mainWindow?.webContents.openDevTools();
    });

    // Cmd/Ctrl+Shift+I 打开开发者工具
    globalShortcut.register('CommandOrControl+Shift+I', () => {
        mainWindow?.webContents.openDevTools();
    });
}

/**
 * 设置右键菜单（检查元素）
 */
function setupContextMenu(): void {
    if (!mainWindow) return;

    mainWindow.webContents.on('context-menu', (_event, params) => {
        mainWindow?.webContents.inspectElement(params.x, params.y);
        if (!mainWindow?.webContents.isDevToolsOpened()) {
            mainWindow?.webContents.openDevTools({ mode: 'bottom' });
        }
    });
}
