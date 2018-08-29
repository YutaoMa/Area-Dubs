let request = require('request');

function getRoute(fromLat, fromLong, toLat, toLong) {
  return new Promise(function(resolve, reject) {
    let url = 'http://dev.virtualearth.net/REST/v1/Routes/walking?key=AgjOXT6iQZtlljH-U3j_SDqaEpK8ayKPdAm_DRStAM-RLAvKNMl-Swk_h2wGFrZE&ra=routePath';
    url += '&tl=0.0002';
    url += '&wp.1=' + fromLat + ',' + fromLong;
    url += '&wp.2=' + toLat + ',' + toLong;
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatRoute(r) {
  r = JSON.parse(r);
  let res = r.resourceSets[0].resources[0];
  let time = (res.travelDuration / 60) + ' Mins';
  let distance = (res.travelDistance) + ' KMs';
  let points = [];
  for (let index of res.routePath.generalizations[0].pathIndices) {
    points.push({
      latitude: res.routePath.line.coordinates[index][0],
      longitude: res.routePath.line.coordinates[index][1]
    });
  }
  let result = {
    time: time,
    distance: distance,
    route: points
  };
  return result;
}

exports.main = async (event, context) => {
  let { fromLat, fromLong, toLat, toLong } = event;
  let r = await getRoute(fromLat, fromLong, toLat, toLong);
  let res = formatRoute(r);
  return res;
}
