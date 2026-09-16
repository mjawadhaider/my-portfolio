const sheetId = '1jHAejeVq3DRVA_qyYr3SrlYe0BFABncNpvneqo6vCYM';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;

const defaultEducation = [
  {
    degree: 'Bachelor of Sciences in Computer Science (BSCS)',
    institute: 'Univeristy of Engineering and Technology, Lahore',
    duration: '2021 - 2025',
    highlights: [],
  },
  {
    degree: 'Intermediate in Computer Science (ICS)',
    institute: 'Punjab Group of Colleges, Lahore',
    duration: '2019 - 2021',
    highlights: [],
  },
];
const defaultExperience = [
  {
    position: 'Software Engineer Intern',
    company: 'House Of Tech',
    duration: '2022 - current',
    highlights: [],
  },
];
// The "Skills" sheet has three columns: skill name, a tier (1 = major/core
// skill, anything else = secondary sub-node), and years of experience.
// `tier` only ever picks which of the two node sizes a skill renders as —
// it's never shown as a number, and a skill is never dropped from the
// graph for lacking project links.
const defaultSkillSet = [
  { name: 'Vue.js', tier: 1, years: 3 },
  { name: 'Node.js', tier: 1, years: 3 },
  { name: 'JavaScript', tier: 1, years: 4 },
  { name: 'HTML', tier: 2, years: 4 },
  { name: 'CSS', tier: 2, years: 3 },
  { name: 'Git', tier: 2, years: 3 },
];
const defaultProjects = [
  {
    icon: '95star.png',
    iconSize: '30px',
    name: 'The 95 Stars - Pick & Drop Service',
    associatedWith: 'Contributor',
    description:
      'The 95 Star is a web application for pick and drop services. Customers can make reservations, while the admin has the ability to manage reservations, discount codes, cars, surges, static pages, and configure home page messages.',
    responsibilities:
      'I made contributions to the project by working on change requests for clients.  In addition to addressing client requirements, I focused on ensuring application security by creating robust APIs and implementing appropriate security measures.',
    duration: 'September 2022 - Febuary 2023',
    techStack: [],
    projectLink: 'https://www.the95star.com',
    githubLink: '',
    pictures: ['the95Star.png', '95Star1.png', '95Star2.png', '95Star3.png'],
    impact: '',
    outcomeMetric: '',
    active: false,
  },
  {
    icon: '',
    iconSize: '',
    name: 'Bookee - Web based Book Management Application',
    associatedWith: 'Creator',
    description:
      'The app features a user community where users can follow each other and stay updated on reading activities. Users can maintain a status for each book, indicating whether they have read it, are currently reading it, or are interested in reading it.',
    responsibilities:
      'Through my expertise in web technologies, I successfully integrated frontend functionality with backend APIs, ensuring seamless communication and a smooth user experience. ',
    duration: 'September 2022 - December 2022',
    techStack: [],
    projectLink: '',
    githubLink: 'https://github.com/mJawadHaider/DSA-project-Bookee',
    pictures: ['Bookee-Home.png', 'Bookee2.png'],
    impact: '',
    outcomeMetric: '',
    active: false,
  },
  {
    icon: 'budgetManager.png',
    iconSize: '22px',
    name: 'Budget Manager',
    associatedWith: 'Contributor',
    description:
      'Budget Manager is a web app for construction companies, streamlining budget management, project funding, and e-invoice generation for customers.',
    responsibilities:
      'As a frontend developer, I was responsible for developing the complete frontend of the application using Vuetify and Vue.js. I utilized the power of these frameworks to create a visually appealing and user-friendly interface for seamless user interactions.',
    duration: 'April 2022 - September 2022',
    techStack: [],
    projectLink: '',
    githubLink: 'https://github.com/isajjadali/budget-manager-v3',
    pictures: ['BM.png', 'BM1.png', 'BM2.png'],
    impact: '',
    outcomeMetric: '',
    active: false,
  },
];
const defaultTestimonials = [];

// The gviz endpoint wraps its JSON payload in a `google.visualization.Query.setResponse(...)` call.
function parseGvizResponse(text) {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
}

async function fetchSheetRows(sheetName) {
  const query = encodeURIComponent('Select *');
  const url = `${base}sheet=${sheetName}&tq=${query}`;

  const response = await fetch(url);
  const text = await response.text();
  return parseGvizResponse(text).table.rows;
}

