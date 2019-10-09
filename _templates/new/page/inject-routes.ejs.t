---
to: "src/utils/routes.js"
inject: true
before: "// <%= package[0] %>"
---
    <%= name.replace(/-/g,'_').toUpperCase() %>:`${<%= package[0].replace(/package-/, '').toUpperCase() %>}/<%= name %>`,