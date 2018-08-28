let request = require('request');

function getTimes(gid, date) {
  return new Promise(function(resolve, reject) {
    let url = 'https://uw.libcal.com/spaces/accessible/ajax/group';
    url += '?prevGroupId=' + gid;
    url += '&gid=' + gid;
    url += '&capacity=0';
    url += '&date=' + date;
    request(url, function(err, res, body) {
      if(err) {
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

exports.main = async (event, context) => {
  let { gid, date } = event;
  let r = await getTimes(gid, date);
  let res = formatTimes(r);
  return res;
}