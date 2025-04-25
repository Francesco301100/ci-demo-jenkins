import { create } from "zustand";
import { Customer } from "../types/Customer";
import * as api from "../api/customerApi";

type CustomerStore = {
    customers: Customer[];
    loading: boolean;
    fetchCustomers: () => void;
};

export const useCustomerStore = create<CustomerStore>((set) => ({
    customers: [],
    loading: false,
    fetchCustomers: async () => {
        set({ loading: true });
        const res = await api.getCustomers();
        set({ customers: res.data, loading: false });
    }
}));
