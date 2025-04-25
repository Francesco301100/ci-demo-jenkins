import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from './themeStore';

beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ darkMode: true });
});

describe('useThemeStore', () => {
    it('should toggle darkMode', () => {
        expect(useThemeStore.getState().darkMode).toBe(true);
        useThemeStore.getState().toggleDarkMode();
        expect(useThemeStore.getState().darkMode).toBe(false);
    });

    it('should persist value in localStorage', () => {
        useThemeStore.getState().toggleDarkMode(); // true → false
        const stored = JSON.parse(localStorage.getItem('my-darkmode-storage')!);
        expect(stored.state.darkMode).toBe(false);
    });
});
