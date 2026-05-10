export type Theme = 'light' | 'dark';

export function toggleTheme(): void {
  const current = document.documentElement.dataset.theme as Theme | undefined;
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  const mq = document.querySelector('meta[name="theme-color"]');
  if (mq) mq.setAttribute('content', next === 'dark' ? '#1a1a1a' : '#fafaf9');
}

export function initTheme(): void {
  // Expose for footer-dot click handler from homepage (Wave 2A binds this).
  (window as unknown as { toggleTheme: () => void }).toggleTheme = toggleTheme;

  window.addEventListener('keydown', (e) => {
    if (e.key !== 't') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const active = document.activeElement as HTMLElement | null;
    const tag = active?.tagName ?? '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (active?.isContentEditable) return;
    toggleTheme();
  });
}
