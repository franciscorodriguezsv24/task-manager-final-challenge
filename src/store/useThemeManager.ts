import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

// Función para obtener el tema inicial desde localStorage
const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  }
  return "dark"; // valor por defecto
};

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = getInitialTheme();
  // Actualiza el atributo al cargar
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", initialTheme);
  }

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === "light" ? "dark" : "light";
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", newTheme);
          localStorage.setItem("theme", newTheme); // guardar en localStorage
        }
        return { theme: newTheme };
      }),
  };
});
