const request = require('request');

function getRoute(fromLat, fromLong, toLat, toLong) {
  return new Promise((resolve, reject) => {
    const url = `http://dev.virtualearth.net/REST/v1/Routes/walking?key=AgjOXT6iQZtlljH-U3j_SDqaEpK8ayKPdAm_DRStAM-RLAvKNMl-Swk_h2wGFrZE&ra=routePath&tl=0.0002&wp.1=${fromLat},${fromLong}&wp.2=${toLat},${toLong}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatRoute(r) {
  const res = JSON.parse(r).resourceSets[0].resources[0];
  const time = `${(res.travelDuration / 60).toFixed(2)} Mins`;
  const distance = `${(res.travelDistance)} KMs`;
  const points = [];
  res.routePath.generalizations[0].pathIndices.forEach((index) => {
    points.push({
      latitude: res.routePath.line.coordinates[index][0],
      longitude: res.routePath.line.coordinates[index][1],
    });
  });
  const result = {
    time,
    distance,
    route: points,
  };
  return result;
}

exports.main = async (event) => {
  const {
    fromLat,
    fromLong,
    toLat,
    toLong,
  } = event;
  const r = await getRoute(fromLat, fromLong, toLat, toLong);
  const res = formatRoute(r);
  return res;
};
