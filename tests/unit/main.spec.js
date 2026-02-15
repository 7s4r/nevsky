import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLangFromUrl,
  formatMonthYear,
  setLangValue,
} from '../../js/main.js';

describe('main.js helpers', () => {
  beforeEach(() => {
    // reset language
    setLangValue('fr');
  });

  it('getLangFromUrl returns null when no lang param', () => {
    const loc = new URL('http://localhost/index.html');
    Object.defineProperty(window, 'location', { value: loc });
    expect(getLangFromUrl()).toBe(null);
  });

  it('getLangFromUrl returns ru when param present', () => {
    const loc = new URL('http://localhost/index.html?lang=ru');
    Object.defineProperty(window, 'location', { value: loc });
    expect(getLangFromUrl()).toBe('ru');
  });

  it('formatMonthYear returns localized month year', () => {
    setLangValue('fr');
    const d = new Date(2025, 0, 1);
    const res = formatMonthYear(d);
    expect(res).toMatch(/janvier|2025/i);
  });
});
