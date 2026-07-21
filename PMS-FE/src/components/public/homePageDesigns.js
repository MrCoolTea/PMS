export const homePageDesigns = [
  {
    id: 'spotlight',
    label: 'Spotlight Split',
    heroLayout: 'split',
    heroImageMode: 'panel',
    heroTextAlign: 'left',
    heroImageHeight: 250,
    heroMinHeight: 420,
    statsLayout: 'grid',
    sectionLayout: 'split',
    roomsSectionOrder: 1,
    socialSectionOrder: 2,
    titleSize: 'standard',
  },
  {
    id: 'immersive',
    label: 'Immersive Cover',
    heroLayout: 'centered',
    heroImageMode: 'background',
    heroTextAlign: 'center',
    heroImageHeight: 300,
    heroMinHeight: 560,
    statsLayout: 'strip',
    sectionLayout: 'stack',
    roomsSectionOrder: 1,
    socialSectionOrder: 2,
    titleSize: 'large',
  },
  {
    id: 'editorial',
    label: 'Editorial Frame',
    heroLayout: 'asymmetric',
    heroImageMode: 'panel',
    heroTextAlign: 'left',
    heroImageHeight: 300,
    heroMinHeight: 480,
    statsLayout: 'feature',
    sectionLayout: 'reverse',
    roomsSectionOrder: 2,
    socialSectionOrder: 1,
    titleSize: 'editorial',
  },
];

const fallbackHomePageDesign = homePageDesigns[0];

export function getHomePageDesignById(designId) {
  return homePageDesigns.find((design) => design.id === designId) ?? fallbackHomePageDesign;
}
