<template>
  <v-col
    cols="12"
    :md="+md || 4"
    sm="8"
    class="d-flex justify-center align-center"
    :class="titleStyling"
    :style="titleStyling"
  >
    <h1
      :style="`color: ${titleColor}`"
      style="font-size: 40px;"
    >
      {{ title }}
    </h1>
  </v-col>

  <!-- seperator -->
  <v-col
    cols="12"
    :md="+seperatorMd || 10"
    sm="12"
    class="py-0 d-flex align-center justify-center"
    style="max-height: 52px"
    v-bind="separatorProps"
  >
    <hr
      style="width: 275px; background-color: white; border: none; height: 1.3px;"
      :style="lineStyling"
    />
    <v-icon
      class="mx-3"
      :color="iconColor"
      size="25"
    >
      {{ icon }}
    </v-icon>
    <hr
      style="width: 275px; background-color: white; border: none; height: 1.3px;"
      :style="lineStyling"
    />
  </v-col>
</template>

<script>
export default {
  props: {
    md: {
      type: Number,
      default: () => 4,
    },
    seperatorMd: {
      type: Number,
      default: () => 10,
    },
    title: {
      type: String,
      default: () => 'Title Here',
    },
    titleColor: {
      type: String,
      default: () => '#473a3a',
    },
    icon: {
      type: String,
      default: () => '',
    },
    iconColor: {
      type: String,
      default: () => '',
    },
    lineStyling: {
      type: Object,
      default: () => { },
    },
    titleStyling: {
      type: String,
      default: () => '',
    },
    separatorProps: {
      type: Object,
      default: () => { },
    },
  },
};
</script>

<style></style>
