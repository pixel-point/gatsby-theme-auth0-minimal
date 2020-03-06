const path = require('path');

exports.createPages = ({ actions }) => {
  const { createPage } = actions;
  // creating callback page
  createPage({
    path: process.env.GATSBY_AUTH0_CALLBACK_PATH || '/auth/callback',
    component: path.resolve(`${__dirname}/src/templates/auth/callback.js`),
  });
};
