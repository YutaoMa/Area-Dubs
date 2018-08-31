const request = require('request');

function getCourses(key) {
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

function formatCourses(r, termId) {
  const res = [];
  JSON.parse(r).forEach((course) => {
    if (course.term.id === termId) {
      res.push({
        code: course.course_code,
        title: course.name.replace(`${course.course_code} `, ''),
        id: course.id,
      });
    }
  });
  return res;
}

exports.main = async (event) => {
  const { key, termId } = event;
  const r = await getCourses(key);
  const res = formatCourses(r, termId);
  return res;
};
