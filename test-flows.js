const puppeteer = require('puppeteer');

async function testUserFlows() {
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for CI
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`PAGE LOG: ${msg.type().substr(0, 3).toUpperCase()} ${msg.text()}`);
  });

  // Enable request/response logging
  page.on('request', request => {
    console.log(`REQUEST: ${request.method()} ${request.url()}`);
  });

  page.on('response', response => {
    console.log(`RESPONSE: ${response.status()} ${response.url()}`);
  });

  try {
    console.log('🚀 Starting automated tests...');

    // Test 1: Landing Page
    console.log('\n📄 Test 1: Landing Page');
    await page.goto('http://localhost:5173');
    await page.waitForSelector('.nav-brand');
    
    const title = await page.title();
    console.log(`✅ Page loaded: ${title}`);

    // Check if login/signup buttons are visible
    const loginBtn = await page.$('.login-btn');
    const signupBtn = await page.$('.signup-btn');
    console.log(`✅ Login button visible: ${!!loginBtn}`);
    console.log(`✅ Signup button visible: ${!!signupBtn}`);

    // Test 2: Navigation to Login (test double-click issue)
    console.log('\n🔑 Test 2: Login Navigation');
    
    // First click
    console.log('First login click...');
    await page.click('.login-btn');
    await page.waitForTimeout(2000);
    
    let currentUrl = page.url();
    console.log(`URL after first click: ${currentUrl}`);
    
    // Second click if still on landing
    if (!currentUrl.includes('/login')) {
      console.log('Second login click needed...');
      await page.click('.login-btn');
      await page.waitForTimeout(2000);
      currentUrl = page.url();
      console.log(`URL after second click: ${currentUrl}`);
    }

    // Test 3: Login Form
    console.log('\n📝 Test 3: Login Form');
    await page.waitForSelector('input[type="email"]');
    
    await page.type('input[type="email"]', 'test7@test.com');
    await page.type('input[type="password"]', 'test1234');
    
    console.log('Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect or error
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log(`Final URL: ${finalUrl}`);
    
    // Check if redirected to dashboard
    if (finalUrl.includes('/dashboard')) {
      console.log('✅ Login successful - redirected to dashboard');
      
      // Test 4: Check authenticated UI
      console.log('\n👤 Test 4: Authenticated UI');
      
      // Check for logout button in navbar
      const logoutBtn = await page.$('.logout-btn');
      const welcomeText = await page.$('.welcome-text');
      
      console.log(`✅ Logout button visible: ${!!logoutBtn}`);
      console.log(`✅ Welcome text visible: ${!!welcomeText}`);
      
      if (welcomeText) {
        const welcomeMessage = await page.evaluate(el => el.textContent, welcomeText);
        console.log(`Welcome message: ${welcomeMessage}`);
      }
      
      // Test 5: Navigate to recipes page
      console.log('\n📚 Test 5: Navigate to Recipes');
      await page.goto('http://localhost:5173/recipes');
      await page.waitForTimeout(3000);
      
      // Check if logout button is still visible on recipes page
      const recipesLogoutBtn = await page.$('.logout-btn');
      console.log(`✅ Logout button on recipes page: ${!!recipesLogoutBtn}`);
      
    } else {
      console.log('❌ Login failed or redirect issue');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the tests
testUserFlows().catch(console.error);