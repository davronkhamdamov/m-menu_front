export default defineNuxtRouteMiddleware((to) => {
  if (to.path.includes("/admin") || to.path.includes("/staff")) {
    if (process.client) {
      const token = localStorage.getItem("token");
      if (!token) {
        return navigateTo("/login");
      }
    }
  }
});
