import { describe, it, expect } from 'vitest';
import { getStartDay, daysInMonth } from '../../js/calendar-utils.js';

describe('calendar-utils', () => {
  it('calculates start day (Monday=0) correctly', () => {
    // 1 Sep 2025 is Monday
    const d = new Date(2025, 8, 1);
    expect(getStartDay(d)).toBe(0);
  });

  it('calculates days in month', () => {
    const feb2024 = new Date(2024, 1, 1);
    expect(daysInMonth(feb2024)).toBe(29); // leap year
  });
});
