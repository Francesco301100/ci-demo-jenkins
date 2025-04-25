import axios from "axios";
import { Customer } from "../types/Customer";

const API_BASE = "http://localhost:8080/api/customer";

export const getCustomers = () => axios.get<Customer[]>(API_BASE);
export const getCustomer = (id: number) => axios.get<Customer>(`${API_BASE}/${id}`);
export const createCustomer = (data: Customer) => axios.post<Customer>(API_BASE, data);
export const updateCustomer = (id: number, data: Customer) => axios.put<Customer>(`${API_BASE}/${id}`, data);
export const deleteCustomer = (id: number) => axios.delete(`${API_BASE}/${id}`);
