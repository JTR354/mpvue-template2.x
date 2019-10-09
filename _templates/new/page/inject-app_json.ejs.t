---
to: "src/app.json"
inject: true
before: <%= package[0]==='main'?package[2]:package[1] %>
---
<%_ if (package[0]==='main') { _%>
    "pages/<%= name _%>",<%_ } else { _%>
        "<%= name _%>",<%_ } _%>