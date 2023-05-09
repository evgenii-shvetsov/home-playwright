import { test, expect, chromium, webkit } from "@playwright/test";

import LoginDemoUser from "../pages/login";

test("FSP demo", async () => {
  const browser = await chromium.launch({ slowMo: 500, headless: false });

  const context = await browser.newContext({
    recordVideo: {
      dir: "./videos",
      size: { width: 800, height: 800 },
    },
  });

  const page = await context.newPage();

  const Login = new LoginDemoUser(page);
    // await page.pause();

  // login user
  await Login.gotoLoginModal();
  await Login.login("demo-user", "demo-password");

  // assertion for correct email after login

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

  //   await expect(apartmentHeader).toHaveText(
  //     'Real Estate & Homes, based on your search " apartment "'
  //   );
  await Promise.all([
    expect(apartmentHeader).toHaveText(
      'Real Estate & Homes, based on your search " apartment "'
    ),
    page.waitForLoadState("load"),
  ]);



  const locator = page.locator(
    "div:nth-child(6) > .location-marker > .listing-icon"
  );

  await locator.hover();
  await locator.click();

  const address = page.locator("#listing-location");
  await expect(address).toHaveText("301 Mission St,  San Francisco,  CA 94105");

  // add check for switching from "save" to "saved" and check for red heart

  await page.getByRole("button", { name: " Save" }).click();
  await page.getByRole("button", { name: "" }).click();

  await page.getByRole("button", { name: "Manage Account" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "Log Out" }).click();

  await context.close();
  await browser.close();
});
