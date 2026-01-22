// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        training: "#3B82F6", // Electric Blue
        care: "#F472B6", // Coral/Pink
        midnight: "#09090B", // Deep Black
        surface: "#18181B", // Zinc 900
      },
    },
  },
  plugins: [],
};