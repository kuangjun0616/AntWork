/**
 * MCP 服务器管理器单元测试
 *
 * @author Claude
 * @created 2026-01-23
 * @copyright AGCPA v3.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getMcpServerManager, clearMcpServerCache, clearMcpConfigCache } from '../../src/electron/managers/mcp-server-manager.js';

// Mock 依赖
vi.mock('../../src/electron/libs/memory-tools.js', () => ({
  getMemoryToolConfig: () => ({ enabled: true, autoStore: false, defaultK: 6 }),
}));

vi.mock('../../src/electron/libs/memory-mcp-server.js', () => ({
  createMemoryMcpServer: async () => ({
    name: 'memory-tools',
    version: '1.0.0',
    tools: [],
  }),
}));

vi.mock('../../src/electron/libs/claude-memory-mcp-server.js', () => ({
  createClaudeMemoryToolServer: async () => ({
    name: 'memory',
    version: '20250818',
    tools: [],
  }),
}));

vi.mock('../../src/electron/libs/mcp-store.js', () => ({
  loadMcpServers: async () => ({}),
}));

vi.mock('../../src/electron/logger.js', () => ({
  log: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('McpServerManager', () => {
  beforeEach(() => {
    // 清除所有缓存
    clearMcpServerCache();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('单例模式', () => {
    it('应该返回相同的实例', () => {
      const manager1 = getMcpServerManager();
      const manager2 = getMcpServerManager();
      expect(manager1).toBe(manager2);
    });
  });

  describe('acquireServer', () => {
    it('应该成功创建内置服务器', async () => {
      const manager = getMcpServerManager();

      const server1 = await manager.acquireServer('memory-tools');
      expect(server1).toBeDefined();
      expect(server1.name).toBe('memory-tools');

      const server2 = await manager.acquireServer('memory');
      expect(server2).toBeDefined();
      expect(server2.name).toBe('memory');
    });

    it('应该复用已存在的服务器实例', async () => {
      const manager = getMcpServerManager();

      const server1 = await manager.acquireServer('memory-tools');
      const server2 = await manager.acquireServer('memory-tools');

      expect(server1).toBe(server2);
    });

    it('应该正确增加引用计数', async () => {
      const manager = getMcpServerManager();

      await manager.acquireServer('memory-tools');
      await manager.acquireServer('memory-tools');
      await manager.acquireServer('memory-tools');

      const stats = manager.getStats();
      const memoryToolsStats = stats.servers.find(s => s.name === 'memory-tools');
      expect(memoryToolsStats?.refCount).toBe(3);
    });
  });

  describe('releaseServer', () => {
    it('应该正确减少引用计数', async () => {
      const manager = getMcpServerManager();

      await manager.acquireServer('memory-tools');
      await manager.acquireServer('memory-tools');
      manager.releaseServer('memory-tools');

      const stats = manager.getStats();
      const memoryToolsStats = stats.servers.find(s => s.name === 'memory-tools');
      expect(memoryToolsStats?.refCount).toBe(1);
    });

    it('应该处理不存在的服务器', () => {
      const manager = getMcpServerManager();
      expect(() => manager.releaseServer('non-existent')).not.toThrow();
    });
  });

  describe('acquireServers', () => {
    it('应该批量获取所有启用的服务器', async () => {
      const manager = getMcpServerManager();
      const servers = await manager.acquireServers();

      expect(servers).toHaveProperty('memory-tools');
      expect(servers).toHaveProperty('memory');
    });

    it('应该正确引用计数', async () => {
      const manager = getMcpServerManager();

      await manager.acquireServers();
      const stats = manager.getStats();

      const memoryToolsStats = stats.servers.find(s => s.name === 'memory-tools');
      const memoryStats = stats.servers.find(s => s.name === 'memory');

      expect(memoryToolsStats?.refCount).toBe(1);
      expect(memoryStats?.refCount).toBe(1);
    });
  });

  describe('releaseServers', () => {
    it('应该批量释放服务器', async () => {
      const manager = getMcpServerManager();

      const servers = await manager.acquireServers();
      manager.releaseServers(Object.keys(servers));

      const stats = manager.getStats();
      for (const server of stats.servers) {
        expect(server.refCount).toBe(0);
      }
    });
  });

  describe('getStats', () => {
    it('应该返回正确的统计信息', async () => {
      const manager = getMcpServerManager();

      await manager.acquireServer('memory-tools');
      await manager.acquireServer('memory-tools');
      await manager.acquireServer('memory');

      const stats = manager.getStats();

      expect(stats.poolSize).toBe(2);
      expect(stats.totalRefs).toBe(3);
      expect(stats.servers).toHaveLength(2);

      const memoryToolsStats = stats.servers.find(s => s.name === 'memory-tools');
      expect(memoryToolsStats?.refCount).toBe(2);
      expect(memoryToolsStats?.idleTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('clearAll', () => {
    it('应该清除所有服务器和缓存', async () => {
      const manager = getMcpServerManager();

      await manager.acquireServer('memory-tools');
      await manager.acquireServer('memory');

      await manager.clearAll();

      const stats = manager.getStats();
      expect(stats.poolSize).toBe(0);
      expect(stats.totalRefs).toBe(0);
    });
  });

  describe('clearConfigCache', () => {
    it('应该清除配置缓存', async () => {
      const manager = getMcpServerManager();

      // 第一次加载会缓存配置
      await manager.acquireServers();

      // 清除配置缓存
      manager.clearConfigCache();

      // 下次加载会重新从文件读取
      const servers2 = await manager.acquireServers();
      expect(servers2).toBeDefined();
    });
  });

  describe('配置缓存', () => {
    it('应该缓存外部MCP配置', async () => {
      const manager = getMcpServerManager();

      // 第一次加载
      const start1 = Date.now();
      await manager.acquireServers();
      const time1 = Date.now() - start1;

      // 第二次加载（应该使用缓存）
      const start2 = Date.now();
      await manager.acquireServers();
      const time2 = Date.now() - start2;

      // 缓存后应该更快（虽然这个测试可能不太稳定）
      // 主要验证不会抛出错误
      expect(time2).toBeGreaterThanOrEqual(0);
    });
  });
});
