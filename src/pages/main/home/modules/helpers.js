import {mapGetters} from 'vuex'

export const computed = {
  ...mapGetters('home', ['list'])
}
// export const methods = {
//   ...mapActions('home', []),
//   ...mapMutations('home', []),
// }
