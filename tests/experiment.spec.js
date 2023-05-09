import { test, expect, chromium } from "@playwright/test";

let browser;
let context;
let page;

test.beforeAll(async () => {
  browser = await chromium.launch({ slowMo: 500, headless: false });
  context = await browser.newContext();
  page = await context.newPage();
//   await page.goto("https://home-hi1b.onrender.com/");

//   // Demo user login
//   await page.getByRole("button", { name: "Log In" }).click();
//   await page.getByRole("button", { name: "Demo Login" }).click();
});

test.beforeEach(async () => {
  await page.goto("https://home-hi1b.onrender.com/");

  // Demo user login
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("button", { name: "Demo Login" }).click();
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe("FSP demo", () => {
  test("Test 1: Assertion for correct email after login", async () => {
    await page.getByRole("button", { name: "" }).click();
    const emailElement = page.locator("ul.profile-dropdown li:nth-child(2)");
    await expect(emailElement).toHaveText("demo-user@mail.com");
  });

  test("Test 2: Assertion for correct output from the search bar", async () => {
    await page.getByPlaceholder("Enter a Home Type or ZIP code").click();
    await page
      .getByPlaceholder("Enter a Home Type or ZIP code")
      .fill("apartment");
    await page.getByPlaceholder("Enter a Home Type or ZIP code").press("Enter");
    const apartmentHeader = page.locator("h4");
    await expect(apartmentHeader).toHaveText(
      'Real Estate & Homes, based on your search " apartment "'
    );
    
  });

  test("Test 3: Correct address of the apartment", async () => {
    // await page.pause();
    await page.getByPlaceholder("Enter a Home Type or ZIP code").click();
    await page
      .getByPlaceholder("Enter a Home Type or ZIP code")
      .fill("apartment");
    await page.getByPlaceholder("Enter a Home Type or ZIP code").press("Enter");

    // Questionable part
    await page.waitForSelector(
      "div:nth-child(12) > .location-marker > .listing-icon"
    );

    await page
      .locator("div:nth-child(12) > .location-marker > .listing-icon")
      .hover();

    await page
      .locator("div:nth-child(12) > .location-marker > .listing-icon")
      .click();
    const address = page.locator("#listing-location");

    await expect(address).toHaveText(
      "301 Mission St,  San Francisco,  CA 94105"
    );
  });

  //   test("Add check for switching from save to saved and check for red heart", async () => {
  //     await page.getByRole("button", { name: " Save" }).click();
  //     await page.waitForSelector("[data-testid=button-saved]");
  //     await expect(page.locator("[data-testid=icon-heart]")).toHaveClass(
  //       "fa-heart"
  //     );
  //   });
});




{/* <section class="listing-detail">
  <h2>$4,236</h2>
  <div>2 bds | &nbsp;2 ba | &nbsp;817 sqft | &nbsp; For rent</div>
  <div>1145 Harrison St, &nbsp;San Francisco, &nbsp;CA&nbsp;94103</div>
</section>; */}