async function fetchExperience() {
  try {
    const rows = await fetchSheetRows('Experience');
    const experience = [];
    rows.forEach((item, index) => {
      if (index === 0) return;
      experience.push({
        company: item.c['0'].v,
        position: item.c['1'].v,
        duration: item.c['2'].v,
        // Optional, trailing columns — leave blank in the sheet to skip.
        highlights: [item.c['3']?.v, item.c['4']?.v].filter(Boolean),
      });
    });
    return experience;
  } catch (err) {
    console.error(err);
    return defaultExperience;
  }
}
async function fetchEducation() {
  try {
    const rows = await fetchSheetRows('Education');
    const education = [];
    rows.forEach((item, index) => {
      if (index === 0) return;
      education.push({
        institute: item.c['0'].v,
        degree: item.c['1'].v,
        duration: item.c['2'].v,
        highlights: [item.c['3']?.v, item.c['4']?.v].filter(Boolean),
      });
    });
    return education;
  } catch (err) {
    console.error(err);
    return defaultEducation;
  }
}
async function fetchSkills() {
  try {
    const rows = await fetchSheetRows('Skills');
    const skillSet = [];
    rows.forEach((item) => {
      const name = item.c['0']?.v;
      if (!name) return;
      skillSet.push({
        name,
        // 1 = major/core skill, anything else = secondary sub-node.
        tier: item.c['1']?.v === 1 ? 1 : 2,
        years: typeof item.c['2']?.v === 'number' ? item.c['2'].v : null,
      });
    });
    return skillSet;
  } catch (err) {
    console.error(err);
    return defaultSkillSet;
  }
}
async function fetchProjects() {
  try {
    const rows = await fetchSheetRows('Projects');
    const projects = [];

    const rowTitles = [
      { title: 'name' },
      { title: 'associatedWith', default: '' },
      { title: 'description' },
      { title: 'responsibilities' },
      { title: 'projectLink' },
      { title: 'githubLink' },
      { title: 'techStack', getValue: (item, i) => item.c[i]?.v.split(',') },
      { title: 'duration' },
      { title: 'icon', default: '' },
      {
        title: 'iconSize',
        getValue: (item, i) => (item.c[i]?.v ? `${item.c[i]?.v}px` : ''),
      },
      {
        title: 'pictures',
        getValue: (item, i) => {
          return [
            item.c[i]?.v,
            item.c[i + 1]?.v,
            item.c[i + 2]?.v,
            item.c[i + 3]?.v,
          ].filter((i) => i !== '-');
        },
      },
      // Optional, trailing columns (appended after the 4 "pictures" columns
      // above, so their sheet-column index is hardcoded rather than
      // positional) — leave blank in the sheet to skip. Never fabricate a
      // value here; outcomeMetric especially must only ever hold a real,
      // verifiable number.
      { title: 'impact', getValue: (item) => item.c[14]?.v ?? '' },
      { title: 'outcomeMetric', getValue: (item) => item.c[15]?.v ?? '' },
    ];

    rows.forEach((item, index) => {
      const project = rowTitles.reduce((acc, row, i) => {
        acc[row.title] = row.getValue
          ? row.getValue(item, i)
          : item.c[i]?.v ?? row.default ?? '-';
        return acc;
      }, {});

      projects.push(project);
    });
    return projects;
  } catch (err) {
    console.error(err);
    return defaultProjects;
  }
}
function containsEmail(value) {
  return typeof value === 'string' && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
}

async function fetchTestimonials() {
  try {
    const rows = await fetchSheetRows('Testimonials');
    const testimonials = [];
    rows.forEach((item, index) => {
      if (index === 0) return;
      testimonials.push({
        author: item.c['0']?.v,
        role: item.c['1']?.v,
        quote: item.c['2']?.v,
        relatedProject: item.c['3']?.v ?? '',
        avatar: item.c['4']?.v ?? '',
      });
    });

    // The gviz endpoint doesn't error while the "Testimonials" tab hasn't
    // been created yet — it silently falls back to another sheet in the
    // same workbook (confirmed: the feedback-form submissions sheet,
    // which contains real visitor emails). Never render that as if it
    // were testimonial content.
    const looksLikeWrongSheet = testimonials.some((t) =>
      Object.values(t).some(containsEmail)
    );
    if (looksLikeWrongSheet) return defaultTestimonials;

    return testimonials;
  } catch (err) {
    console.error(err);
    return defaultTestimonials;
  }
}
async function fetchDetails() {
  try {
    const rows = await fetchSheetRows('Portfolio_Details');
    const details = {};
    rows.forEach((item) => {
      details.resumeLink = item.c[1]?.v;
    });
    return details;
  } catch (err) {
    console.error(err);
    return {};
  }
}

module.exports = {
  fetchExperience,
  fetchEducation,
  fetchSkills,
  fetchProjects,
  fetchTestimonials,
  fetchDetails,
};
