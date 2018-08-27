let request = require('request');

function getCourse(code) {
  return new Promise(function(resolve, reject) {
    let url = 'https://myplan.uw.edu/course/api/courses/' + code + '/details';
    request(url, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatCourse(r) {
  let terms;
  r = JSON.parse(r);
  if (r['courseOfferingInstitutionList'].length > 0) {
    terms = [];
    for (let term of r['courseOfferingInstitutionList'][0]['courseOfferingTermList']) {
      let sections = [];
      for (let section of term['activityOfferingItemList']) {
        let schedule_list = [];
        for (let schedule of section['meetingDetailsList']) {
          schedule_list.push({
            'info': schedule['days'] + " " + schedule['time'] + " @ " + schedule['building'] + " " + schedule['room'],
            'building': schedule['building']
          });
        }
        let comment;
        if (section['sectionComments'] != null) {
          comment = section['sectionComments'].trim();
        } else {
          comment = null;
        }
        section_info = {
          'code': section['code'],
          'type': section['activityOfferingType'],
          'schedule': schedule_list,
          'status': section['enrollStatus'],
          'count': section['enrollCount'],
          'max': section['enrollMaximum'],
          'instructor': section['instructor'],
          'comment': comment
        };
        sections.push(section_info);
      }
      term_info = {
        'term': term['term'],
        'sections': sections
      };
      terms.push(term_info);
    }
  } else {
    terms = null;
  }
  response = {
    'code': r['courseSummaryDetails']['code'],
    'title': r['courseSummaryDetails']['courseTitle'],
    'terms': terms
  };
  return response;
}

exports.main = async(event, context) => {
  let {
    code
  } = event;
  let r = await getCourse(code);
  let res = formatCourse(r);
  return res;
}