import { test, expect, chromium, webkit } from "@playwright/test";

import LoginDemoUser from "../pages/login";

test("All in one test", async () => {
  const browser = await chromium.launch({ slowMo: 500, headless: false });

  const context = await browser.newContext({
    recordVideo: {
      dir: "./videos",
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  // login user using separate Login class
  const Login = new LoginDemoUser(page);
  await Login.gotoLoginModal();
  await Login.login("demo-user", "demo-password");

  // check for correct email after login
  await page.getByRole("button", { name: "" }).click();
  const emailElement = page.locator("ul.profile-dropdown li:nth-child(2)");
  await expect(emailElement).toHaveText("demo-user@mail.com");

  // testing search bar. Assertion for "apartment" output
  await page.getByPlaceholder("Enter a Home Type or ZIP code").click();
  await page
    .getByPlaceholder("Enter a Home Type or ZIP code")
    .fill("apartment");
  await page.getByPlaceholder("Enter a Home Type or ZIP code").press("Enter");
  await page.waitForLoadState("load");
  const apartmentHeader = page.locator("h4");

  await Promise.all([
    expect(apartmentHeader).toHaveText(
      'Real Estate & Homes, based on your search " apartment "'
    ),
    page.waitForLoadState("load"),
  ]);

  // assertion for correct listing
  const locator = page.locator(
    "div:nth-child(6) > .location-marker > .listing-icon"
  );
  await locator.hover();
  await locator.click();
  const address = page.locator("#listing-location");
  await expect(address).toHaveText("301 Mission St,  San Francisco,  CA 94105");

  // assertion for correct toggling the "save" button
  await page.getByRole("button", { name: " Save" }).click();
  await expect(
    page.locator("button.show-page-font-awesome-favorite")
  ).toHaveText("Saved");

  // testing user profile area
  // assertion for correct heading on the user profile page
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "Manage Account" }).click();
  await expect(
    page.locator('h4:has-text("Welcome Home, demo-user !")')
  ).toBeVisible();

  //remove the listing from the favorites section
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page.locator('div:has-text("301 Mission St, San Francisco, CA 94105")')
  ).not.toBeVisible();

  //logout demo user and redirect to the main page
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "Log Out" }).click();
  expect(page.url()).toEqual("https://home-hi1b.onrender.com/");

  await context.close();
  await browser.close();
});
