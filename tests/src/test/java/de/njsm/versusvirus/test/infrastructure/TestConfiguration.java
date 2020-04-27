package de.njsm.versusvirus.test.infrastructure;

public class TestConfiguration {

    private final String username;
    private final String password;

    public TestConfiguration() {
        username = System.getenv("USERNAME");
        password = System.getenv("PASSWORD");
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
