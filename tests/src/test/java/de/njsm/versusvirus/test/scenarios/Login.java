package de.njsm.versusvirus.test.scenarios;

import de.njsm.versusvirus.test.infrastructure.TestConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.jupiter.api.Assertions.fail;

@DisplayName("Login")
public class Login {

    private final TestConfiguration config = new TestConfiguration();

    @Test
    @DisplayName("Login is possible")
    void login(WebDriver driver) {
        var wait = new WebDriverWait(driver, 1);
        driver.get("https://versusvirus-testing-admin.njsm.de");
        var usernameInput = driver.findElement(By.cssSelector("input[name='username']"));
        var passwordInput = driver.findElement(By.cssSelector("input[name='password']"));
        var submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

        usernameInput.sendKeys(config.getUsername());
        passwordInput.sendKeys(config.getPassword());
        submitButton.click();

        try {
            wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));
        } catch (TimeoutException e) {
            fail(e);
        }
    }
}
