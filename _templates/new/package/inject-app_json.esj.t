---
to: "src/app.json"
inject: true
after: "subPackages"
---
    {
      "root": "<%= packageName%>/",
      "pages": [
        "<%= name _%>"
      ]
    },