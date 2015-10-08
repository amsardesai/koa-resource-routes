import includes from 'lodash/collection/includes';
import intersection from 'lodash/array/intersection';
import keysIn from 'lodash/object/keysIn';
import pathToRegexp from 'path-to-regexp';

const VALID_ACTIONS = ['index', 'show', 'create', 'new', 'edit', 'update', 'destroy'];

/**
 * A recursive generator function that yields objects representing each route and their handlers.
 *
 * @param {Object} resources Contains all resources and their actions.
 * @param {String} prefix String to prepend to URL when generating routes.
 * @param {String} resourceName Name of the current resource we are processing.
 *
 * @return {Iterable}
 */
function* getRESTRoutes(resources, prefix = '', resourceName = '') {

  // Determine if this object has actions as properties
  const hasActions = intersection(keysIn(resources), VALID_ACTIONS).length > 0;

  // Iterate through resource object
  for (const key in resources) {
    // If we encounter an action, append a new route
    if (includes(VALID_ACTIONS, key)) {
      // Check for invariant violations
      if (typeof resources[key] !== 'function')
        throw Error('Actions must be functions.');
      if (resourceName === '')
        throw Error('Action functions must be put in an object.');

      switch (key) {
      case 'index': yield {
        method: 'GET',
        url: `${prefix}/${resourceName}`,
        handler: resources.index,
      };
        break;
      case 'show': yield {
        method: 'GET',
        url: `${prefix}/${resourceName}/:${resourceName}Param`,
        handler: resources.show,
      };
        break;
      case 'new': yield {
        method: 'GET',
        url: `${prefix}/${resourceName}/new`,
        handler: resources.new,
      };
        break;
      case 'create': yield {
        method: 'POST',
        url: `${prefix}/${resourceName}`,
        handler: resources.create,
      };
        break;
      case 'edit': yield {
        method: 'GET',
        url: `${prefix}/${resourceName}/:${resourceName}Param/edit`,
        handler: resources.edit,
      };
        break;
      case 'update': yield {
        method: 'PUT',
        url: `${prefix}/${resourceName}/:${resourceName}Param`,
        handler: resources.update,
      };
        break;
      case 'destroy': yield {
        method: 'DELETE',
        url: `${prefix}/${resourceName}/:${resourceName}Param`,
        handler: resources.destroy,
      };
        break;
      default:
      }
    } else if (resources !== null && typeof resources === 'object') {
      let innerPrefix;

      // Determine prefix to send to inner resource
      if (resourceName === '') {
        innerPrefix = prefix;
      } else if (hasActions) {
        innerPrefix = `${prefix}/${resourceName}/:${resourceName}Param`;
      } else {
        innerPrefix = `${prefix}/${resourceName}`;
      }

      // Iterate through inner resources
      yield* getRESTRoutes(resources[key], innerPrefix, key);
    }
  }
}

/**
 * Creates the middleware given resources and their actions.
 *
 * @param {Object} resources Contains all resources and their actions.
 *
 * @return {GeneratorFunction} The middleware.
 */
export default function resourceRoutes(resources) {

  // Get REST routes from resources
  const routes = Array.from(getRESTRoutes(resources));

  return function* middleware(next) {
    const routeFilter = routes.filter(route => (
      pathToRegexp(route.url).test(this.request.url) &&
        route.method === this.request.method
    )).map(route => {
      const args = pathToRegexp(route.url)
        .exec(this.request.url)
        .slice(1)
        .filter(match => match)
        .map(decodeURIComponent);
      return { ...route, args };
    });

    if (routeFilter.length) {
      for (const route of routeFilter) yield* route.handler.call(this, next);
      return;
    }

    yield* next;
  };
}
