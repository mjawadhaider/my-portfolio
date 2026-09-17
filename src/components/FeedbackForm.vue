<template>
  <div class="feedback-form">
    <p class="feedback-form__lede">Send a note &mdash; I read every one.</p>
    <v-form
      ref="feedbackForm"
      class="feedback-form__fields"
      @submit.prevent="submitFeedback"
      :disabled="feedbackLoading"
    >
      <v-text-field
        v-model="name"
        label="Name"
        variant="plain"
        density="comfortable"
        class="feedback-field"
        hide-details="auto"
        :rules="[rules.required]"
      />
      <v-text-field
        v-model="email"
        label="Email"
        variant="plain"
        density="comfortable"
        class="feedback-field"
        hide-details="auto"
        :rules="[rules.required, rules.email]"
      />
      <v-textarea
        v-model="message"
        label="Message"
        variant="plain"
        density="comfortable"
        rows="2"
        auto-grow
        class="feedback-field"
        hide-details="auto"
        :rules="[rules.required]"
      />
      <div class="feedback-form__actions">
        <button
          type="button"
          class="hero__cta my-cursor-hover"
          :disabled="feedbackLoading"
          @click="onClose"
        >
          Cancel
        </button>
        <button type="submit" class="hero__cta hero__cta--primary my-cursor-hover">
          <span>{{ feedbackLoading ? 'Sending…' : 'Send' }}</span>
          <span class="hero__cta-arrow" aria-hidden="true">&#8594;</span>
        </button>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      message: '',
      feedbackLoading: false,
      rules: {
        required: (v) => !!v?.trim() || 'This field is required',
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email',
      },
    };
  },
  methods: {
    async submitFeedback() {
      const { valid } = await this.$refs.feedbackForm.validate();
      if (!valid) return;

      try {
        await this.submitSpreadSheet();
        this.$refs.feedbackForm?.reset();
        this.$toast.success('Your feedback has been submitted :)');
        this.onClose();
      } catch (err) {
        this.$toast.error('Something went wrong, please try again.');
      }
    },
    async submitSpreadSheet() {
      const url = 'https://sheetdb.io/api/v1/many29t84qz0w';

      const currentDate = new Date();

      const day = currentDate.getDate();
      const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthAbbreviations[currentDate.getMonth()];
      const year = currentDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;

      const payload = {
        data: [
          {
            Name: this.name,
            Email: this.email,
            Message: this.message,
            FeedbackDate: formattedDate,
          },
        ],
      };

      this.feedbackLoading = true;
      try {
        await axios.post(url, payload);
      } finally {
        this.feedbackLoading = false;
      }
    },
    onClose() {
      this.$emit('onClose');
      this.name = '';
      this.email = '';
      this.message = '';
    },
  },
};
</script>

<style scoped lang="scss">
// This form only ever renders inside FooterSection.vue's permanently-dark
// "tray" (see that file's comment) — so, like the footer itself, it uses
// the fixed $footer-* tokens rather than the theme-reactive $color-*
// ones. If this component is ever reused somewhere that isn't the fixed-
// dark footer, it will need its own themed variant instead.
.feedback-form__lede {
  color: $footer-text-muted;
  margin-bottom: $space-5;
}

.feedback-form__fields {
  display: flex;
  flex-direction: column;
}

.feedback-field {
  :deep(.v-field) {
    background: none;
    border-radius: 0;
    border-bottom: $footer-border;
    padding-inline: 0;
  }

  :deep(.v-field__input),
  :deep(.v-label) {
    padding-inline: 0;
    font-family: $font-body;
    color: $footer-text;
  }

  :deep(.v-field--focused) {
    border-color: $footer-accent;
  }
}

.feedback-form__actions {
  display: flex;
  align-items: center;
  gap: $space-6;
  margin-top: $space-6;
}

// Overrides InformationSection.vue's global (unscoped) .hero__cta /
// .hero__cta--primary, which these Cancel/Send buttons reuse — that base
// styling uses the theme-reactive $color-white/$color-accent, which
// would go near-invisible (dark-on-dark) once this fixed-dark tray sits
// in light mode. These scoped rules win via Vue's scoped data-attribute
// specificity without needing :deep(), since the buttons are this
// component's own template elements.
//
// !important is required, not optional: both this button AND
// InformationSection's base rule are single-class selectors, and
// Vuetify's own reset stylesheet includes
// `button, [type=button], [type=submit], ... { color: inherit }` at the
// SAME specificity. In this app's build, that reset rule ends up injected
// after our component styles, so on an equal-specificity tie it wins —
// meaning the button's color silently falls through to `inherit` (and
// from there, up the DOM, to whatever ends up on top). That's invisible
// in dark mode purely by coincidence (the inherited color and the
// intended one are the same off-white), which is why it went unnoticed
// until light mode made them diverge. Any custom-colored <button> in
// this app needs the same !important treatment — see .contact__method
// in FooterSection.vue, .theme-toggle in AppBar.vue, .dialog-close in
// ProjectItem.vue, etc.
.hero__cta {
  color: $footer-text !important;

  &:hover {
    border-color: $footer-text;
  }
}

.hero__cta--primary {
  color: $footer-accent !important;

  &::after {
    background: $footer-accent;
  }
}

button:disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
