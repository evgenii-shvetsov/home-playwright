import { test, expect, chromium, webkit } from "@playwright/test";
import LoginDemoUser from "../pages/login";

let browser, context, page, Login;

test.beforeAll(async () => {
  browser = await chromium.launch({ slowMo: 700, headless: false });
  context = await browser.newContext({
    recordVideo: {
      dir: "./videos",
      size: { width: 1280, height: 720 },
    },
  });
  page = await context.newPage();
  Login = new LoginDemoUser(page);

  await Login.gotoLoginModal();
  await Login.login("demo-user", "demo-password");
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

async function resetAppState() {
  await page.goto("https://home-hi1b.onrender.com/");
}

async function searchForApartments() {
  await page.getByPlaceholder("Enter a Home Type or ZIP code").click();
  await page
    .getByPlaceholder("Enter a Home Type or ZIP code")
    .fill("apartment");
  await page.getByPlaceholder("Enter a Home Type or ZIP code").press("Enter");
  await page.waitForLoadState("load");
}

test("Home - Full Stack Project with sequential automated Playwright tests", async () => {
  await test.step("Test 1: Login and email check", async () => {
    await page.getByRole("button", { name: "" }).click();
    const emailElement = page.locator("ul.profile-dropdown li:nth-child(2)");
    await expect(emailElement).toHaveText("demo-user@mail.com");
  });
  await resetAppState();

  await test.step("Test 2: Check the Search Bar filter output for the 'apartments' keyword", async () => {
    await searchForApartments();

    const apartmentHeader = page.locator("h4");
    await expect(apartmentHeader).toHaveText(
      'Real Estate & Homes, based on your search " apartment "'
    );
  });
  await resetAppState();

  await test.step("Test 3: Check for the spicific listing details and 'saving' functionality", async () => {
    searchForApartments();
    const locator = page.locator(
      "div:nth-child(6) > .location-marker > .listing-icon"
    );

    await locator.hover();
    await locator.click();
    const address = page.locator("#listing-location");
    await expect(address).toHaveText(
      "301 Mission St,  San Francisco,  CA 94105"
    );

    await page.getByRole("button", { name: " Save" }).click();
    await expect(
      page.locator("button.show-page-font-awesome-favorite")
    ).toHaveText("Saved");
  });

  await resetAppState();

  await test.step("Test 4: Access demo user profile page and remove the favorite listing", async () => {
    await page.getByRole("button", { name: "" }).click();
    await page.getByRole("button", { name: "Manage Account" }).click();
    await expect(
      page.locator('h4:has-text("Welcome Home, demo-user !")')
    ).toBeVisible();

    await page.getByRole("button", { name: "" }).click();
    await expect(
      page.locator(
        '.listings-output div:has-text("301 Mission St, San Francisco, CA 94105")'
      )
    ).not.toBeVisible();
  });
  await resetAppState();

  await test.step("Test 5: Logout and redirect to main page", async () => {
    await page.getByRole("button", { name: "" }).click();
    await page.getByRole("button", { name: "Log Out" }).click();
    expect(page.url()).toEqual("https://home-hi1b.onrender.com/");
  });
});
