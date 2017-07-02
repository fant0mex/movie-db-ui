const LightGTWalsheim = {
  fontFamily: 'gt-walsheim-light',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: `url('src/assets/fonts/gt-walsheim-light.ttf') format('truetype')`
}

const width = {
  sm: 544,
  md: 768,
  lg: 992,
  xl: 1200
}

export default {
  width: width,
  font: {
    Palanquin: LightGTWalsheim
  },
  media: {
    sm: `@media (min-width: ${width.sm}px)`,
    md: `@media (min-width: ${width.md}px)`,
    lg: `@media (min-width: ${width.lg}px)`,
    xl: `@media (min-width: ${width.xl}px)`
  }
}
