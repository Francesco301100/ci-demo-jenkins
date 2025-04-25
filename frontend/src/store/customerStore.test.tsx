import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCustomerStore } from './customerStore';
import * as api from '../api/customerApi';
import {renderHook} from "@testing-library/react";
import {act} from "react";

vi.mock('../api/customerApi');

const mockCustomers = [
    { id: 1, firstname: 'Max', lastname: 'Muster', email: 'max@test.de', phone: '1234', address: 'Teststraße 1' },
    { id: 2, firstname: 'Anna', lastname: 'Beispiel', email: 'anna@test.de', phone: '5678', address: 'Beispielweg 2' }
];

describe('useCustomerStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and sets customers correctly', async () => {
        (api.getCustomers as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: mockCustomers
        });

        const { result } = renderHook(() => useCustomerStore());

        await act(async () => {
            await result.current.fetchCustomers();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.customers).toEqual(mockCustomers);
        expect(api.getCustomers).toHaveBeenCalled();
    });

    it('sets loading state while fetching', async () => {
        let resolveFn: (value: any) => void;
        const promise = new Promise((resolve) => {
            resolveFn = resolve;
        });

        (api.getCustomers as unknown as ReturnType<typeof vi.fn>).mockReturnValue(promise);

        const { result } = renderHook(() => useCustomerStore());

        act(() => {
            result.current.fetchCustomers();
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            resolveFn!({ data: mockCustomers });
        });

        expect(result.current.loading).toBe(false);
    });
});
