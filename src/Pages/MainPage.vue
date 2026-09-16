<template>
  <div style="width: 100%">
    <information-section id="informationSectionId" />
    <about-section id="aboutSectionId" />
    <project-section id="projectSectionId" />
    <testimonials-section id="testimonialsSectionId" />
    <footer-section id="footerSectionId" />
    <custom-snackbar
      v-if="snackbarVisible"
      :snackbarVisible="snackbarVisible"
      :isSnackBarDisabled="isSnackBarDisabled"
    />
  </div>
</template>

<script>
import InformationSection from './MainPageSections/InformationSection.vue';
import AboutSection from './MainPageSections/AboutSection.vue';
import ProjectSection from './MainPageSections/ProjectSection.vue';
import TestimonialsSection from './MainPageSections/TestimonialsSection.vue';
import FooterSection from '@/Pages/MainPageSections/FooterSection.vue';
import CustomSnackbar from '@/components/CustomSnackbar.vue';

export default {
  components: {
    InformationSection,
    AboutSection,
    ProjectSection,
    TestimonialsSection,
    FooterSection,
    CustomSnackbar,
  },
  data: () => {
    return {
      snackbarVisible: false,
    };
  },
  props: {
    isSnackBarDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    checkVisibility(elementId) {
      const element = document.getElementById(elementId);
      const top = element.getBoundingClientRect().top;
      const bottom = element.getBoundingClientRect().bottom;

      if (bottom < 0 || top > window.innerHeight) {
        return false;
      } else if (top >= 0 && bottom <= window.innerHeight) {
        // Component is fully visible
        return true;
      } else if (top < window.innerHeight && bottom > 300) {
        // Component is partially visible
        return true;
      }
    },
    toggleSnackBar(e) {
      const scrollY = window.scrollY;
      this.snackbarVisible = scrollY > 190;

      // index is according to the order of components 
      // & order is changed bcz footer is small and must be checked before its above section
      let refs = [
        { ref: 'informationSectionId', index: 0 },
        { ref: 'aboutSectionId', index: 1 },
        { ref: 'footerSectionId', index: 3 },
        { ref: 'projectSectionId', index: 2 },
      ];

      for (let index = 0; index < refs.length; index++) {
        const element = refs[index];
        if (this.checkVisibility(element.ref)) {
          this.$emit('toggleTabIndex', element);
          break;
        }
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.toggleSnackBar);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.toggleSnackBar);
  },
};
</script>
