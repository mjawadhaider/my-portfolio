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
.feedback-form__lede {
  color: $color-text-muted;
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
    border-bottom: $border-hairline;
    padding-inline: 0;
  }

  :deep(.v-field__input),
  :deep(.v-label) {
    padding-inline: 0;
    font-family: $font-body;
    color: $color-white;
  }

  :deep(.v-field--focused) {
    border-color: $color-accent;
  }
}

.feedback-form__actions {
  display: flex;
  align-items: center;
  gap: $space-6;
  margin-top: $space-6;
}

button:disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
