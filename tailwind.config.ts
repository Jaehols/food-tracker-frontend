import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#013A20",
        secondary: "#478C5C",
        accentOne: "#BACC81",
        accentTwo: "#CDD193"
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
