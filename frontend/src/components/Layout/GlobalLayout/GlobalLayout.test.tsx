import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalLayout from './GlobalLayout';
import { useThemeStore } from '../../../store/themeStore.tsx';

vi.mock('../Navbar/Navbar.tsx', () => ({
    default: () => <div data-testid="navbar" />,
}));

vi.mock('../Footer/Footer.tsx', () => ({
    default: () => <div data-testid="footer" />,
}));

vi.mock('../../../store/themeStore.tsx', () => ({
    useThemeStore: vi.fn(),
}));

vi.mock('react-router-dom', async (original) => {
    const actual = await original;
    return {
        ...actual,
        Outlet: () => <div data-testid="outlet-content" />,
    };
});

describe('GlobalLayout', () => {
    it('rendert Struktur mit Light-Theme korrekt', () => {
        (useThemeStore as any).mockReturnValue({ darkMode: false });

        render(<GlobalLayout />);

        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('outlet-content')).toBeInTheDocument();

        const layout = screen.getByTestId('layout-wrapper');
        expect(layout.className).toContain('bg-gray-50');
    });

    it('wendet Dark-Theme-Klasse an, wenn darkMode=true', () => {
        (useThemeStore as any).mockReturnValue({ darkMode: true });

        render(<GlobalLayout />);

        const layout = screen.getByTestId('layout-wrapper');
        expect(layout.className).toContain('bg-[#282828]');
    });
});
