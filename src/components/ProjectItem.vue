<template>
  <div class="main-content">
    <v-img
      :src="handleImageFailure(project.pictures[0])"
      :lazy-src="handleImageFailure(project.pictures[0])"
      @load="isImageLoading = false"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </div>
  <div class="overlay-content">
    {{ project.name }}
  </div>
  <v-dialog
    v-model="project.active"
    persistent
    class="project-dialog"
  >
    <v-card class="dialog-card">
      <div class="header">
        <div class="d-flex">
          <v-img
            v-if="project.icon"
            :style="`max-width: ${project.iconSize ?? '30'}`"
            :src="handleImageFailure(project.icon)"
            class="mr-2"
          >
          </v-img>
          <div class="d-flex flex-column justify-center">
            <h3 class="mb-0">{{ project.name }}</h3>
            <span
              v-if="project.associatedWith"
              class="text-caption"
            >
              Associated with {{ project.associatedWith }}
            </span>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          class="close-btn"
          @click="closeDialog"
        ></v-btn>
      </div>
      <div
        class="content"
        :class="{ 'flex-column': $vuetify.display.smAndDown }"
      >
        <div
          class="description"
          :class="{ 'w-100': $vuetify.display.smAndDown }"
        >
          <div
            class="d-flex"
            style="justify-content: space-between"
          >
            <h3>Description:</h3>
            <p
              v-if="$vuetify.display.smAndDown"
              class="duration"
            >
              {{ project.duration }}
            </p>
          </div>
          <p>{{ project.description }}</p>
          <h3 class="mt-4">What did I do?</h3>
          <p>{{ project.responsibilities }}</p>
          <h3 class="mt-4">External Links:</h3>
          <div class="d-flex flex-column">
            <a
              class="my-cursor-hover"
              v-if="project.projectLink"
              target="_blank"
              :href="project.projectLink"
            >Project URL</a>
            <a
              v-else
              class="my-cursor-hover disabled"
              href=""
              @click.prevent
            >Project
              URL (Not Available)</a>
            <a
              class="my-cursor-hover"
              v-if="project.githubLink"
              target="_blank"
              :href="project.githubLink"
            >Github Link</a>
            <a
              v-else
              class="my-cursor-hover disabled"
              href=""
              @click.prevent
            >Github
              URL (Private Repo)</a>
          </div>
          <h3 class="mt-4">Technology Stack:</h3>
          <div class="tech-stack">
            <v-tooltip
              v-for="(icon, index) in project.techStack"
              :key="index"
              location="top"
              :content="icon"
              class="tech-tooltip"
            >
              <!-- max-width="63px"
              max-height="20px" -->
              <template v-slot:activator="{ props }">
                <v-img
                  v-bind="props"
                  :src="require(`@/assets/svg-icons/${getTechIcon(icon)}`)"
                />
              </template>
              <span
                class="text-center"
                style="font-size: 12px"
              >
                {{ getTechIconName(icon) }}
              </span>
            </v-tooltip>
          </div>
        </div>
        <div
          class="right-content"
          :class="{ 'w-100': $vuetify.display.smAndDown }"
        >
          <p
            v-if="$vuetify.display.mdAndUp"
            class="duration"
          >
            {{ project.duration }}
          </p>
          <div class="images">
            <v-carousel
              v-if="project.pictures.length !== 1"
              v-model="carouselIndex"
              cycle
              :height="$vuetify.display.xs ? '164' : '260'"
              hide-delimiters
              :show-arrows="$vuetify.display.smAndDown || 'hover'"
            >
              <template v-slot:prev="{ props }">
                <v-btn
                  v-bind="props"
                  size="30"
                  color="white"
                  style="margin-left: -10px"
                  icon
                  @click="props.onClick"
                >
                  <v-icon :color="lightGray">
                    mdi-arrow-left-drop-circle-outline
                  </v-icon>
                </v-btn>
              </template>
              <template v-slot:next="{ props }">
                <v-btn
                  v-bind="props"
                  size="30"
                  color="white"
                  style="margin-right: -10px"
                  icon
                  @click="props.onClick"
                >
                  <v-icon :color="lightGray">
                    mdi-arrow-right-drop-circle-outline
                  </v-icon>
                </v-btn>
              </template>
              <v-carousel-item
                v-for="(slidePic, index) in project.pictures"
                :key="index"
                class="fill-height"
              >
                <v-img
                  class="project-picture"
                  :src="handleImageFailure(slidePic)"
                  :lazy-src="handleImageFailure(slidePic)"
                  @load="isImageLoading = false"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      default: () => { },
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      isImageLoading: true,
      carouselIndex: 0,
    };
  },
  emits: ["closeDialog"],
  computed: {
    buttons() {
      let btns = [
        {
          title: "GITHUB-LINK",
          linkKey: "githubLink",
        },
        {
          title: "SEE PROJECT",
          linkKey: "projectLink",
        },
      ];
      return btns.filter((btn) => this.project[btn.linkKey]);
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", this.project);
    },
    getImageURL(imgId) {
      return `https://drive.google.com/thumbnail?id=${imgId}`;
    },
    getTechIconName(icon) {
      return {
        node: "NodeJS",
        vue: "VueJS",
        js: "JavaScript",
        react: "ReactJS",
        express: "ExpressJS",
        mongodb: "MongoDB",
        dotnet: ".NET",
        fluent: "FluentUI",
        blazor: "Blazor",
        nuget: "NuGet",
      }[icon];
    },
    getTechIcon(name) {
      const icons = {
        node: "nodejs.svg",
        vue: "vue.svg",
        js: "js.svg",
        react: "react.svg",
        express: "expressjs.svg",
        mongodb: "mongodb.svg",
        dotnet: "dotnet.png",
        fluent: "fluentui.png",
        blazor: "blazor.png",
        nuget: "nuget.png",
      };
      if (!icons[name]) {
        console.info("Icon name is incorrect");
      }
      return icons[name] || "no-image.png";
    },
    handleImageFailure(imgSrc) {
      try {
        const img = require(`@/assets/project-images/${imgSrc}`);
        return img;
      } catch (err) {
        return require(`@/assets/no-image-2.jpg`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.project-picture {
  object-fit: cover;
  width: 100%;
  height: 100%;
  box-shadow: 5px 4px 9px #222;
}

.main-content {
  display: block;
  width: 100%;
  transition: transform 0.5s;
}

.overlay-content {
  width: 100%;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(transparent, #222 58%);

  position: absolute;
  left: 0;
  bottom: 0;
  overflow: hidden;
  padding: 0 40px;
  transition: height 0.5s;
}

.project-dialog {
  width: 70vw;

  .dialog-card {
    background-color: #353535;
    border-radius: 12px !important;
  }

  .header {
    background-color: #222;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      color: #d5a880 !important;
    }

    button {
      i {
        color: #d5a880;
        font-size: larger;
      }
    }
  }

  .content {
    padding: 20px;
    display: flex;
    text-align: justify;
    gap: 1rem;
    font-size: 14px;

    .description {
      width: 50%;

      p {
        line-height: 1.2rem;
        margin-top: 4px;
      }

      .duration {
        text-align: end;
        color: #d5a880;
        font-weight: bold;
      }

      a {
        color: #d5a880;
        text-transform: uppercase;
        width: fit-content;
      }

      a.disabled {
        color: #d5a88070;
      }

      .tech-stack {
        display: flex;
        justify-content: center;

        .v-img {
          max-width: 30px;
          max-height: 30px;
          margin-inline: 4px;
        }
      }
    }

    .right-content {
      width: 50%;

      .duration {
        text-align: end;
        color: #d5a880;
        font-weight: bold;
      }
    }

    .images {
      width: 100%;
      height: 90%;
      display: flex;
      align-items: center;

      .v-window {
        box-shadow: 5px 4px 9px black;
        border-radius: 8px;
        cursor: inherit !important;

        .v-window__container {
          cursor: inherit !important;

          .v-carousel-item {
            cursor: inherit !important;
          }
        }
      }
    }
  }

  @media (max-width: 600px) {
    width: 100vw;
  }
}

@media (max-width: 1100px) {
  .content {
    flex-direction: column;
  }

  .description,
  .right-content {
    width: 100% !important;
  }
}

.close-btn:hover {
  transition: transform 0.5s;
  transform: rotate(180deg);
}
</style>

<style lang="scss">
.tech-tooltip {
  .v-overlay__content {
    padding: 4px 12px !important;
  }
}
</style>
