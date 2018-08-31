const request = require('request');

function getTerms(key) {
  return new Promise((resolve, reject) => {
    const url = `https://canvas.uw.edu/api/v1/courses?include=term&access_token=${key}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatTerms(r) {
  const res = [];
  const idList = [];
  JSON.parse(r).forEach((course) => {
    if (idList.indexOf(course.term.id) === -1) {
      idList.push(course.term.id);
      res.push({
        name: course.term.name,
        id: course.term.id,
      });
    }
  });
  return res;
}

exports.main = async (event) => {
  const { key } = event;
  const r = await getTerms(key);
  const res = formatTerms(r);
  return res;
};
