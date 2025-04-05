const sheetId = "1jHAejeVq3DRVA_qyYr3SrlYe0BFABncNpvneqo6vCYM";
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;

const defaultEducation = [
  {
    degree: "Bachelor of Sciences in Computer Science (BSCS)",
    institute: "Univeristy of Engineering and Technology, Lahore",
    duration: "2021 - 2025",
  },
  {
    degree: "Intermediate in Computer Science (ICS)",
    institute: "Punjab Group of Colleges, Lahore",
    duration: "2019 - 2021",
  },
];
const defaultExperience = [
  {
    position: "Software Engineer Intern",
    company: "House Of Tech",
    duration: "2022 - current",
  },
];
const defaultSkillSet = [
  {
    name: "JavaScript (Vue)",
    skillPower: 80,
  },
  {
    name: "Node.js",
    skillPower: 50,
  },
  {
    name: "Sequelize.js",
    skillPower: 65,
  },
  {
    name: "C++ / C#",
    skillPower: 90,
  },
  {
    name: "HTML",
    skillPower: 90,
  },
  {
    name: "CSS",
    skillPower: 60,
  },
  {
    name: "Git / Github",
    skillPower: 90,
  },
];
const defaultProjects = [
  {
    icon: "95star.png",
    iconSize: "30px",
    name: "The 95 Stars - Pick & Drop Service",
    atCompany: "Contributor",
    description:
      "The 95 Star is a web application for pick and drop services. Customers can make reservations, while the admin has the ability to manage reservations, discount codes, cars, surges, static pages, and configure home page messages.",
    responsibilites:
      "I made contributions to the project by working on change requests for clients.  In addition to addressing client requirements, I focused on ensuring application security by creating robust APIs and implementing appropriate security measures.",
    duration: "September 2022 - Febuary 2023",
    image: "the95Star.png",
    projectLink: "https://www.the95star.com",
    pictures: ["the95Star.png", "95Star1.png", "95Star2.png", "95Star3.png"],
    active: false,
  },
  {
    name: "Bookee - Web based Book Management Application",
    atCompany: "Creator",
    description:
      "The app features a user community where users can follow each other and stay updated on reading activities. Users can maintain a status for each book, indicating whether they have read it, are currently reading it, or are interested in reading it.",
    responsibilites:
      "Through my expertise in web technologies, I successfully integrated frontend functionality with backend APIs, ensuring seamless communication and a smooth user experience. ",
    duration: "September 2022 - December 2022",
    image: "Bookee-Home.png",
    githubLink: "https://github.com/mJawadHaider/DSA-project-Bookee",
    pictures: ["Bookee-Home.png", "Bookee2.png"],
    active: false,
  },
  {
    icon: "budgetManager.png",
    iconSize: "22px",
    name: "Budget Manager",
    atCompany: "Contributor",
    description:
      "Budget Manager is a web app for construction companies, streamlining budget management, project funding, and e-invoice generation for customers.",
    responsibilites:
      "As a frontend developer, I was responsible for developing the complete frontend of the application using Vuetify and Vue.js. I utilized the power of these frameworks to create a visually appealing and user-friendly interface for seamless user interactions.",
    duration: "April 2022 - September 2022",
    image: "BM.png",
    githubLink: "https://github.com/isajjadali/budget-manager-v3",
    pictures: ["BM.png", "BM1.png", "BM2.png"],
    active: false,
  },
];

async function fetchExperience() {
  const sheetName = "Experience";
  const query = encodeURIComponent("Select *");
  const url = `${base}sheet=${sheetName}&tq=${query}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const res = JSON.parse(text.substr(47).slice(0, -2));
    const experience = [];
    res.table.rows.forEach((item, index) => {
      if (index === 0) return;
      experience.push({
        company: item.c["0"].v,
        position: item.c["1"].v,
        duration: item.c["2"].v,
      });
    });
    return experience;
  } catch (err) {
    console.error(err);
    return defaultExperience;
  }
}
async function fetchEducation() {
  const sheetName = "Education";
  const query = encodeURIComponent("Select *");
  const url = `${base}sheet=${sheetName}&tq=${query}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const res = JSON.parse(text.substr(47).slice(0, -2));
    const education = [];
    res.table.rows.forEach((item, index) => {
      if (index === 0) return;
      education.push({
        institute: item.c["0"].v,
        degree: item.c["1"].v,
        duration: item.c["2"].v,
      });
    });
    return education;
  } catch (err) {
    console.error(err);
    return defaultEducation;
  }
}
async function fetchSkills() {
  const sheetName = "Skills";
  const query = encodeURIComponent("Select *");
  const url = `${base}sheet=${sheetName}&tq=${query}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const res = JSON.parse(text.substr(47).slice(0, -2));
    const skillSet = [];
    res.table.rows.forEach((item) => {
      skillSet.push({
        name: item.c["0"].v,
        skillPower: item.c["1"].v,
      });
    });
    return skillSet;
  } catch (err) {
    console.error(err);
    return defaultSkillSet;
  }
}
async function fetchProjects() {
  const sheetName = "Projects";
  const query = encodeURIComponent("Select *");
  const url = `${base}sheet=${sheetName}&tq=${query}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const res = JSON.parse(text.substr(47).slice(0, -2));
    const projects = [];

    const rowTitles = [
      { title: "name" },
      { title: "associatedWith", default: "" },
      { title: "description" },
      { title: "responsibilities" },
      { title: "projectLink" },
      { title: "githubLink" },
      { title: "techStack", getValue: (item, i) => item.c[i]?.v.split(",") },
      { title: "duration" },
      { title: "icon", default: "" },
      {
        title: "iconSize",
        getValue: (item, i) => (item.c[i]?.v ? `${item.c[i]?.v}px` : ""),
      },
      {
        title: "pictures",
        getValue: (item, i) => {
          return [
            item.c[i]?.v,
            item.c[i + 1]?.v,
            item.c[i + 2]?.v,
            item.c[i + 3]?.v,
          ].filter((i) => i);
        },
      },
    ];

    res.table.rows.forEach((item, index) => {
      const project = rowTitles.reduce((acc, row, i) => {
        acc[row.title] = row.getValue
          ? row.getValue(item, i)
          : item.c[i]?.v ?? row.default ?? "-";
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
async function fetchDetails() {
  const sheetName = "Portfolio_Details";
  const query = encodeURIComponent("Select *");
  const url = `${base}sheet=${sheetName}&tq=${query}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const res = JSON.parse(text.substr(47).slice(0, -2));
    const details = {};
    res.table.rows.forEach((item) => {
      details.resumeLink = item.c[1]?.v;
    });
    return details;
  } catch (err) {
    console.error(err);
    return defaultProjects;
  }
}

module.exports = {
  fetchExperience,
  fetchEducation,
  fetchSkills,
  fetchProjects,
  fetchDetails,
};
