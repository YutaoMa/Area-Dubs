let request = require('request');
let cheerio = require('cheerio');

function getReq(code) {
  return new Promise(function(resolve, reject) {
    let url ='https://myplan.uw.edu/program/api/audits/empty/' + code;
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatReq(r) {
  let $ = cheerio.load(r);
  $(".linkified").each(function (i, ele) {
    let text = $(ele).attr("data-subject") + " " + $(ele).attr("data-number");
    $(ele).text(text);
  });
  $(".status, .earned, .UTEXT, .MATRICTXT, .HUNGRY-EL").each(function (i, ele) {
    $(ele).remove();
  });
  let response = [];
  $(".audit-section, .audit-large-section").each(function (i, ele) {
    let heading = $(ele).find(".audit-section-heading, .audit-large-section-heading").text().filter();
    let requirements = [];
    $(ele).find(".audit-requirement").each(function (ii, reqEle) {
      let info = $(reqEle).find(".audit-requirement-info").text().filter();
      let detail = $(reqEle).find(".audit-requirement-details").text().filter();
      let requirement = {
        info: info,
        detail: detail
      };
      requirements.push(requirement);
    });
    let section = {
      heading: heading,
      requirements: requirements
    };
    response.push(section);
  });
  return response;
}

String.prototype.filter = function () {
  let reg1 = /\ +/g;
  let str1 = this.replace(reg1, ' ');
  let reg2 = /\t+/g;
  let str2 = str1.replace(reg2, "");
  let reg3 = /\n(\s)*\n/g;
  return str2.replace(reg3, "\n").trim();
};

exports.main = async (event, context) => {
  let { code } = event;
  let r = await getReq(code);
  let res = formatReq(r);
  return res;
}