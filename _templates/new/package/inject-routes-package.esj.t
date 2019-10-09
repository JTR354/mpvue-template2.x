---
to: "src/utils/routes.js"
inject: true
after: "export default"
---
  <%= packageName %>: {
    PACKAGE: <%= packageName.toUpperCase() %>,
    // package-<%= packageName%>
  },