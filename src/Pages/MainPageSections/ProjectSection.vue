<template>
  <div
    ref="projectAnimation"
    class="fading-div"
  >
    <v-row
      justify="center"
      class="main-wrapper"
    >
      <section-header
        title="Projects"
        icon="mdi-briefcase"
        :titleColor="secondary"
        :iconColor="white"
        :lineStyling="{ width: '300px', color: white }"
        titleStyling="mt-12 text-uppercase"
      />

      <v-col
        cols="12"
        class="d-flex justify-center"
        :class="{
          'my-6': $vuetify.display.xs,
          'my-16': $vuetify.display.smAndUp,
        }"
      >
        <v-row
          class="projects-wrapper"
          justify="center"
        >
          <v-col
            v-for="n in 4"
            :key="n"
            cols="12"
            md="3"
            v-if="isLoading"
          >
            <v-skeleton-loader
              type="image"
              loading-text="Loading Projects"
              theme="dark"
              class="skeleton-loader"
            />
          </v-col>
          <v-col
            v-for="(project, index) in projects"
            :key="index"
            cols="12"
            md="3"
            class="project-item my-cursor-hover pa-0"
            @click="toggleProjectDetailsDialog(project)"
          >
            <project-item
              :project="project"
              :index="index"
              @closeDialog="toggleProjectDetailsDialog"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionHeader from "@/components/SectionHeader.vue";
import ProjectItem from "@/components/ProjectItem.vue";
import { gsap } from "gsap";
import { fetchProjects } from "@/utils/fetchData";

export default {
  components: {
    ProjectItem,
    SectionHeader,
  },
  data() {
    return {
      isLoading: false,
      projects: [],
      fetchProjects,
    };
  },
  computed: {},
  methods: {
    toggleProjectDetailsDialog(project) {
      project.active = !project.active;
      if (project.active) {
        document.body.classList.add("card");
      } else {
        document.body.classList.remove("card");
        document.body.classList.remove("hover");
      }
    },
    addAnimationToProjectCards() {
      const cards = gsap.utils.toArray(".project-item");
      let currentRow = 0;
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: currentRow % 2 ? 500 : -500,
          },
          {
            opacity: 1,
            // delay: Math.floor((index) / 3),
            delay: currentRow * 0.5,
            x: 0,
            duration: 0.7,
            ease: "power1.out",
          }
        );
        if (index % 3 === 2) currentRow++;
      });
    },
  },
  async mounted() {
    this.isLoading = true;
    const options = {
      rootMargin: "0px",
      threshold: this.$vuetify.display.xs ? 0.2 : 0.3,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible-div");
        } else {
          entry.target.classList.remove("visible-div");
        }
      });
    }, options);

    observer.observe(this.$refs.projectAnimation);
    this.addAnimationToProjectCards();
    this.projects = await this.fetchProjects();
    this.isLoading = false;
  },
};
</script>

<style lang="scss">
.main-wrapper {
  height: auto;
  animation: fadeUp 0.5s ease-in-out;
  padding-bottom: 50px;
}

.fading-div {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 1s, transform 0.5s;

  @media (max-width: 600px) {
    margin-inline: 20px;
    padding-inline: 28px;
  }

  @media (max-width: 900px) {
    padding-inline: 14px;
    margin-inline: 60px;
  }
}

.visible-div {
  opacity: 1;
  transform: translateY(0);
}

.projects-wrapper {
  gap: 0.9rem;
}

.project-item {
  font-family: "Roboto Condensed", sans-serif;
  background-color: #ffffff40;
  border-radius: 8px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 15px #353535;

  position: relative;
  overflow: hidden;
}

.project-item:hover .main-content {
  transform: scale(1.2);
}

.project-item:hover .overlay-content {
  height: 100%;
}

.skeleton-loader {
  .v-skeleton-loader__bone {
    border-radius: 8px;
  }
}
</style>
