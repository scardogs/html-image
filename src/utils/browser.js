// Optimized for serverless: using puppeteer-core + @sparticuz/chromium
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

/**
 * Creates a Puppeteer browser instance optimized for serverless environments
 * @param {Object} options - Additional launch options
 * @returns {Promise<Object>} Puppeteer browser instance
 */
export async function createBrowser(options = {}) {
  // Check if we're in a serverless environment
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production' || !process.env.NODE_ENV;
  
  if (isServerless) {
    // Use @sparticuz/chromium for serverless environments
    try {
      return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ...options,
      });
    } catch (error) {
      console.error('Error launching browser with @sparticuz/chromium:', error);
      throw new Error(`Failed to launch browser: ${error.message}`);
    }
  } else {
    // Use local Puppeteer for development
    try {
      const puppeteerLocal = await import('puppeteer');
      return await puppeteerLocal.default.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
        ...options,
      });
    } catch (error) {
      // Fallback to @sparticuz/chromium if puppeteer is not available
      console.warn('puppeteer not available, falling back to @sparticuz/chromium');
      return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ...options,
      });
    }
  }
}

/**
 * Default browser configuration for serverless environments
 */
export const defaultBrowserConfig = {
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
};
