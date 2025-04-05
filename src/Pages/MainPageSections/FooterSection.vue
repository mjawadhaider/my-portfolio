<template>
  <v-row
    justify="center"
    class="ma-0 footer-section text-gray"
    :class="{ 'tab-view': $vuetify.display.sm }"
    :style="$vuetify.display.mdAndUp
      ? 'border-radius: 50px 50px 0 0;'
      : 'border-radius: 30px 30px 0 0;'
      "
  >
    <v-col
      cols="12"
      md="8"
      sm="10"
      :class="{ 'px-6': $vuetify.display.smAndDown }"
    >
      <div
        ref="animatedDiv"
        class="fading-col"
      >
        <v-row
          id="footer-content"
          class="d-flex"
        >
          <v-col
            cols="11"
            md="9"
            sm="9"
            class="d-flex flex-column"
            :style="$vuetify.display.mdAndUp ? 'font-size: 60px;' : 'font-size: 45px'
              "
          >
            <span class="text-white">
              <v-avatar
                :image="require('@/assets/my.png')"
                size="64"
                class="mr-2"
              />
              Let's work
            </span>

            <span class="text-white"> together </span>
          </v-col>

          <v-col
            cols="1"
            md="3"
            sm="3"
            class="d-flex"
            :class="$vuetify.display.xs || $vuetify.display.mdAndUp
              ? 'align-end pa-0 mb-10'
              : 'align-center justify-end'
              "
          >
            <v-icon
              color="white"
              icon="mdi-arrow-bottom-left"
            />
          </v-col>

          <v-col
            cols="12"
            class="d-flex align-center pb-0"
            style="flex: wrap"
          >
            <v-divider
              color="white"
              :length="$vuetify.display.xs ? 166 : 680"
            />
            <button
              icon
              size="150"
              class="btn-get-in-touch custom-btn-hover"
              :color="lightGray"
              :style="$vuetify.display.smAndDown ? 'height: 160px; width: 230px' : ''
                "
              @click="getInTouch"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
            >
              Connect with Us!
            </button>
            <v-divider
              color="white"
              :length="$vuetify.display.xs ? 40 : 140"
            />
          </v-col>

          <v-col
            cols="12"
            id="contact-email-phone"
            class="d-flex align-center"
            :class="$vuetify.display.smAndDown ? 'pt-16' : 'py-0'"
            :style="$vuetify.display.xs
              ? { flexDirection: 'column' }
              : { flexDirection: 'row' }
              "
          >
            <v-btn
              key="email"
              variant="outlined"
              color="white"
              rounded
              :height="$vuetify.display.xs ? 65 : 55"
              width="300"
              :block="$vuetify.display.xs"
              class="custom-btn-hover email-button"
              :style="`border: 1px solid ${gray}; border-radius: 100px`"
              :class="$vuetify.display.xs ? 'mb-4' : 'mr-5'"
              @click="routeToLink('mailto:jhaider869@gmail.com')"
              @mousemove="handleMouseMove_Small"
              @mouseleave="handleMouseLeave"
            >
              <v-icon
                icon="mdi-email"
                size="large"
                class="mr-2"
              />
              jhaider869@gmail.com
            </v-btn>

            <v-btn
              key="phone"
              variant="outlined"
              color="white"
              rounded
              :height="$vuetify.display.xs ? 65 : 55"
              width="200"
              :block="$vuetify.display.xs"
              class="custom-btn-hover"
              :style="`border: 1px solid ${gray}; border-radius: 100px`"
              @click="copyToCipboard('+92362474916')"
              @mousemove="handleMouseMove_Small"
              @mouseleave="handleMouseLeave"
            >
              <v-icon
                icon="mdi-phone"
                size="large"
                class="mr-2"
              />
              +92 36 2474916
            </v-btn>
          </v-col>

          <v-col
            cols="12"
            id="animate-feedback"
            :class="$vuetify.display.smAndDown ? 'pt-16' : 'py-0'"
            :style="toggleFeedackForm ? { display: 'flex' } : { display: 'none' }"
          >
            <feedback-form
              id="feedback-form"
              @onClose="feedbackFormClosed"
            />
          </v-col>

          <v-col
            cols="12"
            class="text-center mt-16 pb-0"
          >
            <strong>Thanks for Being Here - Keep Scrolling!</strong>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col
      cols="12"
      md="11"
      class="pb-8"
      style="padding-top: 55px"
      :class="$vuetify.display.xs ? 'small-screen-footer px-6 pt-16' : 'footer px-16'
        "
    >
      <div
        class="d-flex flex-column"
        style="width: 50%; justify-self: self-end"
      >
        <h5 style="font-size: 9.6px; margin-bottom: 14.4px">VERSION</h5>
        <span
          style="font-size: 13.6px"
          class="text-white"
        >
          2023 <v-icon
            icon="mdi-copyright"
            size="15"
          /> Edition
        </span>
      </div>
      <span class="py-7">
        <v-divider
          v-if="$vuetify.display.xs"
          color="white"
        />
      </span>
      <div
        :style="$vuetify.display.xs
          ? { width: '100%' }
          : { width: '50%', justifyContent: 'end' }
          "
        class="d-flex"
      >
        <div>
          <h5 style="font-size: 9.6px; margin-bottom: 14.4px">SOCIALS</h5>
          <social-component />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { gsap } from 'gsap';
