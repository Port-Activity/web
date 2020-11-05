// Dark Mode
// const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Colors
const color = {
  primary: '#070D39',
  secondary: '#4990DD',
  tertiary: '#11195B',
  grey: '#747D7D',
  grey_dark: '#4A4A4A',
  grey_light: '#D8D8D8',
  grey_lighter: '#F8F8F8',
  success: '#407505',
  warning: '#D0011C',
  highlight: '#FFFFD5',
  black: '#010101',
  white: '#FFF',
  neon: '#87E319',
};

// Text
const text = {
  font_title: '"Open Sans", "Segoe UI", Tahoma, sans-serif',
  font_text: '"Open Sans", "Segoe UI", Tahoma, sans-serif',
  line_height: '1.5',
  small: '0.8571rem',
};

// Styles
const style = {
  border_radius: '.25rem',
  border_radius_small: '.125rem',
  border_radius_big: '.5rem',
};

// Gaps
const sizing = {
  gap: '1rem',
  gap_huge: '2.75rem',
  gap_big: '2rem',
  gap_medium: '1.5rem',
  gap_small: '.5rem',
  gap_tiny: '.25rem',
};

// Effects
const fx = {
  box_shadow: '0 0 2px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.10), 0 2px 2px rgba(0, 0, 0, 0.10)',
  box_shadow_sharp:
    '0 1px 1px rgba(0, 0, 0, 0.18), 0 2px 2px rgba(0, 0, 0, 0.16), 0 3px 3px rgba(0, 0, 0, 0.14), 0 4px 4px rgba(0, 0, 0, 0.12)',
  box_shadow_soft: '0 1px 3px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.10), 0 3px 8px rgba(0, 0, 0, 0.10)',
  box_shadow_right: '2px 0px 2px rgba(0, 0, 0, 0.12), 4px 0px 4px rgba(0, 0, 0, 0.12)',
  gradient_blue: 'linear-gradient(155deg, #11195B 18%, #070D39 60%)',
};

// Transitions
const transition = {
  cubic: time => {
    return `all ${time}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  },
  ease: time => {
    return `all ${time}s ease-in-out`;
  },
};

export const theme = {
  color,
  text,
  style,
  sizing,
  fx,
  transition,
};
