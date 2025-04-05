<template>
  <div>
    <v-navigation-drawer
      v-if="$vuetify.display.smAndDown"
      app
      v-model="toggle"
      absolute
      :color="darkGray"
      style="position: fixed"
      elevation="10"
      location="right"
      width="500"
    >
      <div style="color: white" class="mr-6 py-4 d-flex justify-end">
        <v-btn
          variant="tonal"
          size="x-large"
          icon
          @click.stop="toggleNavigationDrawer"
        >
          <v-icon size="x-large" color="white" icon="mdi-close" />
        </v-btn>
      </div>
      <div style="width: 100%; margin: 83px 16px 24px" class="px-3">
        <span
          style="color: gray; font-size: 13px; margin-bottom: 10px"
          class="upper-case"
        >
          Navigation
        </span>
        <div class="stripe" />
      </div>
      <v-list v-if="showNavigationList" class="px-5" nav>
        <div v-for="(tab, index) in tabs" :key="index">
          <v-list-item
            :title="tab.title"
            :active="tab.isActive"
            :base-color="gray"
            color="white"
            class="mt-1 upper-case navigation-list"
            @click="scrollToSection(tab, index)"
          >
            <template v-slot:append>
              <div class="dot" v-if="tab.isActive"></div>
            </template>
          </v-list-item>
        </div>
      </v-list>
      <div
        :style="$vuetify.display.xs ? { height: '34%' } : { height: '38%' }"
        style="align-content: space-between"
        class="d-flex flex-column justify-end mx-7 mb-12"
      >
        <div class="stripe mb-5" style="width: 100%" />
        <span class="text-gray my-5">SOCIALS</span>
        <div
          v-if="showNavigationList"
          style="animation: slideInRight 0.5s ease-in forwards"
        >
          <social-component
            :iconSize="$vuetify.display.xs ? 'default' : 'x-large'"
          />
        </div>
      </div>
    </v-navigation-drawer>
    <v-app-bar
      id="appBar"
      class="pt-2 px-6 font-18 app-bar"
      app
      scroll-behavior="hide"
      scroll-threshold="191"
      :color="'#353535' || '#ffffff17' || primaryBackground"
      :elevation="1"
      style="box-shadow: 0 2px 40px -2px #0003 !important"
    >
      <div
        class="app-bar-title magnetic-button"
        style="height: 100%"
        :style="
          $vuetify.display.smAndDown ? 'width: 50%; padding: 0' : 'width: 18%'
        "
        @mousemove="handleMouseMove(-1)"
        @mouseleave="handleMouseLeave(-1)"
        @mouseenter="handleMouseEnter"
        @click="refreshPage"
      >
        <v-icon icon="mdi-copyright" class="pt-0 mr-1" size="small" />
        <p id="appbar-title-text">
          {{ appBarTitle }}
        </p>
      </div>
      <div
        v-if="$vuetify.display.smAndDown"
        style="display: flex; justify-content: end; width: 50%"
      >
        <v-app-bar-nav-icon
          :color="gray"
          class="text-white"
          flat
          :ripple="false"
          width="85"
          height="40"
          :border="0"
          style="border-radius: 7px"
          @click.stop="toggleNavigationDrawer"
        >
          <v-icon icon="mdi-checkbox-blank-circle" size="7" class="mr-2" /> menu
        </v-app-bar-nav-icon>
      </div>

      <div
        v-if="$vuetify.display.mdAndUp"
        class="tabs-container text-mysecondary"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="px-2 magnetic-button"
          :class="{ 'button-selected': tab.isActive }"
          style="border-radius: 5px; transition: transform 0.2s"
          @mousemove="handleMouseMove(index)"
          @mouseleave="handleMouseLeave(index)"
          @click="scrollToSection(tab)"
        >
          <v-btn
            v-if="index + 1 === tabs.length"
            variant="tonal"
            rounded="lg"
            class="contactme-btn text-none"
          >
            Contact Me
          </v-btn>
          <p v-else class="button-text">
            {{ tab.title }}
          </p>
        </div>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import SocialComponent from "./SocialComponent.vue";
import { gsap } from "gsap";
import TextPlugin from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

