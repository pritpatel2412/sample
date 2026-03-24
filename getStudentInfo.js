const chrome = require('@sparticuz/chromium')
const puppeteer = require('puppeteer-core')

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
const API_KEY = process.env.API_KEY || ''

async function getStudentInfo(studentID) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: 'new',
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    const startTime = Date.now();

    await page.goto('https://support.charusat.edu.in/FeesPaymentApp/frmpayment.aspx', { waitUntil: 'networkidle0' });
    await page.type('#ContentPlaceHolder1_txtStudentID', studentID);
    await page.click('#ContentPlaceHolder1_btnSearch');

    const result = await Promise.race([
      page.waitForSelector('#ContentPlaceHolder1_txtStudentName', { visible: true }).then(() => 'studentFound'),
      page.waitForSelector('.sweet-alert', { visible: true }).then(() => 'notFound'),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout waiting for result")), 10000))
    ]);
    

    const endTime = Date.now();
    const timeTaken = `${(endTime - startTime) / 1000} s`;

    if (result === 'studentFound') {
      const responseCode = "200";
      const studentName = await page.$eval('#ContentPlaceHolder1_txtStudentName', el => el.value);
      const instituteName = await page.$eval('#ContentPlaceHolder1_txtInstitute', el => el.value);
      const departmentName = await page.$eval('#ContentPlaceHolder1_txtDegree', el => el.value);
      const currentSemester = await page.$eval('#ContentPlaceHolder1_txtCurrSemester', el => el.value);
      return {
        responseCode,
        studentName,
        instituteName,
        departmentName,
        currentSemester,
        timeTaken
      };
    } else if (result === 'notFound') {
      const responseCode = "404";
      const error = "Student Not Found";
      return { responseCode, error, timeTaken };
    }

  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  } finally {
    if (browser !== null) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("Failed to close browser:", closeErr);
      }
    }
  }
}

module.exports = async (req, res) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  const studentIDRaw = req.query.id;
  const studentID = typeof studentIDRaw === 'string' ? studentIDRaw.trim() : '';

  if (!studentID) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    const data = await getStudentInfo(studentID);
    res.json(data);
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Failed to fetch student information", details: error.message });
  }
};