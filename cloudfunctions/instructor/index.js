const request = require('request');

function getInstructor(first, last) {
  return new Promise((resolve, reject) => {
    const url = `https://search.mtvnservices.com/typeahead/suggest/?solrformat=true&rows=1&q=${first}%20${last}+AND+schoolid_s%3A1530&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&rows=1&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+averageeasyscore_rf&fq`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatInstructor(r) {
  const res = JSON.parse(r);
  if (res.response.numFound === 0 || res.response.docs[0] == null) {
    return 'Not Found';
  }
  return res.response.docs[0];
}

exports.main = async (event) => {
  const { first, last } = event;
  const r = await getInstructor(first, last);
  const res = formatInstructor(r);
  return res;
};
