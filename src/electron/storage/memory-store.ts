/**
 * 记忆存储模块
 * 管理记忆种类（MemoryKind）与记忆条目（MemoryEntry），持久化到 userData/memory/
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { app } from 'electron';
import { log } from '../logger.js';

/** 记忆种类 */
export interface MemoryKind {
  id: string;
  name: string;
  description?: string;
  color?: string;
  schema?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

/** 记忆条目 */
export interface MemoryEntry {
  id: string;
  kindId: string;
  content: string;
  summary?: string;
  entities?: string[];
  importance?: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

function getMemoryDir(): string {
  const userDataPath = app.getPath('userData');
  return join(userDataPath, 'memory');
}

/** 供主进程注入内置记忆 MCP 时获取存储路径（不依赖 Electron 的脚本通过 env 接收该路径） */
export function getMemoryDirPath(): string {
  return getMemoryDir();
}

function getKindsPath(): string {
  return join(getMemoryDir(), 'kinds.json');
}

function getEntriesPath(): string {
  return join(getMemoryDir(), 'entries.json');
}

async function ensureMemoryDir(): Promise<void> {
  const dir = getMemoryDir();
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/** 原子写入 JSON 文件 */
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const dir = dirname(filePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  const tmpPath = filePath + '.tmp.' + Date.now();
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmpPath, filePath);
}

async function readKinds(): Promise<MemoryKind[]> {
  const path = getKindsPath();
  try {
    await fs.access(path);
    const raw = await fs.readFile(path, 'utf-8');
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    if (e instanceof SyntaxError) {
      log.error('[memory-store] Invalid kinds.json:', e);
      return [];
    }
    throw e;
  }
}

async function readEntries(): Promise<MemoryEntry[]> {
  const path = getEntriesPath();
  try {
    await fs.access(path);
    const raw = await fs.readFile(path, 'utf-8');
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    if (e instanceof SyntaxError) {
      log.error('[memory-store] Invalid entries.json:', e);
      return [];
    }
    throw e;
  }
}

// ---------- 种类 CRUD ----------

export async function getMemoryKinds(): Promise<MemoryKind[]> {
  await ensureMemoryDir();
  return readKinds();
}

export async function getMemoryKind(id: string): Promise<MemoryKind | null> {
  const kinds = await getMemoryKinds();
  return kinds.find((k) => k.id === id) ?? null;
}

export async function createMemoryKind(
  kind: Omit<MemoryKind, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MemoryKind> {
  await ensureMemoryDir();
  const kinds = await readKinds();
  const now = Date.now();
  const newKind: MemoryKind = {
    ...kind,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  kinds.push(newKind);
  await writeJsonFile(getKindsPath(), kinds);
  log.info('[memory-store] Kind created:', newKind.id);
  return newKind;
}

export async function updateMemoryKind(
  id: string,
  patch: Partial<Omit<MemoryKind, 'id' | 'createdAt'>>
): Promise<void> {
  await ensureMemoryDir();
  const kinds = await readKinds();
  const idx = kinds.findIndex((k) => k.id === id);
  if (idx === -1) throw new Error('记忆种类不存在');
  kinds[idx] = { ...kinds[idx], ...patch, id, updatedAt: Date.now() };
  await writeJsonFile(getKindsPath(), kinds);
  log.info('[memory-store] Kind updated:', id);
}

export async function deleteMemoryKind(id: string): Promise<void> {
  await ensureMemoryDir();
  const kinds = await readKinds();
  const next = kinds.filter((k) => k.id !== id);
  if (next.length === kinds.length) throw new Error('记忆种类不存在');
  await writeJsonFile(getKindsPath(), next);
  // 可选：同时软删该种类下所有条目，或保留条目但 kindId 悬空。此处选择保留条目，UI 可显示「未分类」
  log.info('[memory-store] Kind deleted:', id);
}

// ---------- 条目 CRUD ----------

export async function getMemoryEntries(
  kindId?: string,
  options?: { includeDeleted?: boolean }
): Promise<MemoryEntry[]> {
  await ensureMemoryDir();
  let entries = await readEntries();
  if (kindId) entries = entries.filter((e) => e.kindId === kindId);
  if (!options?.includeDeleted) entries = entries.filter((e) => e.deletedAt == null);
  entries.sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt));
  return entries;
}

export async function getMemoryEntry(id: string): Promise<MemoryEntry | null> {
  const entries = await readEntries();
  return entries.find((e) => e.id === id) ?? null;
}

export async function createMemoryEntry(
  entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MemoryEntry> {
  await ensureMemoryDir();
  const entries = await readEntries();
  const now = Date.now();
  const newEntry: MemoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  entries.push(newEntry);
  await writeJsonFile(getEntriesPath(), entries);
  log.info('[memory-store] Entry created:', newEntry.id);
  return newEntry;
}

export async function updateMemoryEntry(
  id: string,
  patch: Partial<Omit<MemoryEntry, 'id' | 'createdAt'>>
): Promise<void> {
  await ensureMemoryDir();
  const entries = await readEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('记忆条目不存在');
  entries[idx] = { ...entries[idx], ...patch, id, updatedAt: Date.now() };
  await writeJsonFile(getEntriesPath(), entries);
  log.info('[memory-store] Entry updated:', id);
}

export async function deleteMemoryEntry(id: string, soft: boolean = true): Promise<void> {
  await ensureMemoryDir();
  const entries = await readEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('记忆条目不存在');
  if (soft) {
    entries[idx].deletedAt = Date.now();
    entries[idx].updatedAt = Date.now();
  } else {
    entries.splice(idx, 1);
  }
  await writeJsonFile(getEntriesPath(), entries);
  log.info(`[memory-store] Entry deleted: ${id} ${soft ? '(soft)' : '(hard)'}`);
}

// ---------- 搜索（供 MCP recall 与设置页） ----------
// 检索时优先匹配「摘要/标题」，再匹配 content、entities，便于按标题（如「工号」）稳定命中

export async function searchMemoryEntries(params: {
  kindId?: string;
  query?: string;
  importance?: MemoryEntry['importance'];
  limit?: number;
}): Promise<MemoryEntry[]> {
  await ensureMemoryDir();
  let entries = await readEntries();
  entries = entries.filter((e) => e.deletedAt == null);
  if (params.kindId) entries = entries.filter((e) => e.kindId === params.kindId);
  if (params.importance) entries = entries.filter((e) => e.importance === params.importance);
  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase();
    entries = entries.filter(
      (e) =>
        (e.summary && e.summary.toLowerCase().includes(q)) ||
        e.content.toLowerCase().includes(q) ||
        (e.entities && e.entities.some((x) => x.toLowerCase().includes(q)))
    );
    // 优先：摘要/标题匹配的排前面，再按更新时间
    entries.sort((a, b) => {
      const aSummaryMatch = a.summary && a.summary.toLowerCase().includes(q) ? 1 : 0;
      const bSummaryMatch = b.summary && b.summary.toLowerCase().includes(q) ? 1 : 0;
      if (bSummaryMatch !== aSummaryMatch) return bSummaryMatch - aSummaryMatch;
      return (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt);
    });
  } else {
    entries.sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt));
  }
  const limit = params.limit ?? 50;
  return entries.slice(0, limit);
}
