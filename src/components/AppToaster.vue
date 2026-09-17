<template>
  <div class="app-toaster" role="status" aria-live="polite">
    <TransitionGroup name="toast" tag="div" class="app-toaster__list">
      <div
        v-for="item in toastState.toasts"
        :key="item.id"
        class="app-toast"
        :class="`app-toast--${item.type}`"
      >
        <v-icon size="18" class="app-toast__icon">{{ iconFor(item.type) }}</v-icon>
        <p class="app-toast__message">{{ item.message }}</p>
        <button
          type="button"
          class="app-toast__close my-cursor-hover"
          aria-label="Dismiss notification"
          @click="dismissToast(item.id)"
        >
          &times;
        </button>
        <span
          v-if="!reducedMotion"
          class="app-toast__progress"
          :style="{ animationDuration: `${item.duration}ms` }"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { toastState, dismissToast } from '@/plugins/toast';
import { prefersReducedMotion } from '@/utils/motion';

const ICONS = {
  success: 'mdi-check-circle-outline',
  error: 'mdi-alert-circle-outline',
  info: 'mdi-information-outline',
};

export default {
  data() {
    return {
      toastState,
      reducedMotion: prefersReducedMotion(),
    };
  },
  methods: {
    dismissToast,
    iconFor(type) {
      return ICONS[type] || ICONS.info;
    },
  },
};
</script>

<style scoped lang="scss">
.app-toaster {
  position: fixed;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4000;
  width: min(92vw, 420px);
  pointer-events: none;

  @media (max-width: 600px) {
    top: 80px;
  }
}

.app-toaster__list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  width: 100%;
}

.app-toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  padding: $space-4 $space-8 $space-4 $space-4;
  background: $gradient-accent-soft, $color-bg-elevated;
  border: $border-hairline;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  overflow: hidden;
  pointer-events: auto;
}

.app-toast__icon {
  flex: none;
  margin-top: 1px;
  color: $color-accent;
}

.app-toast--error .app-toast__icon {
  color: $color-error;
}

.app-toast--info .app-toast__icon {
  color: $color-text-muted;
}

.app-toast__message {
  margin: 0;
  font-family: $font-body;
  font-size: $fs-body-sm;
  line-height: $lh-normal;
  color: $color-white;
}

.app-toast__close {
  position: absolute;
  top: $space-2;
  right: $space-2;
  background: none;
  border: none;
  font-size: 1.125rem;
  line-height: 1;
  // !important: needed to beat Vuetify's `[type=button] { color: inherit }`
  // reset on this equal-specificity single-class selector — see
  // FeedbackForm.vue's .hero__cta comment for the full explanation.
  color: $color-gray !important;
  cursor: inherit;
  transition: color $dur-fast $ease-out, transform $dur-fast $ease-out;

  &:hover {
    color: $color-white !important;
    transform: rotate(90deg);
  }
}

.app-toast__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: $gradient-accent;
  transform-origin: left center;
  animation-name: app-toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.app-toast--error .app-toast__progress {
  background: linear-gradient(135deg, lighten($color-error, 10%), $color-error);
}

.app-toast--info .app-toast__progress {
  background: $color-gray;
}

@keyframes app-toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: opacity $dur-normal $ease-out, transform $dur-normal $ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.toast-leave-active {
  position: absolute;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: none;
  }
}
</style>
