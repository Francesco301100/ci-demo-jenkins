package org.example.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.model.Customer;
import org.example.backend.repo.CustomerRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        customerRepo.deleteAll();
    }

    @Test
    @DisplayName("POST /api/customer - sollte neuen Kunden anlegen")
    void shouldCreateCustomer() throws Exception {
        Customer customer = new Customer();
        customer.setFirstname("Max");
        customer.setLastname("Mustermann");
        customer.setEmail("max@example.com");
        customer.setPhone("0123456789");
        customer.setAddress("Musterstraße 1");

        mockMvc.perform(post("/api/customer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstname").value("Max"))
                .andExpect(jsonPath("$.lastname").value("Mustermann"));

        assertThat(customerRepo.findAll()).hasSize(1);
    }

    @Test
    @DisplayName("GET /api/customer - sollte Kundenliste zurückgeben")
    void shouldReturnCustomerList() throws Exception {
        customerRepo.save(new Customer(null, "Anna", "Musterfrau", "anna@example.com", "01761234567", "Teststraße 2"));

        mockMvc.perform(get("/api/customer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].firstname").value("Anna"));
    }

    @Test
    @DisplayName("PUT /api/customer/{id} – sollte Kundendaten aktualisieren")
    void shouldUpdateCustomer() throws Exception {
        Customer original = new Customer(null, "Laura", "Lustig", "laura@example.com", "012345678", "Altstraße 5");
        Customer saved = customerRepo.save(original);

        Customer updated = new Customer();
        updated.setFirstname("Laura");
        updated.setLastname("Neulustig");
        updated.setEmail("laura.neu@example.com");
        updated.setPhone("0987654321");
        updated.setAddress("Neustraße 10");

        mockMvc.perform(put("/api/customer/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastname").value("Neulustig"))
                .andExpect(jsonPath("$.email").value("laura.neu@example.com"));

        Customer reloaded = customerRepo.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getLastname()).isEqualTo("Neulustig");
        assertThat(reloaded.getEmail()).isEqualTo("laura.neu@example.com");
    }


    @Test
    @DisplayName("DELETE /api/customer/{id} - sollte Kunden löschen")
    void shouldDeleteCustomer() throws Exception {
        Customer saved = customerRepo.save(new Customer(null, "Tim", "Tester", "tim@test.de", null, null));

        mockMvc.perform(delete("/api/customer/" + saved.getId()))
                .andExpect(status().isNoContent());

        assertThat(customerRepo.findById(saved.getId())).isEmpty();
    }
}
