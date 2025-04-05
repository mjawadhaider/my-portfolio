<template>
  <v-app :style="appStyle">
    <div
      v-if="!$vuetify.display.smAndDown"
      cursor-outline
      class="cursor-outline"
    ></div>
    <app-bar
      id="appBarId"
      :tabs="tabs"
      :isFooterVisible="isFooterVisible"
      @toggleNavigationDrawer="toggleNavigationDrawer"
    />
    <v-main class="main-container">
      <main-page
        :isSnackBarDisabled="disbaleSnackbar"
        @toggleTabIndex="toggleTabIndex"
      />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import MainPage from '@/Pages/MainPage.vue';

export default {
  name: 'App',
  components: {
    AppBar,
    MainPage,
  },
  data: () => {
    return {
      activeTabIndex: 0,
      disbaleSnackbar: false,
      isFooterVisible: false,
    };
  },
  computed: {
    tabs() {
      const appBarButtons = [
        {
          title: 'Home',
          componentId: '',
          isActive: true,
        },
        {
          title: 'About Me',
          block: 'center',
          componentId: 'aboutSectionId',
          isActive: false,
        },
        {
          title: 'Projects',
          block: 'start',
          componentId: 'projectSectionId',
          isActive: false,
        },
        {
          title: 'Contact Me',
          componentId: 'footerSectionId',
          isActive: false,
        },
      ];
      return appBarButtons.map((tab, index) =>
        index === this.activeTabIndex
          ? { ...tab, isActive: true }
          : { ...tab, isActive: false }
      );
    },
    // 806953
    // 3b3128
    appStyle() {
      return {
        // 'background-color': this.darkGray,
        'background-color': '#222',
        height: '100vh',
        'max-height': '100vh',
        'min-height': '100vh',
      };
    },
  },
  methods: {
    toggleTabIndex(element) {
      this.isFooterVisible = element.ref === 'footerSectionId';
      this.activeTabIndex = element?.index || 0;
    },
    toggleNavigationDrawer(toggle) {
      document.documentElement.style.overflow = toggle
        ? 'hidden'
        : '';
      this.disbaleSnackbar = toggle;
    },
  },
  created() {
    document.title = 'Jawad Haider';
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap');

$gray: #999d9e;
$darkGray: #1c1d20;
$lightGray: #37383b;


$primaryBackground: #31363F;
$primary: #222831;
// $secondary: #76ABAE;
// $secondary: #adeef1;
$secondary: #d5a880;
$secondary-dark: #ec7e1e;
$mywhite: #EEEEEE;

* {
  font-family: 'Fira Sans', sans-serif;
  color: #fff;
}

.v-btn,
.v-tab,
.upper-case {
  text-transform: uppercase !important;
}

.font-18 {
  font-size: 18px;
}

.font-16 {
  font-size: 16px;
}

.v-toast {
  .v-toast__item {
    width: 300px;
  }

  .v-toast__text {
    width: 100%;
    text-align: center;
    padding: 0;
    padding-block: 10px;
    margin-inline: 0;
  }
}

.text-darkGray {
  color: $darkGray;
}

.text-gray {
  color: $gray;
}

.text-lightGray {
  color: $lightGray;
}

.text-myprimary {
  color: $primary;
}

.text-mysecondary {
  color: $secondary !important;
}

.text-mywhite {
  color: $mywhite !important;
}

.main-container {
  padding-top: 140px !important;

  @media (max-width: 900px) {
    overflow: hidden;
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  /* IE and Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;
  cursor: url('assets/cursor-dot.png'), auto;
}

body.hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

body.card {
  cursor: url('assets/card-cursor.png'), auto !important;
}

button:hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

a:hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

.cursor-outline {
  width: 40px;
  height: 40px;
  border: 2px solid hsla(0, 0%, 100%, 0.5);
  position: absolute;
  transition: width 300ms, height 300ms;

  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 2499;
  pointer-events: none;
}

.cursor-outline.large {
  width: 55px;
  height: 55px;
}

.cursor-outline.hover {
  cursor: url('assets/cursor-hover.png'), auto !important;
}

/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
