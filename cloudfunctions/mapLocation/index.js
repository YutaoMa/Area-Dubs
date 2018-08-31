const request = require('request');

function getLocation(id) {
  return new Promise((resolve, reject) => {
    const url = `http://www.washington.edu/maps/?json=get_post&include=title%2Ccustom_fields&custom_fields=longitude%2Clatitude&post_id=${id}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatLocation(r) {
  const res = JSON.parse(r).post;
  const location = {
    id: res.id,
    title: res.title.replace(/&amp;/g, '&'),
    longitude: res.custom_fields.longitude,
    latitude: res.custom_fields.latitude,
  };
  return location;
}

exports.main = async (event) => {
  const { id } = event;
  const r = await getLocation(id);
  const res = formatLocation(r);
  return res;
};
