import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useThemeStore } from '../../../store/themeStore';
import AppFooter from "./Footer.tsx";

vi.mock('../../../store/themeStore', () => {
    return {
        useThemeStore: vi.fn(),
    };
});

describe('AppFooter', () => {
    it('zeigt das aktuelle Theme korrekt an und reagiert auf Umschalten', () => {
        const toggleDarkModeMock = vi.fn();

        (useThemeStore as any).mockImplementation((selector: any) =>
            selector({ darkMode: true, toggleDarkMode: toggleDarkModeMock })
        );

        render(<AppFooter />);

        expect(screen.getByText(/Bachelorarbeit/)).toBeInTheDocument();

        const switchElement = screen.getByRole('switch');
        expect(switchElement).toHaveAttribute('aria-checked', 'true');

        fireEvent.click(switchElement);

        expect(toggleDarkModeMock).toHaveBeenCalledTimes(1);
    });
});
