// Builds the node/edge model for the Skills network visualization
// (AboutSection's Toolkit block, rendered by SkillsNetwork.vue).
//
// The Skills sheet is the source of truth for what each skill IS:
//   - tier 1 = major/core skill (always shown large, always shown even
//     with zero linked projects)
//   - tier 2 (or anything else) = secondary sub-node (always shown small,
//     whether or not it turns out to be connected to anything)
//   - years = years of experience, entered directly, never estimated
// Node size is therefore a fixed binary choice, not a computed scale.
// Everything relational is still derived from real data:
//   - project count / linked projects: which real Projects reference a
//     matching techStack key
//   - connection strength: how often two skills' techStack keys co-occur
//     within the same project
// A secondary skill with no real co-occurrence against any core skill is
// rendered with no edge at all — an honest "not linked to anything yet"
// rather than a fabricated tie. Layout is a one-shot deterministic radial
// placement (plain trig), not a live force simulation, so it's cheap to
// compute and stable across re-renders.

// Skill display name (normalized) -> techStack key used in the Projects
// sheet (see src/utils/techIcons.js for the same keys). Keep in sync if
// either sheet's vocabulary changes.
const TECH_ALIASES = {
  vuejs: 'vue',
  vue: 'vue',
  nodejs: 'node',
  node: 'node',
  javascript: 'js',
  js: 'js',
  reactjs: 'react',
  react: 'react',
  expressjs: 'express',
  express: 'express',
  mongodb: 'mongodb',
  net: 'dotnet',
  dotnet: 'dotnet',
  fluentui: 'fluent',
  blazor: 'blazor',
  nuget: 'nuget',
  mysql: 'mysql',
  git: 'git',
  aspnet: 'aspdotnet',
  aspdotnet: 'aspdotnet',
};

function normalize(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function techKeyFor(skillName) {
  return TECH_ALIASES[normalize(skillName)] || skillName;
}

const CENTER_X = 120;
const CENTER_Y = 96;
const CORE_RING_RADIUS = 30;
const OUTER_RING_RADIUS = 62;
const UNLINKED_RING_RADIUS = 80;
const CORE_NODE_RADIUS = 13;
const SECONDARY_NODE_RADIUS = 6.5;

function buildSkillGraph(skillSet, projects) {
  const skills = (skillSet || []).filter((s) => s?.name);
  const viewBox = `0 0 ${CENTER_X * 2} ${CENTER_Y * 2}`;
  if (!skills.length) return { nodes: [], edges: [], viewBox };

  const projectList = projects || [];

  // Which real projects reference each skill (via matched techStack key).
  const projectsForSkill = {};
  skills.forEach((s) => {
    const key = techKeyFor(s.name);
    projectsForSkill[s.name] = key
      ? projectList.filter((p) => p.techStack?.includes(key)).map((p) => p.name)
      : [];
  });

  // How often two skills' techStack keys co-occur in the same project.
  const pairCounts = {};
  const addPair = (a, b) => {
    if (a === b) return;
    const key = [a, b].sort().join('__');
    pairCounts[key] = (pairCounts[key] || 0) + 1;
  };

  projectList.forEach((project) => {
    const stack = project.techStack || [];
    const present = skills.filter((s) => {
      const key = techKeyFor(s.name);
      return key && stack.includes(key);
    });
    for (let i = 0; i < present.length; i++) {
      for (let j = i + 1; j < present.length; j++) {
        addPair(present[i].name, present[j].name);
      }
    }
  });

  // tier 1 = major/core. If the sheet hasn't marked anything as tier 1 yet
  // (e.g. it still has old rating numbers), fall back to the first few
  // skills as core rather than either an empty center or — worse —
  // treating every skill as core and overcrowding the center ring.
  const markedCore = skills.filter((s) => s.tier === 1);
  const core = markedCore.length ? markedCore : skills.slice(0, Math.min(4, skills.length));
  const secondary = markedCore.length ? skills.filter((s) => s.tier !== 1) : skills.slice(core.length);

  const maxPair = Math.max(1, ...Object.values(pairCounts));

  const toNode = (s, isCore, x, y) => ({
    name: s.name,
    years: typeof s.years === 'number' ? s.years : 1,
    isCore,
    x,
    y,
    radius: isCore ? CORE_NODE_RADIUS : SECONDARY_NODE_RADIUS,
    projects: projectsForSkill[s.name] || [],
  });

  const nodes = [];

  core.forEach((s, i) => {
    const angle = (i / core.length) * Math.PI * 2 - Math.PI / 2;
    nodes.push(toNode(s, true, CENTER_X + Math.cos(angle) * CORE_RING_RADIUS, CENTER_Y + Math.sin(angle) * CORE_RING_RADIUS));
  });

  // Group secondary skills by whichever core skill they have the most real
  // co-occurrence with — this is what makes them "orbit" the core they're
  // actually used alongside. A skill with zero real signal against every
  // core is left unlinked rather than forced into a group it has no
  // evidence of belonging to.
  const groups = new Map(core.map((c) => [c.name, []]));
  const unlinked = [];
  secondary.forEach((s) => {
    let bestCore = null;
    let bestScore = 0;
    core.forEach((c) => {
      const score = pairCounts[[s.name, c.name].sort().join('__')] || 0;
      if (score > bestScore) {
        bestScore = score;
        bestCore = c.name;
      }
    });
    if (bestCore) groups.get(bestCore).push(s);
    else unlinked.push(s);
  });

  core.forEach((c, gi) => {
    const groupAngle = (gi / core.length) * Math.PI * 2 - Math.PI / 2;
    const spread = (Math.PI * 2) / core.length;
    const members = groups.get(c.name) || [];
    members.forEach((s, mi) => {
      const t = members.length > 1 ? mi / (members.length - 1) - 0.5 : 0;
      const angle = groupAngle + t * spread * 0.92;
      nodes.push(toNode(s, false, CENTER_X + Math.cos(angle) * OUTER_RING_RADIUS, CENTER_Y + Math.sin(angle) * OUTER_RING_RADIUS));
    });
  });

  // Unlinked secondary skills spread evenly around their own outer band so
  // they read as "not (yet) tied to a core skill" instead of crowding a
  // group they have no real connection to.
  unlinked.forEach((s, i) => {
    const angle = (i / unlinked.length) * Math.PI * 2;
    nodes.push(toNode(s, false, CENTER_X + Math.cos(angle) * UNLINKED_RING_RADIUS, CENTER_Y + Math.sin(angle) * UNLINKED_RING_RADIUS));
  });

  const nodeByName = new Map(nodes.map((n) => [n.name, n]));
  const edges = Object.entries(pairCounts)
    .map(([key, count]) => {
      const [a, b] = key.split('__');
      const from = nodeByName.get(a);
      const to = nodeByName.get(b);
      if (!from || !to) return null;
      return { from: a, to: b, weight: count / maxPair, x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    })
    .filter(Boolean);

  return { nodes, edges, viewBox };
}

module.exports = { buildSkillGraph };
