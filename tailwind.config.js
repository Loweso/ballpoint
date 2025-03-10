/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          white: "#ffffff",
          green: "#e1f1e8",
        },
        secondary: {
          accentGreen: "#c2e8d3",
          yellow: "#f4ef62",
          lightyellow: "#fffee1",
          categlistyellow: "#fffff5",
          buttonGrey: "#f9f9f9",
        },
        tertiary: {
          buttonGreen: "#37b16e",
          buttonBlue: "#c6dfff",
          buttonRed: "#bf5e5e",
          textBlue: "#146fe1",
          textRed: "#e31e1e",
          textGray: "#6B6B6B",
          textYellow: "#a09d45",
        },
      },
    },
  },
  plugins: [],
};
