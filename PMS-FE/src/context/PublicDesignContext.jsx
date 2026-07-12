import { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResort } from './ResortContext.jsx';

const baseBehavior = {
  mainWidth: 1240,
  heroLayout: 'split',
  heroTextAlign: 'left',
  heroImageMode: 'panel',
  heroImageHeight: 250,
  heroMinHeight: 420,
  sectionLayout: 'split',
  statsLayout: 'grid',
  railCardWidth: { xs: '86%', md: '40%' },
  bookingRailWidth: { xs: '88%', md: '36%' },
};

function defineMode(mode) {
  return { ...baseBehavior, ...mode };
}

export const publicDesignModes = [
  defineMode({
    id: 'lagoon',
    label: 'Lagoon Glass',
    shortLabel: 'Lagoon',
    fontFamily: '"Trebuchet MS", "Avenir Next", sans-serif',
    titleFontFamily: '"Georgia", "Times New Roman", serif',
    shellBackground:
      'radial-gradient(circle at 15% 20%, rgba(66, 197, 190, 0.28), transparent 24%), radial-gradient(circle at 86% 14%, rgba(255, 214, 153, 0.3), transparent 18%), linear-gradient(180deg, #eefcf9 0%, #fffaf2 100%)',
    shellOverlay:
      'linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 42%, rgba(26,98,89,0.05) 100%)',
    headerBackground: 'rgba(255, 252, 246, 0.78)',
    headerBorder: '1px solid rgba(15, 84, 76, 0.1)',
    panelBackground: 'rgba(255, 255, 255, 0.72)',
    panelBorder: '1px solid rgba(15, 84, 76, 0.12)',
    cardBackground: 'rgba(242, 255, 252, 0.9)',
    cardBorder: '1px solid rgba(15, 84, 76, 0.1)',
    heroBackground:
      'linear-gradient(135deg, rgba(241, 255, 251, 0.95), rgba(255, 244, 225, 0.95))',
    heroSecondary:
      'linear-gradient(145deg, rgba(19, 121, 111, 0.9), rgba(19, 76, 83, 0.92))',
    footerBackground:
      'linear-gradient(140deg, rgba(10, 58, 53, 0.98), rgba(24, 113, 103, 0.94))',
    footerText: '#ecfffb',
    accent: '#1e9183',
    accentSoft: 'rgba(30, 145, 131, 0.14)',
    accentStrong: '#0d5f56',
    textPrimary: '#173833',
    textSecondary: 'rgba(23, 56, 51, 0.76)',
    titleWidth: '10ch',
    radiusHero: 36,
    radiusPanel: 28,
    radiusCard: 24,
    buttonShadow: '0 18px 40px rgba(17, 93, 84, 0.22)',
  }),
  defineMode({
    id: 'solstice',
    label: 'Solstice Postcard',
    shortLabel: 'Solstice',
    fontFamily: '"Gill Sans", "Trebuchet MS", sans-serif',
    titleFontFamily: '"Palatino Linotype", "Book Antiqua", serif',
    shellBackground:
      'radial-gradient(circle at 10% 15%, rgba(255, 167, 122, 0.34), transparent 22%), radial-gradient(circle at 82% 12%, rgba(255, 225, 152, 0.34), transparent 18%), linear-gradient(180deg, #fff7ed 0%, #fffdf6 100%)',
    shellOverlay:
      'repeating-linear-gradient(90deg, rgba(206,93,47,0.04) 0, rgba(206,93,47,0.04) 1px, transparent 1px, transparent 16px)',
    headerBackground: 'rgba(255, 246, 236, 0.84)',
    headerBorder: '1px solid rgba(155, 79, 42, 0.14)',
    panelBackground: 'rgba(255, 252, 246, 0.8)',
    panelBorder: '1px solid rgba(155, 79, 42, 0.12)',
    cardBackground: 'rgba(255, 244, 231, 0.95)',
    cardBorder: '1px solid rgba(155, 79, 42, 0.12)',
    heroBackground:
      'linear-gradient(135deg, rgba(255, 240, 220, 0.95), rgba(255, 252, 233, 0.96))',
    heroSecondary:
      'linear-gradient(145deg, rgba(203, 92, 43, 0.94), rgba(121, 50, 23, 0.94))',
    footerBackground:
      'linear-gradient(140deg, rgba(98, 38, 19, 0.98), rgba(180, 86, 36, 0.96))',
    footerText: '#fff6ef',
    accent: '#c65e2e',
    accentSoft: 'rgba(198, 94, 46, 0.14)',
    accentStrong: '#8f381b',
    textPrimary: '#4b2416',
    textSecondary: 'rgba(75, 36, 22, 0.76)',
    titleWidth: '12ch',
    radiusHero: 16,
    radiusPanel: 20,
    radiusCard: 18,
    buttonShadow: '0 18px 38px rgba(160, 72, 30, 0.2)',
  }),
  defineMode({
    id: 'editorial',
    label: 'Editorial Escape',
    shortLabel: 'Editorial',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    titleFontFamily: '"Baskerville", "Times New Roman", serif',
    shellBackground: 'linear-gradient(180deg, #f6f4f0 0%, #fbfaf8 100%)',
    shellOverlay:
      'linear-gradient(90deg, transparent 0%, rgba(22,22,22,0.035) 50%, transparent 100%)',
    headerBackground: 'rgba(249, 247, 243, 0.9)',
    headerBorder: '1px solid rgba(26, 26, 26, 0.08)',
    panelBackground: 'rgba(255, 255, 255, 0.84)',
    panelBorder: '1px solid rgba(26, 26, 26, 0.1)',
    cardBackground: '#ffffff',
    cardBorder: '1px solid rgba(26, 26, 26, 0.12)',
    heroBackground:
      'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(244,241,236,0.96))',
    heroSecondary:
      'linear-gradient(180deg, rgba(24, 24, 24, 0.96), rgba(52, 52, 52, 0.96))',
    footerBackground:
      'linear-gradient(180deg, rgba(18, 18, 18, 0.98), rgba(45, 45, 45, 0.98))',
    footerText: '#f8f5ef',
    accent: '#111111',
    accentSoft: 'rgba(17, 17, 17, 0.08)',
    accentStrong: '#000000',
    textPrimary: '#161616',
    textSecondary: 'rgba(22, 22, 22, 0.68)',
    titleWidth: '14ch',
    radiusHero: 8,
    radiusPanel: 10,
    radiusCard: 4,
    buttonShadow: '0 14px 34px rgba(0, 0, 0, 0.16)',
    heroLayout: 'wide',
  }),
  defineMode({
    id: 'midnight',
    label: 'Midnight Luxe',
    shortLabel: 'Midnight',
    fontFamily: '"Segoe UI", "Arial Nova", sans-serif',
    titleFontFamily: '"Didot", "Times New Roman", serif',
    shellBackground:
      'radial-gradient(circle at 20% 18%, rgba(114, 89, 255, 0.18), transparent 20%), radial-gradient(circle at 88% 14%, rgba(35, 190, 255, 0.14), transparent 18%), linear-gradient(180deg, #07121d 0%, #0f1928 100%)',
    shellOverlay:
      'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0) 42%, rgba(0,0,0,0.12) 100%)',
    headerBackground: 'rgba(8, 18, 30, 0.76)',
    headerBorder: '1px solid rgba(146, 177, 255, 0.12)',
    panelBackground: 'rgba(11, 24, 39, 0.8)',
    panelBorder: '1px solid rgba(146, 177, 255, 0.14)',
    cardBackground: 'rgba(19, 34, 54, 0.92)',
    cardBorder: '1px solid rgba(146, 177, 255, 0.14)',
    heroBackground:
      'linear-gradient(145deg, rgba(10, 28, 45, 0.96), rgba(16, 24, 46, 0.96))',
    heroSecondary:
      'linear-gradient(160deg, rgba(113, 93, 242, 0.96), rgba(28, 183, 223, 0.92))',
    footerBackground:
      'linear-gradient(150deg, rgba(4, 9, 16, 0.99), rgba(18, 38, 62, 0.99))',
    footerText: '#e8f3ff',
    accent: '#8ca5ff',
    accentSoft: 'rgba(140, 165, 255, 0.16)',
    accentStrong: '#d8e1ff',
    textPrimary: '#e7eefc',
    textSecondary: 'rgba(231, 238, 252, 0.74)',
    titleWidth: '12ch',
    radiusHero: 32,
    radiusPanel: 24,
    radiusCard: 22,
    buttonShadow: '0 24px 60px rgba(20, 44, 92, 0.38)',
  }),
  defineMode({
    id: 'festival',
    label: 'Festival Motion',
    shortLabel: 'Festival',
    fontFamily: '"Verdana", "Trebuchet MS", sans-serif',
    titleFontFamily: '"Impact", "Arial Black", sans-serif',
    shellBackground:
      'radial-gradient(circle at 15% 15%, rgba(255, 86, 111, 0.22), transparent 20%), radial-gradient(circle at 85% 14%, rgba(255, 199, 0, 0.22), transparent 18%), radial-gradient(circle at 72% 88%, rgba(0, 194, 184, 0.18), transparent 16%), linear-gradient(180deg, #fff8f1 0%, #fefcf8 100%)',
    shellOverlay:
      'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 34%), repeating-linear-gradient(-45deg, rgba(18,18,18,0.03) 0, rgba(18,18,18,0.03) 2px, transparent 2px, transparent 16px)',
    headerBackground: 'rgba(255, 251, 247, 0.84)',
    headerBorder: '1px solid rgba(255, 86, 111, 0.14)',
    panelBackground: 'rgba(255, 255, 255, 0.86)',
    panelBorder: '1px solid rgba(18, 18, 18, 0.08)',
    cardBackground: 'rgba(255, 247, 240, 0.96)',
    cardBorder: '1px solid rgba(255, 86, 111, 0.12)',
    heroBackground:
      'linear-gradient(135deg, rgba(255, 247, 236, 0.96), rgba(255, 240, 249, 0.94))',
    heroSecondary:
      'linear-gradient(140deg, rgba(255, 86, 111, 0.98), rgba(255, 175, 52, 0.96), rgba(0, 194, 184, 0.96))',
    footerBackground:
      'linear-gradient(145deg, rgba(16, 22, 28, 0.98), rgba(40, 18, 26, 0.98))',
    footerText: '#fff7f2',
    accent: '#ff566f',
    accentSoft: 'rgba(255, 86, 111, 0.14)',
    accentStrong: '#ff9e00',
    textPrimary: '#22161a',
    textSecondary: 'rgba(34, 22, 26, 0.74)',
    titleWidth: '11ch',
    radiusHero: 42,
    radiusPanel: 30,
    radiusCard: 26,
    buttonShadow: '0 22px 48px rgba(255, 86, 111, 0.22)',
  }),
  defineMode({
    id: 'zen',
    label: 'Zen Courtyard',
    shortLabel: 'Zen',
    fontFamily: '"Optima", "Segoe UI", sans-serif',
    titleFontFamily: '"Garamond", "Times New Roman", serif',
    shellBackground:
      'radial-gradient(circle at 18% 20%, rgba(160, 189, 151, 0.26), transparent 20%), radial-gradient(circle at 86% 10%, rgba(224, 198, 160, 0.2), transparent 18%), linear-gradient(180deg, #f3f0e7 0%, #faf8f2 100%)',
    shellOverlay:
      'repeating-linear-gradient(0deg, rgba(76,86,62,0.035) 0, rgba(76,86,62,0.035) 1px, transparent 1px, transparent 18px)',
    headerBackground: 'rgba(249, 246, 239, 0.86)',
    headerBorder: '1px solid rgba(88, 98, 72, 0.12)',
    panelBackground: 'rgba(255, 252, 247, 0.84)',
    panelBorder: '1px solid rgba(88, 98, 72, 0.12)',
    cardBackground: 'rgba(245, 242, 233, 0.96)',
    cardBorder: '1px solid rgba(88, 98, 72, 0.12)',
    heroBackground:
      'linear-gradient(180deg, rgba(252, 248, 239, 0.96), rgba(240, 235, 224, 0.96))',
    heroSecondary:
      'linear-gradient(145deg, rgba(93, 108, 78, 0.94), rgba(136, 113, 78, 0.92))',
    footerBackground:
      'linear-gradient(145deg, rgba(58, 64, 50, 0.99), rgba(96, 84, 61, 0.96))',
    footerText: '#fbf7ef',
    accent: '#6d7b59',
    accentSoft: 'rgba(109, 123, 89, 0.14)',
    accentStrong: '#4f5a40',
    textPrimary: '#33372d',
    textSecondary: 'rgba(51, 55, 45, 0.72)',
    titleWidth: '13ch',
    radiusHero: 26,
    radiusPanel: 18,
    radiusCard: 16,
    buttonShadow: '0 18px 40px rgba(79, 90, 64, 0.16)',
  }),
  defineMode({
    id: 'panorama',
    label: 'Panorama Immersive',
    shortLabel: 'Panorama',
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
    titleFontFamily: '"Georgia", serif',
    shellBackground:
      'linear-gradient(180deg, #eff6ff 0%, #f9fbff 46%, #fffaf3 100%)',
    shellOverlay:
      'radial-gradient(circle at 50% 0%, rgba(54,127,255,0.08), transparent 30%)',
    headerBackground: 'rgba(247, 250, 255, 0.76)',
    headerBorder: '1px solid rgba(48, 96, 166, 0.12)',
    panelBackground: 'rgba(255, 255, 255, 0.78)',
    panelBorder: '1px solid rgba(48, 96, 166, 0.12)',
    cardBackground: 'rgba(245, 249, 255, 0.92)',
    cardBorder: '1px solid rgba(48, 96, 166, 0.1)',
    heroBackground:
      'linear-gradient(120deg, rgba(7, 19, 44, 0.58), rgba(21, 56, 117, 0.36))',
    heroSecondary:
      'linear-gradient(140deg, rgba(15, 41, 89, 0.96), rgba(58, 134, 255, 0.94))',
    footerBackground:
      'linear-gradient(145deg, rgba(9, 23, 53, 0.98), rgba(42, 88, 150, 0.95))',
    footerText: '#edf5ff',
    accent: '#357bdf',
    accentSoft: 'rgba(53, 123, 223, 0.14)',
    accentStrong: '#173b77',
    textPrimary: '#1a2b46',
    textSecondary: 'rgba(26, 43, 70, 0.74)',
    titleWidth: '13ch',
    radiusHero: 34,
    radiusPanel: 26,
    radiusCard: 22,
    buttonShadow: '0 24px 54px rgba(27, 69, 132, 0.24)',
    mainWidth: 1400,
    heroLayout: 'centered',
    heroTextAlign: 'center',
    heroImageMode: 'background',
    heroMinHeight: 560,
    sectionLayout: 'stack',
    statsLayout: 'feature',
    railCardWidth: { xs: '90%', md: '32%' },
    bookingRailWidth: { xs: '90%', md: '30%' },
  }),
  defineMode({
    id: 'marquee',
    label: 'Marquee Right',
    shortLabel: 'Marquee',
    fontFamily: '"Franklin Gothic Medium", "Arial Narrow", sans-serif',
    titleFontFamily: '"Bodoni MT", "Times New Roman", serif',
    shellBackground:
      'linear-gradient(180deg, #fcfbf8 0%, #f7f3ea 100%)',
    shellOverlay:
      'repeating-linear-gradient(90deg, rgba(31,31,31,0.03) 0, rgba(31,31,31,0.03) 1px, transparent 1px, transparent 20px)',
    headerBackground: 'rgba(252, 249, 242, 0.88)',
    headerBorder: '1px solid rgba(36, 28, 19, 0.1)',
    panelBackground: 'rgba(255, 255, 255, 0.84)',
    panelBorder: '1px solid rgba(36, 28, 19, 0.1)',
    cardBackground: 'rgba(249, 245, 236, 0.96)',
    cardBorder: '1px solid rgba(36, 28, 19, 0.1)',
    heroBackground:
      'linear-gradient(115deg, rgba(248, 239, 224, 0.9), rgba(255,255,255,0.76))',
    heroSecondary:
      'linear-gradient(135deg, rgba(35, 27, 19, 0.96), rgba(123, 87, 39, 0.94))',
    footerBackground:
      'linear-gradient(145deg, rgba(21, 16, 12, 0.99), rgba(88, 64, 34, 0.96))',
    footerText: '#fff7eb',
    accent: '#8a6230',
    accentSoft: 'rgba(138, 98, 48, 0.14)',
    accentStrong: '#3a2817',
    textPrimary: '#2f2116',
    textSecondary: 'rgba(47, 33, 22, 0.72)',
    titleWidth: '15ch',
    radiusHero: 10,
    radiusPanel: 14,
    radiusCard: 12,
    buttonShadow: '0 16px 34px rgba(88, 64, 34, 0.18)',
    heroLayout: 'reverse',
    heroTextAlign: 'right',
    heroImageMode: 'edge',
    sectionLayout: 'reverse',
  }),
  defineMode({
    id: 'atlas',
    label: 'Atlas Mosaic',
    shortLabel: 'Atlas',
    fontFamily: '"Segoe UI", sans-serif',
    titleFontFamily: '"Book Antiqua", serif',
    shellBackground:
      'radial-gradient(circle at 14% 18%, rgba(24, 148, 122, 0.14), transparent 24%), linear-gradient(180deg, #f5fbfa 0%, #fffdf8 100%)',
    shellOverlay:
      'repeating-linear-gradient(135deg, rgba(20, 53, 46, 0.03) 0, rgba(20, 53, 46, 0.03) 2px, transparent 2px, transparent 24px)',
    headerBackground: 'rgba(247, 252, 250, 0.88)',
    headerBorder: '1px solid rgba(20, 92, 79, 0.1)',
    panelBackground: 'rgba(255, 255, 255, 0.82)',
    panelBorder: '1px solid rgba(20, 92, 79, 0.1)',
    cardBackground: 'rgba(244, 250, 248, 0.96)',
    cardBorder: '1px solid rgba(20, 92, 79, 0.1)',
    heroBackground:
      'linear-gradient(135deg, rgba(244, 255, 252, 0.95), rgba(255, 246, 232, 0.95))',
    heroSecondary:
      'linear-gradient(145deg, rgba(11, 96, 84, 0.96), rgba(70, 151, 127, 0.92))',
    footerBackground:
      'linear-gradient(145deg, rgba(12, 59, 52, 0.99), rgba(54, 108, 93, 0.96))',
    footerText: '#eefdfa',
    accent: '#157e6e',
    accentSoft: 'rgba(21, 126, 110, 0.14)',
    accentStrong: '#0c4f45',
    textPrimary: '#1c3b36',
    textSecondary: 'rgba(28, 59, 54, 0.72)',
    titleWidth: '12ch',
    radiusHero: 24,
    radiusPanel: 18,
    radiusCard: 14,
    buttonShadow: '0 18px 42px rgba(12, 79, 69, 0.18)',
    heroLayout: 'asymmetric',
    sectionLayout: 'mosaic',
    statsLayout: 'strip',
  }),
  defineMode({
    id: 'shoreline',
    label: 'Shoreline Cover',
    shortLabel: 'Shoreline',
    fontFamily: '"Century Gothic", "Segoe UI", sans-serif',
    titleFontFamily: '"Garamond", serif',
    shellBackground:
      'linear-gradient(180deg, #fffdf7 0%, #eef8ff 100%)',
    shellOverlay:
      'radial-gradient(circle at 80% 8%, rgba(255, 189, 88, 0.12), transparent 18%)',
    headerBackground: 'rgba(255, 255, 252, 0.74)',
    headerBorder: '1px solid rgba(46, 95, 135, 0.12)',
    panelBackground: 'rgba(255, 255, 255, 0.84)',
    panelBorder: '1px solid rgba(46, 95, 135, 0.12)',
    cardBackground: 'rgba(247, 251, 255, 0.95)',
    cardBorder: '1px solid rgba(46, 95, 135, 0.1)',
    heroBackground:
      'linear-gradient(115deg, rgba(11, 39, 71, 0.52), rgba(29, 106, 164, 0.28))',
    heroSecondary:
      'linear-gradient(140deg, rgba(14, 54, 96, 0.96), rgba(44, 148, 214, 0.94))',
    footerBackground:
      'linear-gradient(145deg, rgba(7, 28, 50, 0.99), rgba(32, 89, 140, 0.95))',
    footerText: '#eff7ff',
    accent: '#2475b2',
    accentSoft: 'rgba(36, 117, 178, 0.14)',
    accentStrong: '#113c63',
    textPrimary: '#173650',
    textSecondary: 'rgba(23, 54, 80, 0.74)',
    titleWidth: '14ch',
    radiusHero: 28,
    radiusPanel: 20,
    radiusCard: 18,
    buttonShadow: '0 18px 44px rgba(17, 60, 99, 0.2)',
    heroLayout: 'centered',
    heroTextAlign: 'left',
    heroImageMode: 'background',
    heroMinHeight: 520,
    heroImageHeight: 320,
  }),
  defineMode({
    id: 'gallery',
    label: 'Gallery Stack',
    shortLabel: 'Gallery',
    fontFamily: '"Futura", "Trebuchet MS", sans-serif',
    titleFontFamily: '"Didot", serif',
    shellBackground:
      'linear-gradient(180deg, #faf7f2 0%, #ffffff 100%)',
    shellOverlay:
      'linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.02) 100%)',
    headerBackground: 'rgba(255, 255, 255, 0.86)',
    headerBorder: '1px solid rgba(35, 35, 35, 0.08)',
    panelBackground: 'rgba(255, 255, 255, 0.92)',
    panelBorder: '1px solid rgba(35, 35, 35, 0.08)',
    cardBackground: 'rgba(250, 248, 244, 0.96)',
    cardBorder: '1px solid rgba(35, 35, 35, 0.08)',
    heroBackground:
      'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,239,233,0.94))',
    heroSecondary:
      'linear-gradient(145deg, rgba(35, 35, 35, 0.96), rgba(82, 82, 82, 0.94))',
    footerBackground:
      'linear-gradient(180deg, rgba(15, 15, 15, 0.99), rgba(42, 42, 42, 0.97))',
    footerText: '#faf7f2',
    accent: '#232323',
    accentSoft: 'rgba(35, 35, 35, 0.08)',
    accentStrong: '#000000',
    textPrimary: '#171717',
    textSecondary: 'rgba(23, 23, 23, 0.68)',
    titleWidth: '16ch',
    radiusHero: 6,
    radiusPanel: 8,
    radiusCard: 6,
    buttonShadow: '0 12px 26px rgba(0, 0, 0, 0.12)',
    heroLayout: 'stacked',
    heroTextAlign: 'center',
    sectionLayout: 'stack',
    statsLayout: 'feature',
    mainWidth: 1100,
  }),
  defineMode({
    id: 'canopy',
    label: 'Canopy Retreat',
    shortLabel: 'Canopy',
    fontFamily: '"Lucida Sans", "Segoe UI", sans-serif',
    titleFontFamily: '"Palatino Linotype", serif',
    shellBackground:
      'radial-gradient(circle at 18% 14%, rgba(94, 152, 108, 0.18), transparent 22%), linear-gradient(180deg, #f4faf4 0%, #fbf9f3 100%)',
    shellOverlay:
      'repeating-linear-gradient(45deg, rgba(45,86,52,0.03) 0, rgba(45,86,52,0.03) 2px, transparent 2px, transparent 22px)',
    headerBackground: 'rgba(247, 251, 245, 0.86)',
    headerBorder: '1px solid rgba(65, 101, 58, 0.12)',
    panelBackground: 'rgba(255, 255, 255, 0.82)',
    panelBorder: '1px solid rgba(65, 101, 58, 0.12)',
    cardBackground: 'rgba(245, 249, 242, 0.96)',
    cardBorder: '1px solid rgba(65, 101, 58, 0.12)',
    heroBackground:
      'linear-gradient(135deg, rgba(248, 253, 245, 0.96), rgba(244, 240, 225, 0.95))',
    heroSecondary:
      'linear-gradient(145deg, rgba(53, 88, 45, 0.96), rgba(118, 145, 88, 0.92))',
    footerBackground:
      'linear-gradient(145deg, rgba(35, 53, 30, 0.99), rgba(87, 99, 56, 0.96))',
    footerText: '#f6faef',
    accent: '#618149',
    accentSoft: 'rgba(97, 129, 73, 0.14)',
    accentStrong: '#39512b',
    textPrimary: '#2d3d2b',
    textSecondary: 'rgba(45, 61, 43, 0.72)',
    titleWidth: '13ch',
    radiusHero: 30,
    radiusPanel: 18,
    radiusCard: 16,
    buttonShadow: '0 18px 42px rgba(57, 81, 43, 0.18)',
    heroLayout: 'reverse',
    heroImageMode: 'background-soft',
    sectionLayout: 'reverse',
    bookingRailWidth: { xs: '88%', md: '34%' },
  }),
];

const fallbackMode = publicDesignModes[0];
const PublicDesignContext = createContext(null);

export function getPublicDesignModeById(modeId) {
  return publicDesignModes.find((item) => item.id === modeId) ?? fallbackMode;
}

export function PublicDesignProvider({ children }) {
  const { data } = useResort();
  const [searchParams] = useSearchParams();
  const previewMode = searchParams.get('previewDesign');
  const storedMode = data.settings?.publicTheme;
  const mode = getPublicDesignModeById(previewMode ?? storedMode).id;

  const value = useMemo(() => {
    const currentDesign = getPublicDesignModeById(mode);

    return {
      mode,
      modes: publicDesignModes,
      currentDesign,
      previewMode,
    };
  }, [mode, previewMode]);

  return <PublicDesignContext.Provider value={value}>{children}</PublicDesignContext.Provider>;
}

export function usePublicDesign() {
  const context = useContext(PublicDesignContext);

  if (!context) {
    throw new Error('usePublicDesign must be used within a PublicDesignProvider');
  }

  return context;
}
