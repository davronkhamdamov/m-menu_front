export const useTheme = () => {
  const colorMode = useState("theme") || "system";

  const applyTheme = (mode) => {
    const html = document.documentElement;

    if (mode === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      html.classList.toggle("dark", prefersDark);
    } else {
      html.classList.toggle("dark", mode === "dark");
    }

    colorMode.value = mode;
    localStorage.setItem("theme", mode);
  };

  const handleSystemChange = (e) => {
    if (colorMode.value === "system") {
      document.documentElement.classList.toggle("dark", e.matches);
    }
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    colorMode.value = savedTheme;
    if (savedTheme === "system" || savedTheme != "") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleSystemChange);
    } else {
      applyTheme(savedTheme);
    }
  });
  return {
    colorMode,
    applyTheme,
  };
};
