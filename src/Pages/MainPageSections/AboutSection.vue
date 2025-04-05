<template>
  <div ref="animatedElement" class="fading mt-3">
    <v-row
      class="about-row"
      :class="$vuetify.display.smAndDown ? 'px-7' : 'px-12'"
      justify="center"
    >
      <section-header
        title="About Me"
        icon="mdi-account-box-outline"
        :titleColor="secondary"
        :iconColor="white"
        :lineStyling="{ width: '300px', background: white }"
        :titleStyling="
          $vuetify.display.smAndDown
            ? 'mt-16 pb-0 text-uppercase'
            : 'mt-10 pb-0 text-uppercase'
        "
        :separator-props="{
          class: 'mb-4',
        }"
      />
      <!-- Education & Experience -->
      <v-col
        cols="12"
        md="5"
        sm="12"
        class="d-flex flex-column pa-0"
        :class="{ 'mt-4': $vuetify.display.xs }"
        style="gap: 0.7rem"
      >
        <div class="experience-wrapper my-card" variant="tonal">
          <h1
            :style="{ color: '#ebc29e', fontSize: '34px' }"

          >
            Experience
          </h1>
          <div
            v-if="experience.length > 0"
            v-for="(item, index) in experience"
            :key="index"
            class="mb-6"
          >
            <p
              class="education-item mt-4"
              style="font-size: 20px; font-weight: bold"
            >
              {{ item.position }}
            </p>
            <p class="education-item">
              {{ item.company }}
            </p>
            <p class="education-item text-grey-darken-1">
              <v-icon color="grey-darken-1" size="22" class="mr-1"
                >mdi-calendar-blank</v-icon
              >
              {{ item.duration }}
            </p>
            <div
              v-if="index + 1 !== experience.length"
              class="my-4 separator"
            ></div>
          </div>
          <v-skeleton-loader
            v-else
            color="#ffffff00"
            boilerplate
            type="article"
          />
        </div>
        <div class="education-wrapper my-card pb-6" variant="tonal">
          <h1
            :style="{ color: '#ebc29e', fontSize: '34px' }"

          >
            Education
          </h1>
          <div
            v-if="education.length > 0"
            v-for="(item, index) in education"
            :key="index"
          >
            <p
              class="education-item mt-4"
              style="font-size: 20px; font-weight: bold"
            >
              {{ item.degree }}
            </p>
            <p class="education-item">
              <v-icon size="24" class="mr-1"> mdi-school </v-icon>
              {{ item.institute }}
            </p>
            <p class="education-item text-grey-darken-1">
              <v-icon color="grey-darken-1" size="22" class="mr-1"
                >mdi-calendar-blank</v-icon
              >
              {{ item.duration }}
            </p>
            <div
              v-if="index + 1 !== education.length"
              class="my-6 separator"
            ></div>
          </div>
          <v-skeleton-loader
            v-else
            color="#ffffff00"
            boilerplate
            type="article"
          />
        </div>
      </v-col>
      <!-- Skills -->
      <v-col cols="12" md="5" sm="12" class="skills-wrapper my-card">
        <h1
          :style="{ color: '#ebc29e', fontSize: '34px' }"

        >
          Skills
        </h1>
        <v-row
          v-if="skillSet.length > 0"
          v-for="(item, index) in skillSet"
          :key="index"
          class="d-flex align-center justify-center"
        >
          <v-col cols="12" md="3" sm="12" class="py-0 pr-0">
            <p
              class="education-item mt-4"
              style="font-size: medium; font-weight: bold"
            >
              {{ item.name }}
            </p>
          </v-col>
          <v-col cols="10" md="9" sm="10" class="pa-0">
            <v-progress-linear
              v-model="item.skillPower"
              color="#ebc29e"
              class="mt-4"
            />
          </v-col>
        </v-row>
        <v-skeleton-loader
          v-else
          color="#ffffff00"
          boilerplate
          type="article"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionHeader from "@/components/SectionHeader.vue";
import { gsap } from "gsap";
import {
  fetchExperience,
  fetchEducation,
  fetchSkills,
} from "@/utils/fetchData";

export default {
  data() {
    return {
      experience: [],
      education: [],
      skillSet: [],
      fetchExperience,
      fetchEducation,
      fetchSkills,
    };
  },
  components: {
    SectionHeader,
  },
  methods: {
    getPaddingBottom() {
      const breakpoints = {
        654: "715px",
        658: "703px",
        667: "663px",
        740: "600px",
        812: "529px",
        844: "483px",
        851: "476px",
        915: "384px",
        1024: "277px",
        1180: "104px",
      };

      if (this.$vuetify.display.mdAndUp) {
        return "100px";
      }
      return breakpoints[window.innerHeight];
    },
    addScrollAnimation() {
      const options = {
        rootMargin: "0px",
        threshold: this.$vuetify.display.smAndDown ? 0.1 : 0.2,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            this.addAnimationToCards();
          } else {
            entry.target.classList.remove("visible");
          }
        });
      }, options);

      observer.observe(this.$refs.animatedElement);
    },
    addAnimationToCards() {
      const cards = gsap.utils.toArray(".my-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            scale: 0,
          },
          {
            opacity: 1,
            scale: 1,
            delay: 0.3,
            duration: 0.7,
            ease: "back.out",
          }
        );
      });
    },
  },
  async mounted() {
    this.addScrollAnimation();
    this.experience = await this.fetchExperience();
    this.education = await this.fetchEducation();
    this.skillSet = await this.fetchSkills();
  },
};
</script>

<style scoped lang="scss">
.fading {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 1s, transform 0.5s;
  // background-color: #ffc597;
  padding-bottom: 60px;
  margin-inline: 50px;
  border-radius: 22px;

  @media (max-width: 600px) {
    margin-inline: 20px;
  }
}

.about-row {
  // --v-custom-text: #ebc29e;
  --v-custom-bg: var(--v-theme-on-surface);

  animation: fadeUp 0.5s ease-in-out;
  height: auto;
  z-index: 1;
  gap: 0.7rem;
}

$lightGray: #37383b;
$lightGray: #bdbdbd;

.experience-wrapper,
.education-wrapper,
.skills-wrapper {
  padding: 16px 28px;
  border-radius: 12px;
  background-color: #ebc29e;
  background-color: rgba(var(--v-custom-bg), 0.2);
}

.skills-wrapper {
  padding-bottom: 40px;
}

.education-item {
  font-family: "Roboto Condensed", sans-serif;
  color: $lightGray;
}

.separator {
  background-color: #616161;
  background-color: #ebc29e;
  height: 2px;
  border-radius: 50%;
  width: 350px;
}

.visible {
  opacity: 1;
  transform: translateY(0);
}

.download-btn {
  border-radius: 30px;
  height: 50px;
  border-radius: 30px;
  padding-inline: 23px;
}
</style>
