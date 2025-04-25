import { Button, Input, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../store/customerStore.tsx";
import { Customer } from "../../types/Customer.ts";
import CustomerFormModal from "./CustomerFormModal.tsx";

const CustomersPage = () => {
    const { customers, loading, fetchCustomers } = useCustomerStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedCustomer(null);
        setModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setModalMode("edit");
        setSelectedCustomer(customer);
        setModalOpen(true);
    };

    const filteredCustomers = customers.filter((c) => {
        const term = searchTerm.toLowerCase();
        return (
            c.firstname.toLowerCase().includes(term) ||
            c.lastname.toLowerCase().includes(term) ||
            c.email?.toLowerCase().includes(term) ||
            c.phone?.toLowerCase().includes(term) ||
            c.address?.toLowerCase().includes(term)
        );
    });

    const lastnameFilters = Array.from(
        new Set(customers.map((c) => c.lastname))
    ).map((name) => ({ text: name, value: name }));

    return (
        <div className="p-6 space-y-4">
            {/* Suchfeld */}
            <div className="flex justify-start">
                <Input.Search
                    placeholder="Kundendaten durchsuchen"
                    allowClear
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: 300 }}
                />
            </div>

            <Table
                dataSource={filteredCustomers}
                loading={loading}
                rowKey="id"
                pagination={filteredCustomers.length > 10 ? { pageSize: 10 } : false}
                columns={[
                    { title: "Vorname", dataIndex: "firstname" },
                    {
                        title: "Nachname",
                        dataIndex: "lastname",
                        filters: lastnameFilters,
                        onFilter: (value, record) => record.lastname === value,
                    },
                    { title: "E-Mail", dataIndex: "email" },
                    { title: "Telefon", dataIndex: "phone" },
                    { title: "Adresse", dataIndex: "address" },
                ]}
                onRow={(record) => ({
                    onClick: () => openEditModal(record),
                    style: { cursor: "pointer" },
                })}
            />

            <div className="flex justify-end">
                <Button
                    type="primary"
                    onClick={openCreateModal}
                    icon={<PlusOutlined />}
                >
                    Kunde anlegen
                </Button>
            </div>

            <CustomerFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                mode={modalMode}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default CustomersPage;
