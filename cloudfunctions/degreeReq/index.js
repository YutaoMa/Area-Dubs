const request = require('request');
const cheerio = require('cheerio');

function getReq(code) {
  return new Promise((resolve, reject) => {
    const url = `https://myplan.uw.edu/program/api/audits/empty/${code}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function strFilter(str) {
  const reg1 = / +/g;
  const str1 = str.replace(reg1, ' ');
  const reg2 = /\t+/g;
  const str2 = str1.replace(reg2, '');
  const reg3 = /\n(\s)*\n/g;
  return str2.replace(reg3, '\n').trim();
}

function formatReq(r) {
  const $ = cheerio.load(r);
  $('.linkified').each((i, ele) => {
    const text = `${$(ele).attr('data-subject')} ${$(ele).attr('data-number')}`;
    $(ele).text(text);
  });
  $('.status, .earned, .UTEXT, .MATRICTXT, .HUNGRY-EL').each((i, ele) => {
    $(ele).remove();
  });
  const response = [];
  $('.audit-section, .audit-large-section').each((i, ele) => {
    const heading = strFilter($(ele).find('.audit-section-heading, .audit-large-section-heading').text());
    const requirements = [];
    $(ele).find('.audit-requirement').each((ii, reqEle) => {
      const info = strFilter($(reqEle).find('.audit-requirement-info').text());
      const detail = strFilter($(reqEle).find('.audit-requirement-details').text());
      const requirement = {
        info,
        detail,
      };
      requirements.push(requirement);
    });
    const section = {
      heading,
      requirements,
    };
    response.push(section);
  });
  return response;
}

exports.main = async (event) => {
  const { code } = event;
  const r = await getReq(code);
  const res = formatReq(r);
  return res;
};
