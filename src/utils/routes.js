// PACKAGE_PATH
const OTHER = '/package-other'
const MAIN = '/pages'
/* eslint-disable */
export default {
  other: {
    PACKAGE: OTHER,
    HELLO:`${OTHER}/hello`,
    // package-other
  },
  main: {
    PACKAGE: MAIN,
    HOME:`${MAIN}/home`,
    MINE:`${MAIN}/mine`,
    // main
  }
}
