const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const { url } = req.body;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await browser.close();

    console.log("✅ Clic simulé sur :", url);
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Erreur :", error.message);
    res.status(500).json({ status: "fail", error: error.message });
  }
});

app.get("/", (req, res) => res.send("Agent Email prêt 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
