const request = require('request');

function getCourse(code) {
  return new Promise((resolve, reject) => {
    const url = `https://myplan.uw.edu/course/api/courses/${code}/details`;
    request(url, (err, res, body) => {
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
  const res = JSON.parse(r);
  if (res.courseOfferingInstitutionList.length > 0) {
    terms = [];
    res.courseOfferingInstitutionList[0].courseOfferingTermList.forEach((term) => {
      const sections = [];
      term.activityOfferingItemList.forEach((section) => {
        const scheduleList = [];
        section.meetingDetailsList.forEach((schedule) => {
          scheduleList.push({
            info: `${schedule.days} ${schedule.time} @ ${schedule.building} ${schedule.room}`,
            building: schedule.building,
          });
        });
        let comment;
        if (section.sectionComments != null) {
          comment = section.sectionComments.trim();
        } else {
          comment = null;
        }
        sections.push({
          code: section.code,
          type: section.activityOfferingType,
          schedule: scheduleList,
          status: section.enrollStatus,
          count: section.enrollCount,
          max: section.enrollMaximum,
          instructor: section.instructor,
          comment,
        });
      });
      terms.push({
        term: term.term,
        sections,
      });
    });
  } else {
    terms = null;
  }
  const response = {
    code: res.courseSummaryDetails.code,
    title: res.courseSummaryDetails.courseTitle,
    terms,
  };
  return response;
}

exports.main = async (event) => {
  const { code } = event;
  const r = await getCourse(code);
  const res = formatCourse(r);
  return res;
};
