/**
 * MCP 服务器管理器性能基准测试
 */

import { describe, bench, beforeAll } from 'vitest';
import { getMcpServerManager, clearMcpServerCache } from '../../src/electron/libs/mcp-server-manager.js';

describe('MCP Server Manager 性能基准', () => {
  beforeAll(async () => {
    // 清除缓存，确保从零开始
    await clearMcpServerCache();
  });

  describe('首次获取（冷启动）', () => {
    bench('获取单个服务器', async () => {
      const manager = getMcpServerManager();
      await manager.acquireServer('memory-tools');
    });

    bench('批量获取所有服务器', async () => {
      const manager = getMcpServerManager();
      await manager.acquireServers();
    });
  });

  describe('重复获取（热启动）', () => {
    bench('获取单个服务器（第2次）', async () => {
      const manager = getMcpServerManager();
      await manager.acquireServer('memory-tools');
    });

    bench('批量获取所有服务器（第2次）', async () => {
      const manager = getMcpServerManager();
      await manager.acquireServers();
    });

    bench('连续获取10次', async () => {
      const manager = getMcpServerManager();
      for (let i = 0; i < 10; i++) {
        await manager.acquireServer('memory-tools');
      }
    });
  });

  describe('引用计数性能', () => {
    bench('acquire + release 100次', async () => {
      const manager = getMcpServerManager();
      for (let i = 0; i < 100; i++) {
        const server = await manager.acquireServer('memory-tools');
        manager.releaseServer('memory-tools');
      }
    });

    bench('批量 acquire + release 10次', async () => {
      const manager = getMcpServerManager();
      for (let i = 0; i < 10; i++) {
        const servers = await manager.acquireServers();
        manager.releaseServers(Object.keys(servers));
      }
    });
  });

  describe('统计信息性能', () => {
    bench('获取统计信息', () => {
      const manager = getMcpServerManager();
      manager.getStats();
    });

    bench('获取统计信息 1000次', () => {
      const manager = getMcpServerManager();
      for (let i = 0; i < 1000; i++) {
        manager.getStats();
      }
    });
  });
});
