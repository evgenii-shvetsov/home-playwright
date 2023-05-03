import { test, expect, chromium } from "@playwright/test";

test("FSP demo", async () => {
  const browser = await chromium.launch({ slowMo: 500, headless: false });

  const context = await browser.newContext({
    recordVideo: {
      dir: "./videos",
      size: { width: 800, height: 800 },
    },
  });

  const page = await context.newPage();

  await page.pause();
  await page.goto("https://home-hi1b.onrender.com/");

  // login user
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("button", { name: "Demo Login" }).click();

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
  const apartmentHeader = page.locator('h4')
  await expect(apartmentHeader).toHaveText('Real Estate & Homes, based on your search " apartment "')


  // assertion for specific apartment address
  await page
    .locator("div:nth-child(8) > .location-marker > .listing-icon")
    .hover();
  await page
    .locator("div:nth-child(8) > .location-marker > .listing-icon")
    .click();
  const address = page.locator('#listing-location');
  await expect(address).toHaveText("690 Market St,  San Francisco,  CA 94104")

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


