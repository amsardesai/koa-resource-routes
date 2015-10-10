/**
 * File that exports middleware generators for each REST method.
 *
 * Similar to the koa-route module except it doesn't send parameters to the handler.
 */

import pathToRegexp from 'path-to-regexp';
import methods from 'methods';

/**
 * Returns a function that returns a middleware given a method name.
 *
 * @param {string} method Name of the HTTP method, i.e GET
 *
 * @return {Function} A function that creates a middleware.
 */
function createMethod(method) {
  /**
   * Generates a middleware given a method.
   *
   * @param {string} path Path of the route, including url params.
   *
   * @return {GeneratorFunction} Middleware representing the next route.
   */
  return function createMiddleware(path, handler) {
    const pathRegex = pathToRegexp(path);
    const { keys } = pathRegex;
    return function* middleware(next) {
      // Check to see if this is the route we want.
      if (this.method !== method) return yield* next;

      const match = pathRegex.exec(this.path);

      // Check if it matches our route.
      if (match) {
        this.params = this.params || {};
        match.slice(1)
          .filter(param => param)
          .map(decodeURIComponent)
          .forEach((param, index) => this.params[keys[index].name] = param);
        return yield handler.call(this, next);
      }

      // Missed the route url check.
      return yield* next;
    };
  };
}

// Create empty routes object
const routes = {};

// Create each method that needs to be created
methods
  .map(method => method.toUpperCase())
  .forEach(method => routes[method] = createMethod(method));

// Map `del` to `delete`
routes.del = routes.delete;

// Export completed routes object
export default routes;

