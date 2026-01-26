/**
 * MCP 设置区域 - 简化版
 * 用户只需输入服务器名称和 JSON 配置
 */

import { useState, useEffect } from "react";
import { Trash2, Edit2, X, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

interface McpServerConfig {
  name: string;
  [key: string]: any;  // 允许任意 JSON 配置
}

type ViewMode = 'list' | 'add' | 'edit';

interface ServerListItem {
  name: string;
  config: McpServerConfig;
}

export function McpSection() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [servers, setServers] = useState<ServerListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 表单状态
  const [serverName, setServerName] = useState<string>('');
  const [jsonConfig, setJsonConfig] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // 展开/折叠状态
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());

  // 加载服务器列表
  const loadServers = async () => {
    setLoading(true);
    try {
      const result = await window.electron.getMcpServerList();
      setServers(result || []);
    } catch (err) {
      console.error("Failed to load MCP servers:", err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadServers();
  }, []);

  // 切换展开/折叠
  const toggleExpand = (name: string) => {
    setExpandedServers(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // 重置表单
  const resetForm = () => {
    setServerName('');
    setJsonConfig('');
    setError(null);
    setSuccess(false);
  };

  // 新建服务器
  const handleAdd = () => {
    setViewMode('add');
    resetForm();
    // 提供示例配置
    setJsonConfig(JSON.stringify({
      command: "npx",
      args: ["@modelcontextprotocol/server-github"],
      env: {
        GITHUB_TOKEN: "your-token-here"
      }
    }, null, 2));
  };

  // 编辑服务器
  const handleEdit = (server: ServerListItem) => {
    setServerName(server.name);
    // 移除 name 字段，因为它会单独输入
    const { name, ...configWithoutName } = server.config;
    setJsonConfig(JSON.stringify(configWithoutName, null, 2));
    setError(null);
    setViewMode('edit');
  };

  // 删除服务器
  const handleDelete = async (name: string) => {
    if (!confirm(t('mcp.confirmDelete', { name }))) {
      return;
    }

    try {
      const result = await window.electron.deleteMcpServer(name);
      if (result.success) {
        await loadServers();
      } else {
        setError(result.error || t('mcp.errors.deleteFailed'));
      }
    } catch (err) {
      setError(t('mcp.errors.deleteFailed'));
    }
  };

  // 保存服务器
  const handleSave = async () => {
    setError(null);

    // 验证服务器名称
    if (!serverName.trim()) {
      setError(t('mcp.errors.nameRequired'));
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(serverName)) {
      setError(t('mcp.errors.invalidNameFormat'));
      return;
    }

    // 验证 JSON 配置
    let parsedConfig: any;
    try {
      parsedConfig = JSON.parse(jsonConfig);
    } catch (e) {
      setError(t('mcp.errors.invalidJson'));
      return;
    }

    // 确保配置是对象
    if (typeof parsedConfig !== 'object' || parsedConfig === null || Array.isArray(parsedConfig)) {
      setError(t('mcp.errors.configMustBeObject'));
      return;
    }

    setSaving(true);

    try {
      // 合并 name 到配置中
      const config: McpServerConfig = {
        name: serverName.trim(),
        ...parsedConfig
      };

      const result = await window.electron.saveMcpServer(serverName.trim(), config);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setViewMode('list');
          loadServers();
        }, 1000);
      } else {
        setError(result.error || t('mcp.errors.saveFailed'));
      }
    } catch (err) {
      setError(t('mcp.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    setViewMode('list');
    resetForm();
  };

  // 复制配置
  const handleCopyConfig = (config: McpServerConfig) => {
    const { name, ...configWithoutName } = config;
    navigator.clipboard.writeText(JSON.stringify(configWithoutName, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-ink-900">{t('mcp.title')}</h1>
          <p className="mt-2 text-sm text-muted">
            {t('mcp.description')}
          </p>
        </header>

        {/* 列表视图 */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            <button
              className="w-full rounded-xl border-2 border-dashed border-ink-900/20 bg-surface-secondary px-4 py-3 text-sm font-medium text-accent hover:border-accent/50 hover:bg-accent/5 transition-colors"
              onClick={handleAdd}
            >
              {t('mcp.addServer')}
            </button>

            {loading ? (
              <div className="text-center py-8 text-muted">{t('common.loading')}</div>
            ) : servers.length === 0 ? (
              <div className="text-center py-8 text-muted">{t('mcp.noServers')}</div>
            ) : (
              servers.map((server) => {
                const isExpanded = expandedServers.has(server.name);
                return (
                  <div
                    key={server.name}
                    className="rounded-xl border border-ink-900/10 bg-surface overflow-hidden transition-all"
                  >
                    {/* 服务器头部 */}
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-secondary transition-colors"
                      onClick={() => toggleExpand(server.name)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button className="text-muted hover:text-ink-700 transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" strokeWidth={2} />
                          ) : (
                            <ChevronDown className="w-4 h-4" strokeWidth={2} />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-ink-900">
                            {server.config.displayName || server.name}
                          </h3>
                          {server.config.description && (
                            <p className="text-xs text-muted mt-0.5">{server.config.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="p-1.5 rounded-lg text-muted hover:text-ink-700 hover:bg-surface-tertiary transition-colors cursor-pointer"
                              onClick={() => handleCopyConfig(server.config)}
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-success" strokeWidth={2} />
                              ) : (
                                <Copy className="w-4 h-4" strokeWidth={2} />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-ink-900 text-white text-xs px-2 py-1 rounded-md">
                            {copied ? '已复制' : '复制配置'}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-surface-tertiary transition-colors cursor-pointer"
                              onClick={() => handleEdit(server)}
                            >
                              <Edit2 className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-ink-900 text-white text-xs px-2 py-1 rounded-md">
                            {t('mcp.actions.edit')}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-surface transition-colors cursor-pointer"
                              onClick={() => handleDelete(server.name)}
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-ink-900 text-white text-xs px-2 py-1 rounded-md">
                            {t('mcp.actions.delete')}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* 展开的配置详情 */}
                    {isExpanded && (
                      <div className="px-4 pb-3 border-t border-ink-900/10 pt-3">
                        <h4 className="text-xs font-medium text-muted mb-2">JSON 配置</h4>
                        <pre className="text-xs bg-surface-secondary rounded-lg p-3 overflow-x-auto text-ink-700 font-mono leading-relaxed border border-ink-900/10">
                          {JSON.stringify(
                            (() => {
                              const { name, ...rest } = server.config;
                              return rest;
                            })(),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 添加/编辑表单 */}
        {(viewMode === 'add' || viewMode === 'edit') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-ink-900">
                {viewMode === 'add' ? t('mcp.form.addTitle') : t('mcp.form.editTitle')}
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 rounded-full text-muted hover:bg-surface-tertiary hover:text-ink-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-ink-900 text-white text-xs px-2 py-1 rounded-md">
                  取消操作
                </TooltipContent>
              </Tooltip>
            </div>

            {/* 服务器名称 */}
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted">{t('mcp.form.name.label')}</span>
              <input
                type="text"
                className={`rounded-xl border px-3 py-2 text-sm text-ink-800 placeholder:text-muted-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors ${
                  viewMode === 'edit' ? 'bg-surface border-ink-900/10' : 'bg-surface-secondary border-ink-900/10'
                }`}
                placeholder={t('mcp.form.name.placeholder')}
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                disabled={viewMode === 'edit'}
                required
              />
              <p className="text-[10px] text-muted-light">
                服务器的唯一标识符，只能包含字母、数字、下划线和连字符
              </p>
            </label>

            {/* JSON 配置 */}
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted">JSON 配置</span>
              <textarea
                className="rounded-xl border border-ink-900/10 bg-surface-secondary px-3 py-2 text-sm text-ink-800 placeholder:text-muted-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors font-mono resize-none"
                placeholder={`{\n  "command": "npx",\n  "args": ["@modelcontextprotocol/server-github"],\n  "env": {\n    "GITHUB_TOKEN": "your-token"\n  }\n}`}
                value={jsonConfig}
                onChange={(e) => setJsonConfig(e.target.value)}
                rows={12}
                required
              />
              <p className="text-[10px] text-muted-light">
                直接粘贴 MCP 服务器的 JSON 配置，支持所有 Qwen Code SDK 的配置选项
              </p>
            </label>

            {/* 配置示例 */}
            <div className="rounded-xl border border-ink-900/10 bg-surface-secondary p-4">
              <h4 className="text-xs font-medium text-muted mb-2">配置示例</h4>
              <div className="space-y-3 text-xs text-ink-700">
                <div>
                  <strong className="text-ink-900">stdio 类型（本地命令）：</strong>
                  <pre className="mt-1 text-[10px] bg-surface rounded-lg p-2 overflow-x-auto font-mono leading-relaxed">
{`{
  "command": "npx",
  "args": ["@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "your-token"
  }
}`}
                  </pre>
                </div>
                <div>
                  <strong className="text-ink-900">HTTP 类型（远程服务）：</strong>
                  <pre className="mt-1 text-[10px] bg-surface rounded-lg p-2 overflow-x-auto font-mono leading-relaxed">
{`{
  "url": "https://api.example.com/mcp",
  "headers": {
    "Authorization": "Bearer your-token"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* 错误/成功提示 */}
            {error && (
              <div className="rounded-xl border border-error/20 bg-error-light px-3 py-2 text-sm text-error">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-success/20 bg-success-light px-3 py-2 text-sm text-success">
                {t('mcp.errors.saveSuccess')}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-xl border border-ink-900/10 bg-surface px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-tertiary transition-colors"
                onClick={handleCancel}
                disabled={saving}
              >
                {t('mcp.actions.cancel')}
              </button>
              <button
                className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-accent-hover transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? t('mcp.actions.saving') : t('mcp.actions.save')}
              </button>
            </div>
          </div>
        )}

        {/* 说明文字 */}
        <aside className="p-4 rounded-xl bg-surface-secondary border border-ink-900/5">
          <p className="text-xs text-muted">
            <strong>💡 提示：</strong>
            MCP 服务器配置存储在 <code className="px-1 py-0.5 rounded bg-ink-900/5">~/.qwen/settings.json</code> 中。
            SDK 会自动启动配置的 MCP 服务器并将工具注册到会话中。
          </p>
          <p className="text-xs text-muted mt-2">
            <strong>📖 文档：</strong>
            <a
              href="https://qwenlm.github.io/qwen-code-docs/zh/developers/tools/mcp-server/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline ml-1"
            >
              Qwen Code MCP 服务器配置指南
            </a>
          </p>
        </aside>
      </section>
    </TooltipProvider>
  );
}
