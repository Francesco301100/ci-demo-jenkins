package org.example.backend.service;

import org.example.backend.model.Customer;
import org.example.backend.repo.CustomerRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerServiceTest {

    private CustomerRepo customerRepo;
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerRepo = mock(CustomerRepo.class);
        customerService = new CustomerService(customerRepo);
    }

    @Test
    void shouldReturnAllCustomers() {
        var customerList = Arrays.asList(new Customer(), new Customer());
        when(customerRepo.findAll()).thenReturn(customerList);

        var result = customerService.getAllCustomers();

        assertThat(result).hasSize(2);
        verify(customerRepo).findAll();
    }

    @Test
    void shouldReturnCustomerById() {
        var customer = new Customer();
        customer.setId(1L);

        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

        var result = customerService.getCustomerById(1L);

        assertThat(result).isPresent().contains(customer);
        verify(customerRepo).findById(1L);
    }

    @Test
    void shouldCreateCustomer() {
        var newCustomer = new Customer();
        newCustomer.setFirstname("Max");

        when(customerRepo.save(newCustomer)).thenReturn(newCustomer);

        var result = customerService.createCustomer(newCustomer);

        assertThat(result.getFirstname()).isEqualTo("Max");
        verify(customerRepo).save(newCustomer);
    }

    @Test
    void shouldUpdateCustomer() {
        var existing = new Customer();
        existing.setId(1L);
        existing.setFirstname("Old");

        var updates = new Customer();
        updates.setFirstname("New");
        updates.setLastname("Name");

        when(customerRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(customerRepo.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = customerService.updateCustomer(1L, updates);

        assertThat(result.getFirstname()).isEqualTo("New");
        assertThat(result.getLastname()).isEqualTo("Name");
        verify(customerRepo).save(existing);
    }

    @Test
    void shouldThrowWhenUpdateNotFound() {
        when(customerRepo.findById(99L)).thenReturn(Optional.empty());

        var updates = new Customer();

        assertThatThrownBy(() -> customerService.updateCustomer(99L, updates))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Kunde nicht gefunden");
    }

    @Test
    void shouldDeleteCustomer() {
        when(customerRepo.existsById(1L)).thenReturn(true);

        customerService.deleteCustomer(1L);

        verify(customerRepo).deleteById(1L);
    }

    @Test
    void shouldThrowWhenDeleteNotFound() {
        when(customerRepo.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> customerService.deleteCustomer(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Kunde nicht gefunden");
    }
}
