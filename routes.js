const routes = require('next-routes')();   // pass a function

routes
.add(
    '/campaigns/new',
    '/campaigns/new',
)

.add(
    '/campaigns/:address',  // when this URL is used in browser
    '/campaigns/show'       // component that we want to use
)

.add(
    '/campaigns/:address/requests',
    '/campaigns/requests/index',
)

.add(
    '/campaigns/:address/requests/new',
    '/campaigns/requests/new',
)

module.exports = routes;
