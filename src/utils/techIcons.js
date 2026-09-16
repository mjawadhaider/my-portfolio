// Shared tech-stack icon lookup — used by ProjectItem.vue (project tech stack)
// and AboutSection.vue (skills badges) so both read from one source of truth
// instead of maintaining separate copies. Icon files live in src/assets/svg-icons/.

const TECH_ICON_FILES = {
  node: 'nodejs.svg',
  vue: 'vue.svg',
  js: 'js.svg',
  react: 'react.svg',
  express: 'expressjs.svg',
  mongodb: 'mongodb.svg',
  dotnet: 'dotnet.png',
  fluent: 'fluentui.png',
  blazor: 'blazor.png',
  nuget: 'nuget.png',
  mysql: 'mysql.svg',
  git: 'git.svg',
  aspdotnet: 'asp-dotnet.svg',
};

const TECH_ICON_NAMES = {
  node: 'NodeJS',
  vue: 'VueJS',
  js: 'JavaScript',
  react: 'ReactJS',
  express: 'ExpressJS',
  mongodb: 'MongoDB',
  dotnet: '.NET',
  fluent: 'FluentUI',
  blazor: 'Blazor',
  nuget: 'NuGet',
  mysql: 'MySQL',
  git: 'Git',
  aspdotnet: 'ASP.NET',
};

function getTechIconFile(key) {
  if (!TECH_ICON_FILES[key]) {
    console.info(`Icon name "${key}" is not registered in techIcons.js`);
  }
  return TECH_ICON_FILES[key] || 'no-image.png';
}

function getTechIconName(key) {
  return TECH_ICON_NAMES[key] || key;
}

module.exports = {
  TECH_ICON_FILES,
  TECH_ICON_NAMES,
  getTechIconFile,
  getTechIconName,
};
