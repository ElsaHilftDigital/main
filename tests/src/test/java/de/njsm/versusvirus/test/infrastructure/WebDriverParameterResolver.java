package de.njsm.versusvirus.test.infrastructure;

import org.junit.jupiter.api.extension.*;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebDriverParameterResolver implements ParameterResolver, AfterTestExecutionCallback {

    private final Capabilities capabilities = new FirefoxOptions();
    private final URL url = new URL("http://localhost:4444/wd/hub");
    private final Map<String, WebDriver> drivers = new ConcurrentHashMap<>();

    public WebDriverParameterResolver() throws MalformedURLException {}

    @Override
    public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext) throws ParameterResolutionException {
        return parameterContext.getParameter()
                .getType()
                .equals(WebDriver.class);
    }

    @Override
    public Object resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext) throws ParameterResolutionException {
        return drivers.computeIfAbsent(extensionContext.getUniqueId(), key -> createWebDriver());
    }

    @Override
    public void afterTestExecution(ExtensionContext context) {
        if (drivers.containsKey(context.getUniqueId())) {
            drivers.get(context.getUniqueId()).quit();
        }
        drivers.remove(context.getUniqueId());
    }

    private WebDriver createWebDriver() {
        return new RemoteWebDriver(url, capabilities);
    }
}
