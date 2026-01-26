/**
 * 语言偏好存储服务
 * 管理用户的 AI 回复语言偏好
 * 
 * @author Alan
 * @created 2026-01-26
 */

import { log } from "../logger.js";
import type { Language } from "../utils/language-detector.js";

/**
 * 当前用户设置的 AI 回复语言
 */
let currentAILanguage: Language = 'zh'; // 默认中文

/**
 * UI 语言到 AI 语言的映射
 * 将用户界面语言映射到 AI 支持的回复语言
 */
const UI_TO_AI_LANGUAGE: Record<string, Language> = {
  'en': 'en',
  'zh': 'zh',
  'zh-TW': 'zh',  // 繁体中文使用简体中文提示
  'ja': 'ja',
  'ko': 'ko',
  'es': 'en',     // 西班牙语暂时使用英语
  'fr': 'en',     // 法语暂时使用英语
  'de': 'en',     // 德语暂时使用英语
  'ru': 'en',     // 俄语暂时使用英语
  'pt': 'en',     // 葡萄牙语暂时使用英语
};

/**
 * 设置用户的 AI 回复语言偏好
 * 
 * @param uiLanguage - 用户界面语言代码
 */
export function setAILanguagePreference(uiLanguage: string): void {
  const aiLanguage = UI_TO_AI_LANGUAGE[uiLanguage] || 'zh';
  currentAILanguage = aiLanguage;
  log.info(`[Language Preference] AI response language set to: ${aiLanguage} (from UI language: ${uiLanguage})`);
}

/**
 * 获取当前的 AI 回复语言偏好
 * 
 * @returns 当前的 AI 回复语言
 */
export function getAILanguagePreference(): Language {
  return currentAILanguage;
}
