const request = require('request');

function getTimes(gid, date) {
  return new Promise((resolve, reject) => {
    const url = `https://uw.libcal.com/spaces/accessible/ajax/group?prevGroupId=${gid}&gid=${gid}&capacity=0&date=${date}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatTimes(r) {
  return r;
}

exports.main = async (event) => {
  const { gid, date } = event;
  const r = await getTimes(gid, date);
  const res = formatTimes(r);
  return res;
};
