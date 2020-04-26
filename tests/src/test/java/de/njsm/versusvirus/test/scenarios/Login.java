package de.njsm.versusvirus.test.scenarios;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.URL;

public class Login {

    @Test
    void dummy() throws Exception {
        var driver = new RemoteWebDriver(new URL("http://localhost:4444/wd/hub"), new FirefoxOptions());
        driver.get("https://www.google.ch");
        driver.quit();
    }
}
