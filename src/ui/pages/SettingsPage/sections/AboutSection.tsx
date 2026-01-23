/**
 * 关于区域
 */

import { useTranslation } from "react-i18next";

export function AboutSection() {
  const { t } = useTranslation();

  // 统一使用浏览器打开链接
  const openLink = (url: string) => {
    window.electron.openExternal(url);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">{t('about.title')}</h1>
        <p className="mt-2 text-sm text-muted">
          {t('about.subtitle')}
        </p>
      </header>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-ink-900/10 bg-surface">
          <h3 className="text-sm font-medium text-ink-900">{t('about.version.title')}</h3>
          <p className="mt-2 text-sm text-muted">{t('about.version.description')}</p>
        </div>

        <div className="p-4 rounded-xl border border-ink-900/10 bg-surface">
          <h3 className="text-sm font-medium text-ink-900">{t('about.techStack.title')}</h3>
          <ul className="mt-2 text-sm text-muted space-y-1">
            <li>{t('about.techStack.electron')}</li>
            <li>{t('about.techStack.react')}</li>
            <li>{t('about.techStack.tailwind')}</li>
            <li>{t('about.techStack.claude')}</li>
          </ul>
        </div>

        <div
          className="p-4 rounded-xl border border-ink-900/10 bg-surface hover:border-accent/30 transition-colors cursor-pointer group"
          onClick={() => openLink('https://www.gnu.org/licenses/agpl-3.0.html')}
        >
          <h3 className="text-sm font-medium text-accent transition-colors">{t('about.license.title')}</h3>
          <p className="mt-2 text-sm text-muted">{t('about.license.description')}</p>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>
      </div>

      <aside className="p-4 rounded-xl bg-surface-secondary border border-ink-900/5">
        <p className="text-xs text-muted">
          {t('about.tagline')}
        </p>
      </aside>
    </section>
  );
}
