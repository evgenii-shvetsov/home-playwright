![playwright-demo](https://github.com/evgenii-shvetsov/home-playwright/assets/46214277/afd5b4a9-3d65-4bc1-ba7f-4e7aac9c844f)


# Home - Full Stack Project with sequential automated Playwright tests

## Overview
In this repository, you'll find the automated tests for my Full Stack Project 'Home' (Zillow-like platform), written with the help of Playwright library, a robust end-to-end testing tool for web applications.

## About Playwright
Playwright is a Node.js library developed by Microsoft, designed to automate browser-based applications with ease. It supports a wide range of browsers, including Chrome, Firefox, and Safari, and offers a versatile API for crafting and maintaining tests.

## Testing with Playwright
I've used Playwright to write a series of tests that emulate user interactions and ensure that the application functions as expected. The tests are sequential, covering user actions from logging in to the application, searching for apartments, saving listings, managing account, and finally, logging out.

## How to Run the Tests
Before running the tests, ensure that you have Node.js and Playwright installed in your environment.

To run specific test:
```javascript
npx playwright test ./tests/homeFSP.spec.js     
```

## Code Snippets
#### Login DemoUser Class
```javascript

class LoginDemoUser {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder("Enter username or email")
    this.passwordInput = page.getByPlaceholder("Enter password")
    this.loginBtn = page
      .locator("#modal-content")
      .getByRole("button", { name: "Log In" });
  }

  async gotoLoginModal(){
    this.page.goto("https://home-hi1b.onrender.com/");
  }

  async login(username, password) {
    await this.page.getByRole("button", { name: "Log In" }).click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}

export default LoginDemoUser;
```

## Playwright report

![playwright-report](https://github.com/evgenii-shvetsov/home-playwright/assets/46214277/91f40cdb-2b8e-44dc-84b0-09dea2543c9a)





