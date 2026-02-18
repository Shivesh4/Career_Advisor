// Minimal proxy that queries Lever + Greenhouse and returns merged results
export const searchJobs = async (req, res, next) => {
    try {
      const role = (req.query.q || "software engineer").toString();
      const location = (req.query.loc || "").toString().toLowerCase();
  
      const GH = ["stripe","airbnb","asana","openai","notion","datadog","square","dropbox","plaid","figma","doordash","discord","f5"];
      const LV = ["airbnb","asana","affirm","datadog","notion","stripe","square","openai"];
  
      const ghPromises = GH.map(async (c) => {
        const r = await fetch(`https://boards-api.greenhouse.io/v1/boards/${c}/jobs`);
        if (!r.ok) return [];
        const j = await r.json();
        return j.jobs
          .filter((x) => x.title?.toLowerCase().includes(role.toLowerCase()))
          .map((x) => ({
            source: "Greenhouse", company: c, title: x.title, url: x.absolute_url,
            location: x.location?.name, updatedAt: x.updated_at
          }));
      });
  
      const lvPromises = LV.map(async (c) => {
        const r = await fetch(`https://api.lever.co/v0/postings/${c}?mode=json`);
        if (!r.ok) return [];
        const j = await r.json();
        return j
          .filter((x) => x.text?.toLowerCase().includes(role.toLowerCase()))
          .map((x) => ({
            source: "Lever", company: c, title: x.text, url: x.hostedUrl,
            location: x.categories?.location, createdAt: x.createdAt
          }));
      });
  
      const all = (await Promise.all([...ghPromises, ...lvPromises])).flat();
  
      const seen = new Set();
      let unique = all.filter((x) => {
        const key = `${(x.title||"").toLowerCase()}|${(x.company||"").toLowerCase()}`;
        if (seen.has(key)) return false; seen.add(key); return true;
      });
  
      if (location) {
        unique = unique.filter((x) => (x.location||"").toLowerCase().includes(location));
      }
  
      res.json({ jobs: unique });
    } catch (e) { next(e); }
  };
  