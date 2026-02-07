#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 使用 npm run 调用，由包管理器解析 PATH（兼容 npm/pnpm/yarn 及 .bin 结构）
// 1. 启动 Vite（后台）
const vite = spawn(npmCmd, ['run', 'dev:vite'], { cwd: root, stdio: 'inherit' });
vite.on('error', (err) => {
  console.error('Vite 启动失败:', err);
  process.exit(1);
});

// 2. 先编译 Electron 再启动
async function runElectron() {
  const tsc = spawn(npmCmd, ['run', 'transpile:electron'], { cwd: root, stdio: 'inherit' });
  await new Promise((resolve, reject) => {
    tsc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`tsc exit ${code}`))));
  });

  const electron = spawn(npmCmd, ['run', 'electron:start'], {
    cwd: root,
    stdio: 'inherit',
  });
  electron.on('close', (code) => {
    vite.kill();
    process.exit(code ?? 0);
  });
  electron.on('error', (err) => {
    console.error('Electron 启动失败:', err);
    vite.kill();
    process.exit(1);
  });
}

runElectron().catch((err) => {
  console.error(err);
  vite.kill();
  process.exit(1);
});
