const request = require('request');

function getUser(key) {
  return new Promise((resolve, reject) => {
    const url = `https://canvas.uw.edu/api/v1/users/self?access_token=${key}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatUser(r) {
  return r;
}

exports.main = async (event) => {
  const { key } = event;
  const r = await getUser(key);
  const res = formatUser(r);
  return res;
};
