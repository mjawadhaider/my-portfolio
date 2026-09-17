<template>
  <div class="skills-network">
    <template v-if="skillSet.length === 0">
      <p class="skills-index skills-index--skeleton">
        <span
          v-for="(width, index) in skeletonWidths"
          :key="`skill-skeleton-${index}`"
          class="skeleton skeleton--text skills-index__skeleton-item"
          :style="{ width: `${width}px` }"
        ></span>
      </p>
    </template>

    <template v-else>
      <svg
        v-if="!isCompact"
        class="skills-network__svg"
        :viewBox="graph.viewBox"
        role="img"
        aria-label="Network diagram of skills, grouped by how often they're used together"
        @mouseleave="hovered = null"
      >
        <defs>
          <!-- style="stop-color: var(...)" (not the stop-color attribute)
               so this tracks $color-accent-light/$color-accent/$color-accent-dark
               live across the light/dark theme toggle — a CSS custom
               property resolves fine here, unlike an SCSS variable. -->
          <radialGradient id="skillsNetworkCoreFill" cx="35%" cy="30%" r="75%">
            <stop offset="0%" style="stop-color: var(--color-accent-light)" />
            <stop offset="55%" style="stop-color: var(--color-accent)" />
            <stop offset="100%" style="stop-color: var(--color-accent-dark)" />
          </radialGradient>
        </defs>

        <line
          v-for="edge in graph.edges"
          :key="`${edge.from}__${edge.to}`"
          :x1="edge.x1"
          :y1="edge.y1"
          :x2="edge.x2"
          :y2="edge.y2"
          class="skills-network__edge"
          :class="{
            'skills-network__edge--active': isEdgeActive(edge),
            'skills-network__edge--dim': activeSkill && !isEdgeActive(edge),
          }"
          :stroke-width="0.4 + edge.weight * 1.4"
        />

        <g
          v-for="node in graph.nodes"
          :key="node.name"
          class="skills-network__node my-cursor-hover"
          :class="{
            'skills-network__node--core': node.isCore,
            'skills-network__node--active': isNodeActive(node),
            'skills-network__node--dim': activeSkill && !isNodeActive(node),
            'skills-network__node--selected': selected === node.name,
          }"
          tabindex="0"
          role="button"
          :aria-label="`${node.name}, ${node.years} year${node.years === 1 ? '' : 's'} of experience`"
          @mouseenter="hovered = node.name"
          @mouseleave="hovered = null"
          @focus="hovered = node.name"
          @blur="hovered = null"
          @click="selectNode(node)"
          @keydown.enter.prevent="selectNode(node)"
          @keydown.space.prevent="selectNode(node)"
        >
          <circle :cx="node.x" :cy="node.y" :r="node.radius" class="skills-network__dot" />
          <text :x="node.x" :y="node.y + node.radius + 8" text-anchor="middle" class="skills-network__label">
            {{ node.name }}
          </text>
        </g>
      </svg>

      <div v-else class="skills-network__mobile">
        <div class="skills-network__mobile-group">
          <span class="skills-network__mobile-label">Core</span>
          <div class="skills-network__mobile-row">
            <button
              v-for="node in coreNodes"
              :key="node.name"
              type="button"
              class="skills-chip skills-chip--core my-cursor-hover"
              :class="{ 'skills-chip--selected': selected === node.name }"
              @click="selectNode(node)"
            >
              {{ node.name }}
            </button>
          </div>
        </div>

        <div v-if="secondaryNodes.length" class="skills-network__mobile-group">
          <span class="skills-network__mobile-label">Others</span>
          <div class="skills-network__mobile-row">
            <button
              v-for="node in secondaryNodes"
              :key="node.name"
              type="button"
              class="skills-chip my-cursor-hover"
              :class="{ 'skills-chip--selected': selected === node.name }"
              @click="selectNode(node)"
            >
              {{ node.name }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedNode" class="skills-network__card">
        <button type="button" class="skills-network__card-close my-cursor-hover" aria-label="Close" @click="clearSelection">
          &times;
        </button>
        <h4 class="skills-network__card-name">{{ selectedNode.name }}</h4>
        <dl class="skills-network__card-meta">
          <div class="skills-network__card-meta-row">
            <dt>Experience</dt>
            <dd>{{ selectedNode.years }} year{{ selectedNode.years === 1 ? '' : 's' }}</dd>
          </div>
          <div class="skills-network__card-meta-row">
            <dt>Projects</dt>
            <dd>{{ selectedNode.projects.length || '—' }}</dd>
          </div>
        </dl>
        <p class="skills-network__card-projects">{{ linkedProjectsLabel(selectedNode) }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import { fetchSkills, fetchProjects } from '@/utils/fetchData';
import { buildSkillGraph } from '@/utils/skillGraph';

export default {
  data() {
    return {
      skillSet: [],
      projects: [],
      hovered: null,
      selected: null,
      skeletonWidths: [72, 96, 64, 110, 80, 58, 92, 70],
    };
  },
  computed: {
    isCompact() {
      return this.$vuetify.display.xs;
    },
    graph() {
      return buildSkillGraph(this.skillSet, this.projects);
    },
    coreNodes() {
      return this.graph.nodes.filter((n) => n.isCore);
    },
    secondaryNodes() {
      return this.graph.nodes.filter((n) => !n.isCore);
    },
    activeSkill() {
      return this.hovered || this.selected;
    },
    selectedNode() {
      return this.graph.nodes.find((n) => n.name === this.selected) || null;
    },
  },
  methods: {
    isConnected(a, b) {
      return this.graph.edges.some((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));
    },
    isNodeActive(node) {
      if (!this.activeSkill) return false;
      return node.name === this.activeSkill || this.isConnected(this.activeSkill, node.name);
    },
    isEdgeActive(edge) {
      if (!this.activeSkill) return false;
      return edge.from === this.activeSkill || edge.to === this.activeSkill;
    },
    selectNode(node) {
      this.selected = this.selected === node.name ? null : node.name;
    },
    clearSelection() {
      this.selected = null;
    },
    linkedProjectsLabel(node) {
      if (!node.projects.length) return 'Practiced across personal exercises and smaller builds.';
      const shown = node.projects.slice(0, 2).join(' · ');
      const extra = node.projects.length - 2;
      return extra > 0 ? `${shown} +${extra} more` : shown;
    },
  },
  async mounted() {
    const [skillSet, projects] = await Promise.all([fetchSkills(), fetchProjects()]);
    this.skillSet = skillSet;
    this.projects = projects;
  },
};
</script>

<style scoped lang="scss">
.skills-network {
  position: relative;
}

// Duplicated from AboutSection's own (scoped) skills-index styling — Vue's
// `scoped` CSS doesn't cross component boundaries, and this is the only
// piece of it this component still needs (the loading skeleton).
.skills-index {
  margin: 0;
  font-family: $font-display;
  font-size: clamp(1.375rem, 1.2vw + 1rem, 1.875rem);
  font-weight: $fw-medium;
  line-height: 1.5;
  color: $color-white;
  max-width: 52ch;
  display: flex;
  flex-wrap: wrap;
}

.skills-index--skeleton {
  gap: $space-3 $space-4;
}

.skills-index__skeleton-item {
  height: 1.5rem;
}

.skills-network__svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.skills-network__edge {
  stroke: rgba(var(--color-white-rgb), 0.16);
  transition: stroke $dur-fast $ease-out, opacity $dur-fast $ease-out;
}

.skills-network__edge--active {
  stroke: rgba(var(--color-accent-rgb), 0.65);
}

.skills-network__edge--dim {
  opacity: 0.3;
}

.skills-network__node {
  cursor: inherit;
  outline: none;
  transition: opacity $dur-fast $ease-out;
}

.skills-network__node--dim {
  opacity: 0.35;
}

.skills-network__dot {
  fill: $color-bg-elevated;
  stroke: rgba(var(--color-white-rgb), 0.25);
  stroke-width: 0.6;
  transform-box: fill-box;
  transform-origin: center;
  transition: transform $dur-fast $ease-out, stroke $dur-fast $ease-out, filter $dur-fast $ease-out;
}

.skills-network__node--core .skills-network__dot {
  // CSS `fill` (even from a class selector) beats an SVG presentation
  // attribute, so the core gradient has to be set here rather than via
  // a `:fill="url(...)"` binding on the <circle> — that binding was
  // silently losing to the `.skills-network__dot` rule above.
  fill: url(#skillsNetworkCoreFill);
  stroke: none;
}

.skills-network__node--active .skills-network__dot,
.skills-network__node--selected .skills-network__dot {
  stroke: $color-accent;
  stroke-width: 0.8;
  transform: scale(1.14);
  filter: drop-shadow(0 0 6px rgba(var(--color-accent-rgb), 0.45));
}

.skills-network__node:focus-visible .skills-network__dot {
  stroke: $color-accent;
  stroke-width: 1;
}

.skills-network__label {
  font-family: $font-mono;
  font-size: 5.5px;
  letter-spacing: 0.02em;
  fill: $color-gray;
  // Secondary labels stay hidden at rest — with a dozen-odd skills there
  // isn't room to letter every satellite without them colliding, so a
  // label only reveals for the node being explored (or the core skills,
  // which have enough room to always show theirs).
  opacity: 0;
  transition: fill $dur-fast $ease-out, opacity $dur-fast $ease-out;
}

.skills-network__node--core .skills-network__label {
  font-size: 6.5px;
  fill: $color-text-muted;
  opacity: 1;
}

.skills-network__node--active .skills-network__label,
.skills-network__node--selected .skills-network__label {
  fill: $color-white;
  opacity: 1;
}

// ---- Mobile fallback: static grouped chips instead of the SVG graph ----
.skills-network__mobile-group {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  & + & {
    margin-top: $space-5;
  }
}

.skills-network__mobile-label {
  font-family: $font-mono;
  font-size: $fs-micro;
  letter-spacing: $ls-wide;
  text-transform: uppercase;
  color: $color-gray;
}

.skills-network__mobile-row {
  display: flex;
  flex-wrap: wrap;
  gap: $space-3;
}

// These are <button type="button"> elements, and all three color values
// below need !important to beat Vuetify's own `[type=button] { color:
// inherit }` reset, which ties on specificity with a plain class selector
// — see FeedbackForm.vue's .hero__cta comment for the full explanation.
.skills-chip {
  background: none;
  border: $border-hairline-faint;
  border-radius: $radius-pill;
  padding: $space-2 $space-4;
  font-family: $font-mono;
  font-size: $fs-caption;
  color: $color-text-muted !important;
  cursor: inherit;
  transition: border-color $dur-fast $ease-out, color $dur-fast $ease-out;
}

.skills-chip--core {
  color: $color-white !important;
  font-weight: $fw-medium;
  border-color: rgba(var(--color-accent-rgb), 0.4);
}

.skills-chip--selected {
  color: $color-accent !important;
  border-color: $color-accent;
}

// ---- Detail card shown on node/chip selection ----
.skills-network__card {
  position: relative;
  margin-top: $space-6;
  padding: $space-5;
  max-width: 420px;
  background: $gradient-accent-soft, $color-bg-elevated;
  border: $border-hairline;
  border-radius: $radius-md;
}

.skills-network__card-close {
  position: absolute;
  top: $space-3;
  right: $space-3;
  background: none;
  border: none;
  font-size: 1.375rem;
  line-height: 1;
  // !important: needed to beat Vuetify's `[type=button] { color: inherit }`
  // reset on this equal-specificity single-class selector — see
  // FeedbackForm.vue's .hero__cta comment for the full explanation.
  color: $color-gray !important;
  cursor: inherit;
  transition: color $dur-fast $ease-out, transform $dur-fast $ease-out;

  &:hover {
    color: $color-white !important;
    transform: rotate(90deg);
  }
}

.skills-network__card-name {
  margin: 0 $space-8 $space-3 0;
  font-family: $font-display;
  font-size: $fs-h3;
  font-weight: $fw-medium;
  color: $color-white;
}

.skills-network__card-meta {
  display: flex;
  gap: $space-6;
  margin: 0 0 $space-3;
  padding-bottom: $space-3;
  border-bottom: $border-hairline-faint;
}

.skills-network__card-meta-row {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  dt {
    font-family: $font-mono;
    font-size: $fs-micro;
    letter-spacing: $ls-wide;
    text-transform: uppercase;
    color: $color-gray;
  }

  dd {
    margin: 0;
    color: $color-white;
    font-weight: $fw-medium;
  }
}

.skills-network__card-projects {
  margin: 0;
  color: $color-text-muted;
  font-size: $fs-body-sm;
  line-height: $lh-loose;
}
</style>
