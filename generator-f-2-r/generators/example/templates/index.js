
import info from './<%= cleanName %>.md';<%if (includeCode === true) { %>
import code from './<%= cleanName %>.jsexample';<% } %>

const config = {
  info,
  name: '<%= fullName %>',<%if (includeCode === true) { %>
  code,<% } %>
  children: [
  ],
};

export default config;
