package org.example.backend.repo;

import org.example.backend.model.Customer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CustomerRepoTest {

    @Autowired
    private CustomerRepo customerRepo;

    @Test
    @DisplayName("Speichern und Abrufen eines Kunden")
    void shouldSaveAndFindCustomerById() {

        Customer customer = new Customer();
        customer.setFirstname("Max");
        customer.setLastname("Mustermann");
        customer.setEmail("max@example.com");
        customer.setPhone("0123456789");
        customer.setAddress("Musterstraße 1");

        Customer saved = customerRepo.save(customer);
        Optional<Customer> found = customerRepo.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getFirstname()).isEqualTo("Max");
        assertThat(found.get().getLastname()).isEqualTo("Mustermann");
    }
}