import FeedbackForm from "../../components/FeedbackForm.vue";
import SocialComponent from "../../components/SocialComponent.vue";

export default {
  components: {
    FeedbackForm,
    SocialComponent,
  },
  data() {
    return {
      toggleSnackbar: false,
      toggleFeedackForm: false,
    };
  },
  methods: {
    copyToCipboard(value) {
      const textField = document.createElement("textarea");
      textField.innerText = value;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
      this.$toast.info("Copied to clipboard!!");
    },
    getInTouch() {
      if (!this.toggleFeedackForm) {
        this.toggleFeedackForm = !this.toggleFeedackForm;
        gsap.to('#contact-email-phone', {
          x: 2000,
          ease: 'power3.inOut',
          duration: 0.4,
        });
        gsap.fromTo('#animate-feedback', {
          x: -2000,
          opacity: 0,
        }, {
          x: 0,
          delay: 0.3,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.inOut',
        });

        setTimeout(() => {
          const form = document.getElementById("feedback-form");
          if (!form) return;

          form.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 350);

        clearTimeout();
      } else {
        this.feedbackFormClosed();
      }
    },
    feedbackFormClosed() {
      gsap.to('#animate-feedback', {
        x: 2000,
        ease: 'power3.inOut',
        duration: 0.4,
      });
      gsap.fromTo('#contact-email-phone', {
        x: -2000,
        opacity: 0,
      }, {
        x: 0,
        delay: 0.3,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.inOut',
      });
      setTimeout(() => {
        this.toggleFeedackForm = false;
      }, 400);

      clearTimeout();
    },
    addAnimationToFooter() {
      gsap.fromTo(
        '#footer-content',
        {
          y: -200,
          opacity: 0,
        }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power1.out',
      }
      );
    },
  },
  mounted() {
    const options = {
      rootMargin: "10px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.addAnimationToFooter();
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, options);

    observer.observe(this.$refs.animatedDiv);
  },
};
</script>

<style lang="scss">
$gray: #999d9e;
$lightGray: #37383b;
$darkGray: #1c1d20;

.footer-section {
  background-color: $darkGray;
  box-shadow: 1px 1px 30px #353535;
  z-index: 1;
  padding-top: 100px;

  h3 {
    font-family: "Roboto Condensed", sans-serif;
  }
}

.footer-section.tab-view {
  padding-top: 140px;
}


.btn-get-in-touch {
  background-color: $lightGray;
  padding: 20px;
  height: 190px;
  width: 190px;
  min-height: 190px;
  min-width: 190px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  color: white;
  text-transform: none;
  font-size: 23px;
  transition: 0.1s;
  border-radius: 50%;

  #text {
    flex: 1;
  }
}

.custom-btn-hover {
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background-color: darken(#353536, 5%);
    transition: all 0.3s;
    border-radius: 10rem;
    z-index: -1;
  }

  &:hover {
    color: white;

    &:before {
      height: 100%;
    }
  }
}

.email-button {
  border: 1px solid $gray;
  border-radius: 100px;

  .v-btn__content {
    text-transform: lowercase;
  }
}

.footer {
  display: flex;
  justify-self: end;
  align-self: flex-end;
}

.small-screen-footer {
  display: flex;
  flex-direction: column-reverse;
}

.fading-col {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 1s, transform 0.5s;
}

.visible {
  opacity: 1;
  transform: translateY(0);
}

.move-right {
  animation: slideInRight 0.3s ease-in forwards;
}

.move-left {
  animation: slideInLeft 0.3s ease-in forwards;
}
</style>
