const axios = require('axios');

const BASE_URL = 'https://www.eventbriteapi.com/v3';
const USER_ID = '6894501025';

module.exports = {
  method: 'GET',
  path: '/api/events',
  handler: {
      axios.get(`${BASE_URL}/events/search?organizer.id=${USER_ID}`, {
        headers: { authorization: `Bearer ${process.env.TOKEN}` },
      })
   .then((response) => {
     reply(response.data);
   }).catch(err => console.log('cannot search=>', err));



    // return reply({ result: 'Hello hapi!' });
  },
};
