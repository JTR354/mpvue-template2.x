---
to: "src/utils/routes.js"
inject: true
after: "export default"
---
  <%= h.changeCase.camelCase(name)%>: `/<%= packageName==='main'?'pages': packageName %>/<%= name %>`,