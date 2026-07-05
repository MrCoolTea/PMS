import { alpha, createTheme } from '@mui/material/styles';

export const templateColors = {
  primary: {
    lighter: '#C8FAD6',
    light: '#5BE49B',
    main: '#00A76F',
    dark: '#007867',
    darker: '#004B50',
    contrastText: '#FFFFFF',
  },
  secondary: {
    lighter: '#EFD6FF',
    light: '#C684FF',
    main: '#8E33FF',
    dark: '#5119B7',
    darker: '#27097A',
    contrastText: '#FFFFFF',
  },
  info: {
    lighter: '#CAFDF5',
    light: '#61F3F3',
    main: '#00B8D9',
    dark: '#006C9C',
    darker: '#003768',
    contrastText: '#FFFFFF',
  },
  success: {
    lighter: '#D3FCD2',
    light: '#77ED8B',
    main: '#22C55E',
    dark: '#118D57',
    darker: '#065E49',
    contrastText: '#FFFFFF',
  },
  warning: {
    lighter: '#FFF5CC',
    light: '#FFD666',
    main: '#FFAB00',
    dark: '#B76E00',
    darker: '#7A4100',
    contrastText: '#1C252E',
  },
  error: {
    lighter: '#FFE9D5',
    light: '#FFAC82',
    main: '#FF5630',
    dark: '#B71D18',
    darker: '#7A0916',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FCFDFD',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#1C252E',
    900: '#141A21',
  },
};

const palette = {
  primary: templateColors.primary,
  secondary: templateColors.secondary,
  info: templateColors.info,
  success: templateColors.success,
  warning: templateColors.warning,
  error: templateColors.error,
  grey: templateColors.grey,
  background: {
    default: '#FFFFFF',
    paper: '#ffffff',
    neutral: '#F4F6F8',
  },
  text: {
    primary: '#1C252E',
    secondary: '#637381',
  },
  divider: 'rgba(145, 158, 171, 0.20)',
};

export const appTheme = createTheme({
  palette,
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Barlow", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '4rem',
      lineHeight: 1.15,
    },
    h2: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.18,
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.05rem',
      lineHeight: 1.45,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 700,
      fontSize: '0.95rem',
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top left, rgba(0, 167, 111, 0.10), transparent 26%), radial-gradient(circle at top right, rgba(142, 51, 255, 0.10), transparent 24%), linear-gradient(180deg, #fcfdfd 0%, #f4f6f8 100%)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: ({ theme }) => ({
          marginBottom: theme.spacing(1),
        }),
        paragraph: ({ theme }) => ({
          marginBottom: theme.spacing(2),
        }),
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${palette.divider}`,
          backgroundImage: 'none',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
          padding: theme.spacing(0.5),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 12,
          paddingInline: 18,
        },
        contained: {
          boxShadow: `0 10px 24px ${alpha(palette.primary.main, 0.24)}`,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.main} 55%, ${palette.primary.dark} 100%)`,
        },
        outlined: {
          borderColor: alpha(palette.grey[500], 0.24),
          '&:hover': {
            borderColor: alpha(palette.primary.main, 0.4),
            backgroundColor: alpha(palette.primary.main, 0.04),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#fff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(palette.primary.main, 0.3),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary.main,
            boxShadow: `0 0 0 4px ${alpha(palette.primary.main, 0.12)}`,
          },
        },
        input: {
          fontSize: '0.95rem',
        },
        notchedOutline: {
          borderColor: palette.divider,
          transition: 'border-color 120ms ease, box-shadow 120ms ease',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: palette.error.main,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: palette.text.secondary,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: palette.divider,
        },
      },
    },
  },
});
