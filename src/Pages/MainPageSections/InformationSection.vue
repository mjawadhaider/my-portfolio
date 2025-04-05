<template>
  <v-row :style="informationSection" justify="center">
    <v-col
      cols="12"
      md="7"
      sm="12"
      :class="$vuetify.display.smAndDown ? 'left-pane pa-0' : 'left-pane'"
      class="pt-13"
    >
      <span
        id="span-text"
        class="greetings text-mysecondary"
        :style="$vuetify.display.smAndDown ? 'margin-top: 50px' : ''"
      >
        Hey there! I'm
      </span>
      <span class="name text-mywhite"></span>
      <span class="about text-mysecondary"></span>
      <!-- <span class="email"> jhaider869@gmail.com </span> -->

      <button
        class="resume-btn d-flex justify-center align-center"
        :style="showBtnText ? { width: '170px' } : { padding: '7px' }"
        @mouseenter="() => changeShowBtnTextValue(true)"
        @mouseleave="() => changeShowBtnTextValue(false)"
        @mousemove="handleMouseMove_Small"
        @click="routeToLink(details.resumeLink)"
      >
        <img
          :src="require('@/assets/svg-icons/new-tab.svg')"
          alt="open"
          style="width: 36px; margin-top: 5px"
        />
        <span id="resume-btn-text" style="opacity: 0">
          {{ showBtnText ? "Download Resume" : "" }}
        </span>
      </button>

      <div class="social-container">
        <span class="text-mysecondary" style="font-size: 18px"
          >Find Me Online:</span
        >
        <div>
          <social-component icon-size="default" />
        </div>
      </div>
      <!-- <div
        class="text-mywhite"
        style="margin-top: 46px; font-family: 'Roboto Condensed', sans-serif;"
      >
        <p class="text-justify text-center description"></p>
      </div> -->
    </v-col>
    <v-col
      cols="12"
      md="5"
      sm="12"
      class="d-flex"
      :class="{
        'pa-0 mt-10 justify-center': $vuetify.display.smAndDown,
        'pa-0 justify-end': $vuetify.display.lg,
        'justify-start': $vuetify.display.lgAndUp,
      }"
    >
      <div
        id="picture-container"
        class="picture-box"
        :class="{ 'mr-0': $vuetify.display.smAndDown }"
      >
        <v-img
          class="picture"
          style="height: auto; z-index: 0"
          :src="require('@/assets/my.png')"
        ></v-img>
        <v-img
          id="git"
          class="floating-icon git"
          :src="require('@/assets/svg-icons/git.svg')"
        />
        <v-img
          id="js"
          class="floating-icon js"
          :src="require('@/assets/svg-icons/js.svg')"
        />
        <v-img
          id="vue"
          class="floating-icon vue"
          :src="require('@/assets/svg-icons/vue.svg')"
        />
        <v-img
          id="nodejs"
          class="floating-icon nodejs"
          :src="require('@/assets/svg-icons/nodejs.svg')"
        />
        <v-img
          id="dotnet"
          class="floating-icon dotnet"
          :src="require('@/assets/svg-icons/dotnet.svg')"
        />
        <v-img
          id="react"
          class="floating-icon react"
          :src="require('@/assets/svg-icons/react.svg')"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { gsap } from "gsap";
import TextPlugin from "gsap/TextPlugin";
import SocialComponent from "@/components/SocialComponent.vue";
import { fetchDetails } from "@/utils/fetchData";

gsap.registerPlugin(TextPlugin);

