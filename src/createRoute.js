/**
 * File that exports middleware generators for each REST method.
 *
 * Similar to the koa-route module except it doesn't send parameters to the handler.
 */

import pathToRegexp from 'path-to-regexp';

/**
 * Generates a middleware given a method.
 *
 * @param {Function} path The route to implement.
 * @param {Function} methods An object that maps HTTP methods to handlers.
 *
 * @return {GeneratorFunction} Middleware representing the next route.
 */
export default function createRoute(path, methods) {
  const keys = []
  const pathRegex = pathToRegexp(path, keys);

  return function* middleware(next) {
    const match = pathRegex.exec(this.path);

    // Check if it matches our route.
    if (match) {
      // Check if our method is matched.
      if (!(this.method.toLowerCase() in methods)) {
        // Return a 405 method not allowed error
        const methodList = Object.keys(methods)
          .map(method => method.toUpperCase())
          .join(',');

        this.status = 405;
        this.set('Allow', methodList);
        return yield* next;
      }

      this.params = this.params || {};
      match.slice(1)
        .filter(param => param)
        .map(decodeURIComponent)
        .forEach((param, index) => this.params[keys[index].name] = param);
      return yield methods[this.method.toLowerCase()].call(this, next);
    }

    // Missed the route url check.
    return yield* next;
  };
}
