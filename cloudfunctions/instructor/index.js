let request = require('request');

function getInstructor(first, last) {
  return new Promise(function(resolve, reject) {
    let url = "https://search.mtvnservices.com/typeahead/suggest/?solrformat=true&rows=1&q=";
    url += first + "%20" + last;
    url += "+AND+schoolid_s%3A1530&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&rows=1&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+averageeasyscore_rf&fq";
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatInstructor(r) {
  let res = JSON.parse(r);
  if (res.response.numFound == 0 || res.response.docs[0] == null) {
    return 'Not Found';
  } else {
    return res.response.docs[0];
  }
}

exports.main = async (event, context) => {
  let { first, last } = event;
  let r = await getInstructor(first, last);
  let res = formatInstructor(r);
  return res;
}