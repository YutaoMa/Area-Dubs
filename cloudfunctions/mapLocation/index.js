let request = require('request');

function getLocation(id) {
  return new Promise(function(resolve, reject) {
    let url = 'http://www.washington.edu/maps/?json=get_post&include=title%2Ccustom_fields&custom_fields=longitude%2Clatitude&post_id=';
    url += id;
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatLocation(r) {
  let res = JSON.parse(r).post;
  let location = {
    title: res.title.replace(/&amp;/g, '&'),
    longitude: res.custom_fields.longitude,
    latitude: res.custom_fields.latitude
  };
  return location;
}

exports.main = async (event, context) => {
  let { id } = event;
  let r = await getLocation(id);
  let res = formatLocation(r);
  return res;
}