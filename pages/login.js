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