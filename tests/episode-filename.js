const fs = require("fs/promises");
const axios = require("axios");

const regex = /[^A-Za-z0-9._\-\40]/g;

(async () => {
  const episodesRequest = await axios.get(
    "https://unusann.us/api/v3/metadata/3/all"
  );

  const seasons = episodesRequest.data;

  for (let s = 0; s < seasons.length; s++) {
    const season = seasons[s];

    for (let e = 0; e < season.length; e++) {
      const episode = season[e];

      console.log(negate(episode.title));
    }
  }
})();

const negate = (value) => {
  return value.replaceAll(regex, "_");
};
