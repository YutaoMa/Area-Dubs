let request = require('request');

function getCourses(key) {
  return new Promise(function (resolve, reject) {
    let url = 'https://canvas.uw.edu/api/v1/courses?include=term';
    url += '&access_token=' + key;
    request(url, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatCourses(r, termId) {
  let res = [];
  for (let course of JSON.parse(r)) {
    if (course.term.id == termId) {
      res.push({
        code: course.course_code,
        title: course.name.replace(course.course_code + ' ', ''),
        id: course.id
      });
    }
  }
  return res;
}

exports.main = async (event, context) => {
  let { key, termId } = event;
  let r = await getCourses(key);
  let res = formatCourses(r, termId);
  return res;
}