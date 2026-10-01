/**
 * Full-page captures of https://twinbyte.online -> public/site/{mobile,desktop}.png
 * mobile 390x844 @3x, desktop 1440x900 @2x. Closes the cookie banner first.
 * If the site can't be loaded the reel uses the React fallback site (src/components/ModernSite.tsx).
 * To use real captures: run this, then swap <ModernSiteMobile/Desktop> for an <Img> of the capture
 * translated by scrollY inside the mockups.
 * Usage: npx tsx scripts/capture-site.ts
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = "https://twinbyte.online";
const OUT = path.resolve(__dirname, "../public/site");

const closeCookies = async (page: import("playwright").Page) => {
  for (const label of [/accept/i, /accetta/i, /accepteren/i, /agree/i, /ok/i, /got it/i]) {
    const b = page.getByRole("button", { name: label }).first();
    if (await b.isVisible().catch(() => false)) return void (await b.click().catch(() => {}));
  }
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const [name, vp, dpr] of [["mobile", { width: 390, height: 844 }, 3], ["desktop", { width: 1440, height: 900 }, 2]] as const) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: name === "mobile" });
      const page = await ctx.newPage();
      await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });
      await closeCookies(page);
      // trigger lazy content, then back to top
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log(`saved ${name}.png`);
      await ctx.close();
    }
  } catch (e) {
    console.error(`Could not capture ${URL}: ${(e as Error).message.split("\n")[0]}\n-> keep the React fallback site.`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
