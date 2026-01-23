package com.java.homemanagementapi.repository;

import com.java.homemanagementapi.Home;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class HomeRepositoryTest {

    @Autowired
    private HomeRepository homeRepository;

    private Home home1;
    private Home home2;
    private Home home3;

    @BeforeEach
    void setUp() {
        homeRepository.deleteAll();

        home1 = new Home();
        home1.setId("home-1");
        home1.setAddressLine1("123 Main St");
        home1.setCity("Austin");
        home1.setState("TX");
        home1.setZipCode("78701");
        home1.setBedrooms(3);
        home1.setBathrooms(2.0);
        home1.setSquareFootage(2000);

        home2 = new Home();
        home2.setId("home-2");
        home2.setAddressLine1("456 Oak Ave");
        home2.setCity("Austin");
        home2.setState("TX");
        home2.setZipCode("78702");
        home2.setBedrooms(4);
        home2.setBathrooms(3.0);
        home2.setSquareFootage(2500);

        home3 = new Home();
        home3.setId("home-3");
        home3.setAddressLine1("789 Pine Rd");
        home3.setCity("Dallas");
        home3.setState("TX");
        home3.setZipCode("75201");
        home3.setBedrooms(2);
        home3.setBathrooms(1.5);
        home3.setSquareFootage(1500);

        homeRepository.save(home1);
        homeRepository.save(home2);
        homeRepository.save(home3);
    }

    @Test
    void shouldSaveHome() {
        Home newHome = new Home();
        newHome.setId("home-4");
        newHome.setAddressLine1("321 Elm St");
        newHome.setCity("Houston");
        newHome.setState("TX");
        newHome.setZipCode("77001");

        Home savedHome = homeRepository.save(newHome);

        assertThat(savedHome.getDbId()).isNotNull();
        assertThat(savedHome.getId()).isEqualTo("home-4");
        assertThat(savedHome.getCity()).isEqualTo("Houston");
    }

    @Test
    void shouldFindHomeById() {
        Optional<Home> found = homeRepository.findById(home1.getDbId());

        assertThat(found).isPresent();
        assertThat(found.get().getAddressLine1()).isEqualTo("123 Main St");
    }

    @Test
    void shouldFindAllHomes() {
        List<Home> homes = homeRepository.findAll();

        assertThat(homes).hasSize(3);
    }

    @Test
    void shouldFindByCity() {
        List<Home> austinHomes = homeRepository.findByCity("Austin");

        assertThat(austinHomes).hasSize(2);
        assertThat(austinHomes).extracting(Home::getCity).containsOnly("Austin");
    }

    @Test
    void shouldFindByState() {
        List<Home> texasHomes = homeRepository.findByState("TX");

        assertThat(texasHomes).hasSize(3);
        assertThat(texasHomes).extracting(Home::getState).containsOnly("TX");
    }

    @Test
    void shouldFindByZipCode() {
        List<Home> homes = homeRepository.findByZipCode("78701");

        assertThat(homes).hasSize(1);
        assertThat(homes.get(0).getAddressLine1()).isEqualTo("123 Main St");
    }

    @Test
    void shouldUpdateHome() {
        home1.setBedrooms(5);
        Home updatedHome = homeRepository.save(home1);

        assertThat(updatedHome.getBedrooms()).isEqualTo(5);
    }

    @Test
    void shouldDeleteHome() {
        homeRepository.delete(home1);

        List<Home> homes = homeRepository.findAll();
        assertThat(homes).hasSize(2);

        Optional<Home> deleted = homeRepository.findById(home1.getDbId());
        assertThat(deleted).isEmpty();
    }

    @Test
    void shouldReturnEmptyListWhenCityNotFound() {
        List<Home> homes = homeRepository.findByCity("NonExistentCity");

        assertThat(homes).isEmpty();
    }

    @Test
    void shouldReturnEmptyOptionalWhenIdNotFound() {
        Optional<Home> home = homeRepository.findById(999L);

        assertThat(home).isEmpty();
    }
}
