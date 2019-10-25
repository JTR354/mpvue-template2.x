---
to: "src/utils/routes.js"
inject: true
after: "export default"
---
  <%= h.changeCase.camelCase(name)%>: `/<%= package[0]==='main'?'pages': '' + package[0]%>/<%= name %>`,