const request = require('request');

function searchCourse(code) {
  return new Promise((resolve, reject) => {
    const url = 'https://myplan.uw.edu/course/api/courses/';
    const data = {
      campus: 'seattle',
      consumerLevel: 'UNDERGRADUATE',
      queryString: code,
      sectionSearch: false,
    };
    request({
      url,
      method: 'POST',
      json: true,
      body: data,
    }, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatCourse(r) {
  const results = [];
  for (let i = 0; i < r.length && i < 20; i += 1) {
    results.push({
      code: r[i].code,
    });
  }
  return results;
}

exports.main = async (event) => {
  const { code } = event;
  const r = await searchCourse(code);
  const res = formatCourse(r);
  return res;
};
