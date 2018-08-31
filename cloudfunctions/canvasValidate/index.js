let request = require('request');

function getCourse(key) {
 return new Promise(function(resolve, reject) {
   let url = 'https://canvas.uw.edu/api/v1/courses.json';
   url += '?access_token=' + key;
   request(url, function(err, res, body) {
     if(err) {
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

exports.main = async (event, context) => {
  let { key } = event;
  let r = await getCourse(key);
  let res = formatCourse(r);
  return r;
}