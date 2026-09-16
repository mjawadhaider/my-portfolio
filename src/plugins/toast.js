import { reactive } from 'vue';

// Bespoke replacement for the old `vue-toast-notification` dependency —
// with only 3 call sites app-wide, a small toast matching the site's own
// design language was simpler than re-skinning a generic bootstrap theme.
// Exposes the same `this.$toast.success/error/info(message)` API the
// existing call sites (FeedbackForm.vue, FooterSection.vue) already use,
// so nothing else needed to change. Rendered by AppToaster.vue, mounted
// once in App.vue.
const state = reactive({
  toasts: [],
});

let nextId = 0;
const DEFAULT_DURATION = 3200;

function dismiss(id) {
  const index = state.toasts.findIndex((t) => t.id === id);
  if (index !== -1) state.toasts.splice(index, 1);
}

function push(type, message, duration = DEFAULT_DURATION) {
  const id = ++nextId;
  state.toasts.push({ id, type, message, duration });
  if (duration > 0) setTimeout(() => dismiss(id), duration);
  return id;
}

const toast = {
  success: (message, duration) => push('success', message, duration),
  error: (message, duration) => push('error', message, duration),
  info: (message, duration) => push('info', message, duration),
  dismiss,
};

export default {
  install(app) {
    app.config.globalProperties.$toast = toast;
  },
};

export { state as toastState, toast, dismiss as dismissToast };
