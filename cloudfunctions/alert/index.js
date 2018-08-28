let request = require('request');

function getAlert() {
  return new Promise(function(resolve, reject) {
    let url = 'https://public-api.wordpress.com/rest/v1/sites/uwemergency.wordpress.com/posts';
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatAlert(r) {
  let posts = JSON.parse(r).posts;
  let result = [];
  for (let post of posts) {
    result.push({
      title: post.title,
      dateCreated: formatDate(post.date),
      dateModified: formatDate(post.modified),
      content: post.content
    });
  }
  return result;
}

function formatDate(date) {
  let d = new Date(date);
  return d.toLocaleDateString('en-US');
}

exports.main = async (event, context) => {
  let r = await getAlert();
  let res = formatAlert(r);
  return res;
}
