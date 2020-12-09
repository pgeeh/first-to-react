
import info from './<%= cleanName %>.md';<% for(let i = 1; i <= codeCount; i++) { %>
import code<%= i %> from './<%= cleanName %><%= i %>.jsexample';<% } %>

const config = {
  info,
  name: '<%= fullName %>',<%if (codeCount > 0) { %>
  code: [
    <% for(let i = 1; i <= codeCount; i++) { %>{
      name: 'Example<%= i %>',
      code: code<%= i %>,
    },<% } %>
  ],<% } %>
  children: [
  ],
};

export default config;
