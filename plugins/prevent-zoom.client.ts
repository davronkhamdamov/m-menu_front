export default defineNuxtPlugin(() => {
  if (process.client) {
    ["gesturestart", "gesturechange", "gestureend"].forEach((event) => {
      window.addEventListener(event, (e) => e.preventDefault(), {
        passive: false,
      });
    });
  }
});
