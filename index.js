const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
  res.send('✅ Email-click-agent is ready');
});

app.listen(port, () => {
  console.log(`Agent actif sur http://localhost:${port}`);
});
