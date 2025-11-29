import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'campus-forum-theme';
  private readonly defaultTheme: Theme = 'light';

  // Signal para el tema actual
  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  private getInitialTheme(): Theme {
    // Intentar obtener del localStorage
    const saved = localStorage.getItem(this.THEME_KEY) as Theme;
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved;
    }

    // Intentar usar la preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return this.defaultTheme;
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(theme);
      html.setAttribute('data-theme', theme);
    }
  }

  isDarkMode(): boolean {
    return this.currentTheme() === 'dark';
  }
}


