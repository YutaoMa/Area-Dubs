const request = require('request');

function getAlert() {
  return new Promise((resolve, reject) => {
    const url = 'https://public-api.wordpress.com/rest/v1/sites/uwemergency.wordpress.com/posts';
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US');
}

function formatAlert(r) {
  const { posts } = JSON.parse(r);
  const result = [];
  posts.forEach((post) => {
    result.push({
      title: post.title,
      dateCreated: formatDate(post.date),
      dateModified: formatDate(post.modified),
      content: post.content,
    });
  });
  return result;
}

exports.main = async () => {
  const r = await getAlert();
  const res = formatAlert(r);
  return res;
};
