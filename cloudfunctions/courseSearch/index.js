let request = require('request');

function searchCourse(code) {
  return new Promise(function(resolve, reject) {
    let url = 'https://myplan.uw.edu/course/api/courses/';
    let data = {
      campus: 'seattle',
      consumerLevel: 'UNDERGRADUATE',
      queryString: code,
      sectionSearch: false
    };
    request({
      url,
      method: 'POST',
      json: true,
      body: data
    }, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatCourse(r) {
  let results = [];
  for(let i = 0; i < r.length && i < 20; i++) {
    results.push({
      code: r[i].code
    });
  }
  return results;
}

exports.main = async (event, context) => {
  let { code } = event;
  let r = await searchCourse(code);
  let res = formatCourse(r);
  return res;
}