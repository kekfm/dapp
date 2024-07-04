/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          1:'#ff69b4', //pink bg
          2:'#fffb47', //logo font color
          3:'#f4d738', //presale area background
          4:'#fff4d4', //presale card background
          5:'#90ee90', //buy green notification
          6:'#ff5757', //sell red notification
          7:'#69d2e7', //that disconnect blue
          8:'#FF6B6B', //warn red
          9:'#E3A018', //darker orange
          10:'#F8D6B3', //light orange
          11:'#C4A1FF',
          12:'#2FFF2F', //green as fuck
          13:'#7df9ff', //baby blue
          14:'#daf5f0', //light blue
          15:'#a7dbd8', //not so light blue

        }
      },
      fontFamily:{
        basic: ["IBM Plex Sans", "sans-serif"]
      },
      fontWeight: {
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
        'extrabold': 800,
        'black': 900,
      },
    },
  },
  plugins: [],

}


  
