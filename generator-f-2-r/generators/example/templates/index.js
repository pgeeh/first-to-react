
import info from './<%= cleanName %>.md';<% for(let i = 1; i <= exampleCount; i++) { %>
import example<%= i %> from './<%= cleanName %><%= i %>.jsexample';<% } %>

const config = {
  info,
  name: '<%= fullName %>',<%if (exampleCount > 0) { %>
  examples: [
    <% for(let i = 1; i <= exampleCount; i++) { %>{
      name: 'Example<%= i %>',
      example: example<%= i %>,
    },
    <% } %>
  ],<% } %>
  children: [
  ],
};

export default config;
