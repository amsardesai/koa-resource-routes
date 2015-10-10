
// Placeholder middleware
export function* successPlaceholder(next) {
  this.body = 'success!';
  yield* next;
}

export function parameterCheck(parameterName) {
  return function* middleware(next) {
    const param = this.params[parameterName];
    this.body = `param: ${param}`;
    yield* next;
  }
}

