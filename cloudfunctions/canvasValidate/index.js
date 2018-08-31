const request = require('request');

function getCourse(key) {
  return new Promise((resolve, reject) => {
    const url = `https://canvas.uw.edu/api/v1/courses.json?access_token=${key}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatCourse(r) {
  return r;
}

exports.main = async (event) => {
  const { key } = event;
  const r = await getCourse(key);
  const res = formatCourse(r);
  return res;
};
