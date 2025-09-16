/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors with opacity support using CSS variables
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
      },
      // Add custom opacity variants
      opacity: {
        '15': '0.15',
        '20': '0.2',
        '30': '0.3',
        '50': '0.5',
        '70': '0.7',
      },
      textColor: {
        primary: 'var(--color-foreground)',
        muted: 'var(--color-muted-foreground)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities, theme }) {
      const colors = theme('colors');
      const colorMap = [];
      const excludedColors = ['inherit', 'current', 'transparent', 'black', 'white'];
      
      // Flatten color palette
      const flattenColorPalette = (colors, prefix = '') => 
        Object.keys(colors).reduce((acc, key) => {
          if (excludedColors.includes(key)) return acc;
          
          const value = colors[key];
          const cssVariable = `--color-${prefix}${key}`;
          
          if (typeof value === 'object') {
            if ('DEFAULT' in value) {
              acc[cssVariable] = value.DEFAULT;
            }
            if (typeof value.foreground === 'string') {
              acc[`${cssVariable}-foreground`] = value.foreground;
            }
            return {
              ...acc,
              ...flattenColorPalette(value, `${prefix}${key}-`)
            };
          }
          
          acc[cssVariable] = value;
          return acc;
        }, {});
      
      const colorVariables = flattenColorPalette(colors);
      
      // Add CSS variables
      addUtilities({
        ':root': Object.entries(colorVariables).reduce((acc, [key, value]) => {
          acc[`--${key}`] = value;
          return acc;
        }, {})
      });
      
      // Add color utilities with opacity support
      const colorUtilities = {};
      
      Object.keys(colorVariables).forEach(key => {
        colorUtilities[`.bg-${key}`] = {
          'background-color': `hsl(var(--${key}) / <alpha-value>)`
        };
        colorUtilities[`.text-${key}`] = {
          color: `hsl(var(--${key}) / <alpha-value>)`
        };
        colorUtilities[`.border-${key}`] = {
          'border-color': `hsl(var(--${key}) / <alpha-value>)`
        };
      });
      
      addUtilities(colorUtilities, ['responsive', 'hover', 'focus', 'dark']);
    }
  ],
};
