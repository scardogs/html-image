// Optimized for serverless: using puppeteer-core + @sparticuz/chromium
import { createBrowser } from '../../utils/browser';

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Set timeout to prevent hanging requests
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(504).json({ 
        error: "Request timeout", 
        details: "The conversion took too long to complete" 
      });
    }
  }, 25000); // 25 second timeout (Vercel limit is 30s)

  try {
    console.log('API called with method:', req.method);
    console.log('Request headers:', req.headers);
    
    if (req.method !== "POST") {
      clearTimeout(timeout);
      console.log('Method not allowed:', req.method);
      return res.status(405).json({ 
        error: "Method not allowed",
        receivedMethod: req.method,
        expectedMethod: "POST"
      });
    }

    const { htmlContent, options = {} } = req.body;

    if (!htmlContent) {
      clearTimeout(timeout);
      return res.status(400).json({ error: "HTML content is required" });
    }

    let browser;
    try {
      // Launch Puppeteer browser optimized for serverless
      browser = await createBrowser();

    const page = await browser.newPage();

    // Set a large viewport initially to accommodate any content size
    await page.setViewport({
      width: options.width || 1920,
      height: options.height || 1080,
      deviceScaleFactor: options.scale || 2,
    });

    // Use HTML content as-is without overrides for better compatibility
    const htmlWithOverrides = htmlContent;

    // Set HTML content
    await page.setContent(htmlWithOverrides, {
      waitUntil: "networkidle0",
    });

    // Wait for fonts to load (especially Font Awesome)
    await page.evaluateHandle("document.fonts.ready");

    // Wait for Font Awesome to fully load
    await page.evaluate(() => {
      return new Promise((resolve) => {
        // Check if Font Awesome is loaded
        const checkFontAwesome = () => {
          const testElement = document.createElement("i");
          testElement.className = "fa-solid fa-check";
          testElement.style.position = "absolute";
          testElement.style.left = "-9999px";
          document.body.appendChild(testElement);

          setTimeout(() => {
            document.body.removeChild(testElement);
            resolve();
          }, 500);
        };

        setTimeout(checkFontAwesome, 2000);
      });
    });

    // Get the actual content dimensions dynamically
    const contentDimensions = await page.evaluate(() => {
      // Wait for content to fully render
      return new Promise((resolve) => {
        setTimeout(() => {
          // Force a reflow to ensure all styles are applied
          document.body.offsetHeight;

          // Check if there are elements with fixed dimensions
          const wrapperElements = document.querySelectorAll(".wrapper");
          let hasFixedDimensions = false;
          let fixedWidth = 0;
          let fixedHeight = 0;

          wrapperElements.forEach((element) => {
            const style = window.getComputedStyle(element);
            if (style.width !== "auto" && style.height !== "auto") {
              hasFixedDimensions = true;
              fixedWidth = Math.max(fixedWidth, parseInt(style.width) || 0);
              fixedHeight = Math.max(fixedHeight, parseInt(style.height) || 0);
            }
          });

          if (hasFixedDimensions) {
            console.log("Found fixed dimensions:", {
              width: fixedWidth,
              height: fixedHeight,
            });
            resolve({
              width: Math.ceil(fixedWidth),
              height: Math.ceil(fixedHeight),
            });
            return;
          }

          // Fallback to dynamic calculation for elements without fixed dimensions
          const body = document.body;
          const html = document.documentElement;

          let contentWidth = Math.max(
            body.scrollWidth,
            html.scrollWidth,
            body.offsetWidth,
            html.offsetWidth
          );

          let contentHeight = Math.max(
            body.scrollHeight,
            html.scrollHeight,
            body.offsetHeight,
            html.offsetHeight
          );

          // Check all elements for maximum bounds
          const allElements = document.querySelectorAll("*");
          let maxRight = 0;
          let maxBottom = 0;

          allElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);

            if (style.display !== "none" && style.visibility !== "hidden") {
              maxRight = Math.max(maxRight, rect.right);
              maxBottom = Math.max(maxBottom, rect.bottom);
            }
          });

          contentWidth = Math.max(contentWidth, maxRight);
          contentHeight = Math.max(contentHeight, maxBottom);

          // Ensure minimum dimensions
          contentWidth = Math.max(contentWidth, 400);
          contentHeight = Math.max(contentHeight, 300);

          console.log("Calculated dynamic dimensions:", {
            scrollWidth: body.scrollWidth,
            scrollHeight: body.scrollHeight,
            offsetWidth: body.offsetWidth,
            offsetHeight: body.offsetHeight,
            maxRight,
            maxBottom,
            finalWidth: contentWidth,
            finalHeight: contentHeight,
          });

          resolve({
            width: Math.ceil(contentWidth),
            height: Math.ceil(contentHeight),
          });
        }, 200);
      });
    });

    // Use exact content dimensions without padding
    const finalWidth = Math.ceil(contentDimensions.width);
    const finalHeight = Math.ceil(contentDimensions.height);

    console.log("Content dimensions:", contentDimensions);
    console.log("Final dimensions:", {
      width: finalWidth,
      height: finalHeight,
    });

    // Set viewport to exact content dimensions
    await page.setViewport({
      width: finalWidth,
      height: finalHeight,
      deviceScaleFactor: options.scale || 2,
    });

    // Wait a moment for viewport to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Take screenshot with exact dimensions (no fullPage to avoid extra space)
    const screenshot = await page.screenshot({
      type: "png",
      clip: {
        x: 0,
        y: 0,
        width: finalWidth,
        height: finalHeight,
      },
      omitBackground: false,
    });

    // Close browser
    await browser.close();

      // Return the image as base64
      const base64Image = screenshot.toString("base64");
      const dataUrl = `data:image/png;base64,${base64Image}`;

      clearTimeout(timeout);
      res.status(200).json({
        success: true,
        dataUrl: dataUrl,
        method: "puppeteer",
        dimensions: {
          width: finalWidth,
          height: finalHeight,
        },
      });
    } catch (error) {
      console.error("Puppeteer conversion error:", error);

      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error("Error closing browser:", closeError);
        }
      }

      clearTimeout(timeout);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to convert HTML to PNG",
          details: error.message,
        });
      }
    }
  } catch (outerError) {
    console.error("Outer error:", outerError);
    clearTimeout(timeout);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        details: outerError.message,
      });
    }
  }
}
