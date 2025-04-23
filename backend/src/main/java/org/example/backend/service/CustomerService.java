package org.example.backend.service;

import org.example.backend.model.Customer;
import org.example.backend.repo.CustomerRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepo customerRepo;

    public CustomerService(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }

    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepo.findById(id);
    }

    public Customer createCustomer(Customer customer) {
        return customerRepo.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Kunde nicht gefunden mit ID: " + id));

        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setAddress(customerDetails.getAddress());

        return customerRepo.save(customer);
    }

    public void deleteCustomer(Long id) {
        if (!customerRepo.existsById(id)) {
            throw new RuntimeException("Kunde nicht gefunden mit ID: " + id);
        }
        customerRepo.deleteById(id);
    }
}
