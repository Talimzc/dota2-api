const express = require("express");
var cors = require("cors");
const fetch = require("node-fetch");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/heroes", async (req, res) => {
  fetch("https://www.dota2.com/datafeed/herolist?language=spanish")
    .then((res) => res.json())
    .then((data) => {
      const heroes = data?.result.data.heroes || [];
      let mapped = heroes.map((hero) => {
        let slug = hero?.name?.substring(14);
        let obj = {
          ...hero,
          slug: slug,
          image: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${slug}.png`,
        };
        return obj;
      });
      let ordered = mapped.sort((a, b) => (a.name_loc < b.name_loc ? -1 : 1));
      res.json(ordered);
    });
});

app.get("/heroes/hero/:id", async (req, res) => {
  let { id } = req.params;
  fetch(
    `https://www.dota2.com/datafeed/herodata?language=spanish&hero_id=${id}`
  )
    .then((res) => res.json())
    .then((data) => {
      const heroInfo = data?.result?.data?.heroes[0] || {};
      res.json(heroInfo);
    });
});

const PORT = 4001;
app.listen(PORT);
console.log(`Server running in port ${PORT}`);
