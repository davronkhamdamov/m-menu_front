export default defineNuxtPlugin(() => {
  const applyTheme = (mode: string) => {
    const html = document.documentElement;

    if (mode === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      html.classList.toggle("dark", prefersDark);
    } else {
      html.classList.toggle("dark", mode === "dark");
    }

    localStorage.setItem("theme", mode);
  };

  const handleSystemChange = (e: MediaQueryListEvent) => {
    const savedTheme = localStorage.getItem("theme") || "system";
    if (savedTheme === "system") {
      document.documentElement.classList.toggle("dark", e.matches);
    }
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    applyTheme(savedTheme);

    if (savedTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleSystemChange);
    }
  });
});
