<template>
  <div
    ref="animatedElement"
    class="fading mt-3"
    :style="$vuetify.display.mdAndUp ? 'border-radius: 50px;' : 'border-radius: 26px;'"
  >
    <v-row
      class="about-row"
      :class="$vuetify.display.smAndDown ? 'px-7' : 'px-12'"
      justify="center"
    >
      <section-header
        title="About Me"
        icon="mdi-account-box-outline"
        :iconColor="darkGray"
        :titleColor="darkGray"
        :lineStyling="{ width: '300px', color: '#353131' }"
        :titleStyling="$vuetify.display.smAndDown ? 'mt-16' : 'mt-10'"
      />
      <!-- Education & Experience -->
      <v-col
        cols="12"
        md="5"
        sm="12"
      >
        <h1
          v-if="experience?.length"
          :style="{ color: darkGray, fontSize: '34px' }"
        >
          Experience
        </h1>
        <div
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
          <p class="education-item">
            <v-icon
              size="22"
              class="mr-1"
            >mdi-calendar-blank</v-icon>
            {{ item.duration }}
          </p>
          <div
            v-if="index + 1 !== experience.length"
            class="my-4 seperator"
          ></div>
        </div>


        <h1 :style="{ color: darkGray, fontSize: '34px' }">Education</h1>
        <div
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
            <v-icon
              size="24"
              class="mr-1"
            > mdi-school </v-icon>
            {{ item.institute }}
          </p>
          <p class="education-item">
            <v-icon
              size="22"
              class="mr-1"
            >mdi-calendar-blank</v-icon>
            {{ item.duration }}
          </p>
          <div
            v-if="index + 1 !== education.length"
            class="my-6 seperator"
          ></div>
        </div>
      </v-col>
      <!-- Skills -->
      <v-col
        cols="12"
        md="5"
        sm="12"
      >
        <h1 :style="{ color: darkGray, fontSize: '34px' }">Skills</h1>
        <v-row
          v-for="(item, index) in skillSet"
          :key="index"
          class="d-flex align-center justify-center"
        >
          <v-col
            cols="12"
            md="3"
            sm="12"
            class="py-0 pr-0"
          >
            <p
              class="education-item mt-4"
              style="font-size: medium; font-weight: bold"
            >
              {{ item.name }}
            </p>
          </v-col>
          <v-col
            cols="10"
            md="9"
            sm="10"
            class="pa-0"
          >
            <v-progress-linear
              v-model="item.skillPower"
              :color="lightGray"
              class="mt-4"
            />
          </v-col>
        </v-row>
      </v-col>
      <!-- Download Resume -->
      <v-col
        cols="12"
        md="10"
        sm="12"
        :class="$vuetify.display.smAndDown ? 'mt-13' : 'py-0'"
        class="d-flex justify-end mt-5"
      >
        <v-btn
          class="text-white download-btn"
          :color="lightGray"
          rounded
          prepend-icon="mdi-open-in-new"
          variant="elevated"
          size="large"
          elevation="4"
          @click="
            routeToLink(
              'https://drive.google.com/file/d/1bYa9GKe-I1iEGI4IBgFlz0CGq30oH1EP/view?usp=sharing'
            )
            "
          @mousemove="handleMouseMove_Small"
          @mouseleave="handleMouseLeave"
        >
          DOWNLOAD RESUME
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionHeader from '@/components/SectionHeader.vue';

export default {
  data() {
    return {
      education: [
        {
          degree: 'Bachelor of Sciences in Computer Science (BSCS)',
          institute:
            'Univeristy of Engineering and Technology, Lahore',
          duration: '2021 - 2025',
        },
        {
          degree: 'Intermediate in Computer Science (ICS)',
          institute: 'Punjab Group of Colleges, Lahore',
          duration: '2019 - 2021',
        },
      ],
      experience: [
        {
          position: 'Software Engineer Intern',
          company: 'House Of Tech',
          duration: '2022 - current',
        },
      ],
      skillSet: [
        {
          name: 'JavaScript (Vue)',
          skillPower: 80,
        },
        {
          name: 'Node.js',
          skillPower: 50,
        },
        {
          name: 'Sequelize.js',
          skillPower: 65,
        },
        {
          name: 'C++ / C#',
          skillPower: 90,
        },
        {
          name: 'HTML',
          skillPower: 90,
        },
        {
          name: 'CSS',
          skillPower: 60,
        },
        {
          name: 'Git / Github',
          skillPower: 90,
        },
      ],
    };
  },
  components: {
    SectionHeader,
  },
  methods: {
    getPaddingBottom() {
      const breakpoints = {
        654: '715px',
        658: '703px',
        667: '663px',
        740: '600px',
        812: '529px',
        844: '483px',
        851: '476px',
        915: '384px',
        1024: '277px',
        1180: '104px',
      };

      if (this.$vuetify.display.mdAndUp) {
        return '100px';
      }
      return breakpoints[window.innerHeight];
    },
  },
  mounted() {
    const options = {
      rootMargin: '0px',
      threshold: this.$vuetify.display.smAndDown ? 0.1 : 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, options);

    observer.observe(this.$refs.animatedElement);
  },
};
</script>

<style scoped lang="scss">
.fading {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 1s, transform 0.5s;
  box-shadow: 1px 1px 8px;
  background-color: white;
  padding-bottom: 60px;
}

.about-row {
  animation: fadeUp 0.5s ease-in-out;
  height: auto;
  z-index: 1;
}

$lightGray: #37383b;

.education-item {
  font-family: 'Roboto Condensed', sans-serif;
  color: $lightGray;
}

.seperator {
  background-color: #353131;
  height: 3px;
  width: 200px;
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
