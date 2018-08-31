const request = require('request');

function getHours() {
  return new Promise((resolve, reject) => {
    const url = 'https://api3.libcal.com/api_hours_today.php?iid=395&format=json';
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatHours(r) {
  return r;
}

exports.main = async () => {
  const r = await getHours();
  const res = formatHours(r);
  return res;
};
