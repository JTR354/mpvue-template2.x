---
to: "src/utils/routes.js"
inject: true
before: "// <%= packageName %>"
---
    <%= name.replace(/-/g,'_').toUpperCase() %>:`${<%= packageName.replace(/package-/, '').toUpperCase() %>}/<%= name %>`,
