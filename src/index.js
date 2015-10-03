import includes from 'lodash/collection/includes';
import intersection from 'lodash/array/intersection';
import keysIn from 'lodash/object/keysIn';
import pathToRegexp from 'path-to-regexp';
import pluralize from 'pluralize';

const VALID_ACTIONS = ['index', 'show', 'create', 'new', 'edit', 'update', 'destroy'];

function* getRESTRoutes(resources, prefix, resourceName = '') {
  const singularizedName = pluralize(resourceName, 1);

  // Determine if this object has actions as properties
  const hasActions = intersection(keysIn(resources), VALID_ACTIONS).length > 0;

  // Iterate through resource object
  for (const key in resources) {
    // If we encounter an action, append a new route
    if (includes(VALID_ACTIONS, key)) {
      switch (key) {
      case 'index': yield {
        method: 'GET',
        url: `${prefix}/${resourceName}`,
        handler: resources.index,
      };
        break;
      case 'show': yield {
        method: 'GET',
        url: `${prefix}/${resourceName}/:${singularizedName}`,
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
        url: `${prefix}/${resourceName}/:${singularizedName}/edit`,
        handler: resources.edit,
      };
        break;
      case 'update': yield {
        method: 'PUT',
        url: `${prefix}/${resourceName}/:${singularizedName}`,
        handler: resources.update,
      };
        break;
      case 'destroy': yield {
        method: 'DELETE',
        url: `${prefix}/${resourceName}/:${singularizedName}`,
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
        innerPrefix = `${prefix}/${resourceName}/:${singularizedName}`;
      } else {
        innerPrefix = `${prefix}/${resourceName}`;
      }

      // Iterate through inner resources
      yield* getRESTRoutes(resources[key], innerPrefix, key);
    }
  }
}

export default function resourceRoutes(resources, prefix = '/') {
  // Get REST routes from resources
  const routes = Array.from(getRESTRoutes(resources, prefix));

  return function* middleware(next) {
    const routeFilter = routes.filter(route => (
      pathToRegexp(route.url).test(this.request.url) &&
        route.method === this.request.method
    )).map(route => {
      const matches = pathToRegexp(route.url).exec(this.request.url);
      const args = matches.slice(1).filter(match => match).map(decodeURIComponent);
      return { ...route, args };
    });

    if (routeFilter.length) {
      for (const route of routeFilter) yield* route.handler.apply(this, route.args);
      return;
    }

    yield* next;
  };
}

