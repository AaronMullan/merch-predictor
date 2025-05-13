require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

async function importConcerts(artistId) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const url = `${baseUrl}${artistId}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const UPCOMING_SELECTOR = 'ol.artist-calendar-summary';
  const PAST_SELECTOR = 'ol.artist-gigography-summary';

  function parseConcerts(listSelector) {
    const concerts = [];
    $(listSelector)
      .find('li')
      .each((index, el) => {
        const date = $(el).find('time').attr('datetime')?.trim() || '';
        const city = $(el).find('strong.primary-detail').text().trim();
        const venue = $(el).find('p.secondary-detail').text().trim();
        if (date && city && venue) {
          concerts.push({ date, city, venue });
        }
      });
    return concerts;
  }

  // Grab the "see-all artist" link
  const morePastConcertsHREF = $('p.see-all.artist a').attr('href') || null;

  const upcomingConcerts = parseConcerts(UPCOMING_SELECTOR);
  const pastConcerts = parseConcerts(PAST_SELECTOR);

  return { morePastConcertsHREF, upcomingConcerts, pastConcerts };
}

// CLI usage
if (require.main === module) {
  const artistId = process.argv[2];
  if (!artistId) {
    console.error('Usage: node songkick-scraper.js <artistId>');
    process.exit(1);
  }
  importConcerts(artistId)
    .then(result => {
      console.log('morePastConcertsHREF:', result.morePastConcertsHREF);
      console.log('upcomingConcerts:', result.upcomingConcerts);
      console.log('pastConcerts:', result.pastConcerts);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}
