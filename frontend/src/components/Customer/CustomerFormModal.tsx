import { Modal, Form, Input, Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createCustomer, updateCustomer, deleteCustomer } from "../../api/customerApi";
import { useCustomerStore } from "../../store/customerStore";
import { Customer } from "../../types/Customer";

interface Props {
    open: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    customer?: Customer | null;
}

const CustomerFormModal: React.FC<Props> = ({ open, onClose, mode, customer }) => {
    const [form] = Form.useForm();
    const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);
    const [loading, setLoading] = useState(false);
    const [editable, setEditable] = useState(mode === "create");

    useEffect(() => {
        if (mode === "edit" && customer) {
            form.setFieldsValue(customer);
            setEditable(false);
        } else {
            form.resetFields();
            setEditable(true);
        }
    }, [mode, customer, form]);

    const handleSave = async (values: Customer) => {
        setLoading(true);
        try {
            if (mode === "edit" && customer?.id) {
                await updateCustomer(customer.id, values);
                message.success("Kunde erfolgreich aktualisiert");
            } else {
                await createCustomer(values);
                message.success("Kunde erfolgreich erstellt");
            }
            fetchCustomers();
            onClose();
        } catch {
            message.error("Fehler beim Speichern des Kunden");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!customer?.id) return;
        try {
            await deleteCustomer(customer.id);
            message.success("Kunde erfolgreich gelöscht");
            fetchCustomers();
            onClose();
        } catch {
            message.error("Fehler beim Löschen des Kunden");
        }
    };

    const handleCancelEdit = () => {
        if (customer) {
            form.setFieldsValue(customer);
        }
        setEditable(false);
    };

    return (
        <Modal
            title={mode === "edit" ? "Kunde bearbeiten" : "Neuen Kunden anlegen"}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form
                layout="vertical"
                onFinish={handleSave}
                form={form}
                validateTrigger="onBlur"
                className="space-y-4"
            >
                <Form.Item
                    name="firstname"
                    label="Vorname"
                    rules={[{ required: true, message: "Bitte Vornamen eingeben" }]}
                >
                    <Input placeholder="Max" disabled={!editable} />
                </Form.Item>

                <Form.Item
                    name="lastname"
                    label="Nachname"
                    rules={[{ required: true, message: "Bitte Nachnamen eingeben" }]}
                >
                    <Input placeholder="Mustermann" disabled={!editable} />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-Mail"
                    rules={[{ required: true, type: "email", message: "Gültige E-Mail eingeben" }]}
                >
                    <Input placeholder="max@example.com" disabled={!editable} />
                </Form.Item>

                <Form.Item name="phone" label="Telefon">
                    <Input placeholder="+49 176 12345678" disabled={!editable} />
                </Form.Item>

                <Form.Item name="address" label="Adresse">
                    <Input placeholder="Musterstraße 1, 12345 Musterstadt" disabled={!editable} />
                </Form.Item>

                <div className="flex justify-between pt-4 gap-2">
                    {mode === "edit" && !editable && (
                        <>
                            <Popconfirm
                                title="Kunde wirklich löschen?"
                                onConfirm={handleDelete}
                                okText="Ja"
                                cancelText="Abbrechen"
                            >
                                <Button danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                            <Button type="primary" onClick={() => setEditable(true)}>
                                Bearbeiten
                            </Button>
                        </>
                    )}

                    {editable && (
                        <div className="flex justify-end gap-2 w-full">
                            {mode === "edit" && (
                                <Button onClick={handleCancelEdit}>
                                    Zurück
                                </Button>
                            )}
                            <Popconfirm
                                title="Änderungen speichern?"
                                onConfirm={() => form.submit()}
                                okText="Ja"
                                cancelText="Abbrechen"
                            >
                                <Button type="primary" loading={loading}>
                                    {mode === "edit" ? "Speichern" : "Erstellen"}
                                </Button>
                            </Popconfirm>
                        </div>
                    )}
                </div>
            </Form>
        </Modal>
    );
};

export default CustomerFormModal;