export default {
  data() {
    return {
      showBtnText: false,
      fetchDetails,
      details: {},
    };
  },
  components: {
    SocialComponent,
  },
  methods: {
    changeShowBtnTextValue(value) {
      this.showBtnText = value;
      const textEl = document.getElementById("resume-btn-text");
      textEl.style.opacity = +this.showBtnText;
      this.handleMouseLeave();
    },
  },
  computed: {
    informationSection() {
      const commonStyling = {
        "max-width": "100vw",
        height: "calc(100vh - 80px)",
      };
      if (this.$vuetify.display.sm)
        return { ...commonStyling, "padding-inline": "90px", height: "auto" };
      else if (this.$vuetify.display.xs)
        return { ...commonStyling, "padding-inline": "50px", height: "auto" };
      else return { ...commonStyling, "padding-inline": "250px" };
    },
  },
  async mounted() {
    const profilePic = gsap.fromTo(
      "#picture-container",
      {
        y: 30,
        opacity: 0,
        scale: 0,
      },
      {
        y: 0,
        duration: 2,
        scale: 1,
        opacity: 1,
        delay: 1,
        ease: "back.inOut",
      }
    );

    const fromToTextConfig = {
      from: {
        opacity: 0,
      },
      to: (text, args) => ({
        opacity: 1,
        duration: 1,
        text: text,
        ease: "none",
        delay: 1,
        paused: true,
        ...args,
      }),
    };
    const desc =
      "Welcome to my portfolio! I am a skilled software engineer experienced in frontend and backend technologies. With a strong foundation in computer science, I create exceptional user experiences through clean and efficient code. Browse through my projects to see my expertise. Let's connect and Thank you for visiting!";

    const socialBtns = gsap.fromTo(
      ".social-container",
      {
        opacity: 0,
        scale: 0,
      },
      {
        opacity: 1,
        scale: 1,
        ease: "back.inOut",
        duration: 1,
        paused: true,
      }
    );

    const resumeBtn = gsap.fromTo(
      ".resume-btn",
      { opacity: 0 },
      {
        opacity: 1,
        ease: "sine.inOut",
        paused: true,
        onComplete: () => {
          socialBtns.play();
        },
      }
    );
    const about = gsap.fromTo(
      ".about",
      fromToTextConfig.from,
      fromToTextConfig.to("Software Engineer | Junior at UET", {
        delay: 1.3,
        paused: true,
        onComplete: () => {
          resumeBtn.play();
        },
      })
    );
    const name = gsap.fromTo(
      ".name",
      fromToTextConfig.from,
      fromToTextConfig.to("Muhammad Jawad Haider", {
        delay: 1.3,
        paused: true,
      })
    );

    const HiThere = gsap.fromTo(
      ".greetings",
      {
        x: -1000,
      },
      {
        duration: 1.5,
        x: 0,
        ease: "elastic.out",
        paused: true,
        onComplete: () => {
          name.play();
          about.play();
        },
      }
    );

    HiThere.play();
    profilePic.play();
    name.play();
    about.play();

    const icons = gsap.utils.toArray(".floating-icon");

    icons.forEach((icon, index) => {
      gsap.fromTo(
        icon,
        {
          scale: 0,
          opacity: 0,
          delay: 1,
        },
        {
          scale: 1,
          opacity: 1,
          repeat: -1,
          delay: 3 + index / 2,
          yoyo: true,
          duration: 3,
          ease: "circ.inOut",
        }
      );
    });
    this.details = await fetchDetails();
  },
};
</script>

<style lang="scss">
.left-pane {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  padding-bottom: 170px !important;
}

.picture-box {
  height: 48vh;
  display: flex;
  justify-content: center;
  margin-top: 60px;
  margin-right: 22px;
  position: relative;

  .floating-icon {
    position: absolute;
    width: 10%;
    height: auto;
  }
  .git {
    top: -12%;
    right: 34%;
  }
  .js {
    top: 2%;
    left: 2%;
  }
  .vue {
    top: 24%;
    right: -9%;
  }
  .nodejs {
    bottom: -12%;
    left: 34%;
  }
  .dotnet {
    bottom: 14%;
    right: -6%;
  }
  .react {
    bottom: 34%;
    left: -13%;
  }
}

.about,
.greetings {
  font-size: 35px;
  font-family: "Roboto Condensed", sans-serif;
}

.about {
  font-size: 28px;
  color: #2d2c2c;
  margin-top: 15px;
}

.name {
  font-size: 50px;
  font-weight: bold;
  color: #363636;
}

.social-container {
  position: relative;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.email {
  font-size: 15px;
  color: #2d2c2c;
  font-weight: bold;
}

.resume-btn {
  border-radius: 22px;
  background-color: #ec7e1e;
  width: 48px;
  padding: 7px 20px;
  margin-top: 50px;
  height: 48px;
  transition: 0.4s ease;

  span {
    transition-delay: 0.2s;
  }
}

@media (max-width: 900px) {
  .picture-box {
    height: 40vh;
    margin-bottom: 90px;
  }

  .social-container {
    margin-top: 20px;
  }
}

@media (min-width: 1900px) {
  .picture-box {
    height: 40vh;
  }
}
</style>
