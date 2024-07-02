/* eslint-disable no-useless-escape */
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

function extractPathFromRegexp(regexp) {
  const regexpStr = typeof regexp === 'string' ? regexp : regexp.source;
  const path = regexpStr
    .replace(/^\^\\\//, '')  // Remove the leading ^\/
    .replace(/\\\/\?\(\?\=\\\/\|\$\)\/i?$/, '')  // Remove the trailing \/?(?=\/|$)/i
    .replace(/\\\//g, '/');  // Replace escaped slashes with regular slashes
  return path;
}

function getRoutes(router1, prefix = '') {
  const routes = [];

  router1.stack.forEach((middleware) => {
    if (middleware.route) {
      // Middleware is a route
      const path = prefix + middleware.route.path;
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      routes.push({ path, methods });
    } else if (middleware.name === 'router') {
      // Middleware is another router
      const newPrefix = prefix + extractPathFromRegexp(middleware.regexp);
      const subRoutes = getRoutes(middleware.handle, newPrefix);
      routes.push(...subRoutes);
    }
  });

  return routes;
}
const routes = getRoutes(router, '/');
console.log(routes, 'routes');

module.exports = router;
