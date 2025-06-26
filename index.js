const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Email-click-agent is ready");
});

app.post("/click", async (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("a:has-text('Confirm Reading')", { timeout: 8000 }).then(async () => {
      await page.click("a:has-text('Confirm Reading')");
    }).catch(() => {
      throw new Error("Bouton de confirmation introuvable");
    });

    await page.waitForTimeout(4000); // attendre que le clic soit bien pris
    await browser.close();
    res.send("✅ Clic confirmé sur la page Paid Email");
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).send("Erreur lors du clic sur l’e-mail");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});