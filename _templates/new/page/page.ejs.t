---
to: "src/pages/<%= h.inflection.dasherize(package[0]) %>/<%= h.inflection.dasherize(name) %>/<%= h.inflection.dasherize(name) %>.vue"
---
<template>
  <div class="<%= h.inflection.dasherize(name) %>">
    <!--<navigation-bar title="world"></navigation-bar>-->
    <%= h.inflection.dasherize(name) %>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  // import API from '@api'
  // import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = '<%=  h.inflection.dasherize(name).toUpperCase().replace(/-/g, '_')%>'

  export default {
    name: PAGE_NAME,
    components: {
      // NavigationBar
    },
    data() {
      return {
      }
    },
    computed: {
      // ...Helpers.<%= h.changeCase.camelCase(name)%>Computed,
    },
    methods: {
      // ...Helpers.<%= h.changeCase.camelCase(name)%>Methods,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .<%= h.inflection.dasherize(name) %>
    width: 100%
</style>