export default {
  components: {
    SocialComponent,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    isFooterVisible: Boolean,
  },
  data: () => {
    return {
      toggle: false,
      activeIndex: -1,
      appBarTitle: "Code by Jawad",
      showNavigationList: false,
    };
  },
  watch: {
    toggle(newValue) {
      this.$emit("toggleNavigationDrawer", newValue);
    },
  },
  computed: {
    activeTab: {
      get() {
        return this.tabs.findIndex((tab) => tab.isActive);
      },
      set() {},
    },
  },
  methods: {
    toggleNavigationDrawer() {
      this.toggle = !this.toggle;
      this.showNavigationList = !this.showNavigationList;
    },
    scrollToSection(btn) {
      this.toggle = false;
      this.showNavigationList = false;
      const component = document.getElementById(btn?.componentId || "appBarId");
      const scrollPosition =
        component.getBoundingClientRect().top + window.scrollY - 35;
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    },
    handleMouseMove() {
      const x = event.clientX;
      const y = event.clientY;

      const rect = event.target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < 500) {
        event.target.style.transform = `translate(${deltaX / 10}px, ${
          deltaY / 10
        }px)`;
      } else {
        event.target.style.transform = "translate(0, 0)";
      }
    },
    handleMouseLeave() {
      const button = event.target;

      button.style.animation = "bounceBack 0.5s ease";
      setTimeout(() => {
        button.style.animation = "";
        button.style.transform = "translate(0, 0)";
      }, 500);

      gsap.to("#appbar-title-text", {
        duration: 0.5,
        text: "Code by Jawad",
        ease: "none",
        delay: 0,
      });
    },
    handleMouseEnter() {
      gsap.to("#appbar-title-text", {
        duration: 0.5,
        text: "JAWAD HAIDER",
        ease: "none",
        delay: 0,
      });
    },
    refreshPage() {
      location.reload();
    },
  },
  mounted() {
    const appbarElement = document.getElementById("appBar");
    appbarElement.style.opacity = "0";

    const appBarTitleEl = gsap.fromTo(
      ".app-bar-title",
      {
        opacity: 0,
        y: 40,
      },
      {
        y: 0,
        duration: 1.2,
        opacity: 1,
        paused: true,
        delay: 2.2,
        ease: "bounce.out",
      }
    );

    setTimeout(() => {
      appbarElement.style.animation = "bounceIn 1.8s";
      appbarElement.style.opacity = "1";
      appBarTitleEl.play();
    }, 2000);
  },
};
</script>

<style lang="scss">
.app-bar {
  height: 80px;
  width: 85% !important;
  left: 7% !important;
  // position: sticky !important;
  box-shadow: 0 2px 40px #0003 !important;
  border-radius: 20px !important;
}

.app-bar-title {
  display: flex;
  align-items: center;
  width: 50%;
  color: #1f1d1d;
  padding-left: 1.7rem;

  p {
    font-weight: bold;
  }
}

.stripe {
  width: 90%;
  height: 2px;
  display: block;
  background-color: #ffffff39;
  margin-block: 20px;
}

.navigation-list {
  animation: slideInRight 0.5s ease-in forwards;

  .v-list-item__content {
    padding-block: 10px;

    .v-list-item-title {
      font-size: 1.5rem;
      padding-block: 10px;
      height: 40px;
      text-transform: uppercase !important;
    }
  }

  .v-list-item__append {
    margin-right: 15px;
  }
}

.magnetic-button {
  transition: color 0.2s;
  height: 100%;
  display: flex;
  align-items: center;

  .button-text {
    padding: 20px 10px;
  }

  &:hover {
    color: #adeef1;
    font-weight: bold;
  }
}

.button-selected {
  font-weight: bold;

  p {
    color: #ec7e1e !important;
    font-weight: bolder;
    text-shadow: 1px 1px 6px black;
  }
}

.tabs-container {
  width: 100%;
  color: #211d1d;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  height: 100%;
}

.contactme-btn {
  background: linear-gradient(to right, #ff7900, #f3ae72) !important;
  box-shadow: 0 1px 8px black;
}

.contactme-btn:hover {
  background: linear-gradient(to left, #ec7e1e, #ec7e1e) !important;
}

.contactme-btn > .v-btn__content {
  color: black;
  font-weight: bold;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: white;
  /* Adjust the color as needed */
  border-radius: 100%;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 1;
  transition: opacity 0.2s;
}

@keyframes bounceBack {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(0);
  }

  40% {
    transform: translateX(-5px);
  }

  60% {
    transform: translateX(5px);
  }
}

@keyframes bounceIn {
  0% {
    transform: translateY(-200px);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  38% {
    transform: translateY(50px);
    animation-timing-function: ease-out;
    opacity: 1;
  }

  55% {
    transform: translateY(-30px);
    animation-timing-function: ease-in;
  }

  72% {
    transform: translateY(25px);
    animation-timing-function: ease-out;
  }

  81% {
    transform: translateY(-15px);
    animation-timing-function: ease-in;
  }

  90% {
    transform: translateY(10px);
    animation-timing-function: ease-out;
  }

  95% {
    transform: translateY(-5px);
    animation-timing-function: ease-in;
  }

  100% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(700px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
