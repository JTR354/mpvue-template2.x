---
to: "src/app.json"
inject: true
after: "subPackages"
---
    {
      "root": "package-<%= packageName%>/",
      "pages": [
        "<%= name _%>"
      ]
    },