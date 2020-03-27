const deepDiff = require('deep-diff'),
    difference = require('lodash/fp/difference'),
    groupBy = require('lodash/fp/groupBy'),
    isArray = require('lodash/fp/isArray'),
    isEqual = require('lodash/fp/isEqual'),
    isFunction = require('lodash/fp/isFunction'),
    isObject = require('lodash/fp/isObject'),
    keyBy = require('lodash/fp/keyBy'),
    map = require('lodash/fp/map'),
    values = require('lodash/fp/values');

const updatedValues = {
    first: 1,
    second: 2,
    both: 3,
    bothWithDeepDiff: 4,
};

const diff = (first = [], second = [], idField = 'id', options = {}) => {

    // set defaults for "options"
    const opts = {
        compareFunction: isEqual, // set default compareFunction to lodash isEqual
        updatedValues: updatedValues.second, // set default to updatedValues.second
        ...options, // override defaults with user-specified values (if specified)
    };

    // parameter validation
    if (!isArray(first)) throw new Error('diff-arrays-objects-strings error: "first" parameter must be an array but is not');
    if (!isArray(second)) throw new Error('diff-arrays-objects-strings error: "second" parameter must be an array but is not');
    // if (!isString(idField)) throw new Error('diff-arrays-objects-strings error: "idField" parameter must be a string but is not'); 'Removed to accommodate only Object ids and string'
    if (!isObject(options)) throw new Error('diff-arrays-objects-strings error: "options" parameter must be an object but is not');
    if (values(updatedValues).indexOf(opts.updatedValues) === -1) throw new Error('diff-arrays-objects-strings error: "options.updatedValues" must be a one of the ".updatedValues" but is not');
    if (!isFunction(opts.compareFunction)) throw new Error('diff-arrays-objects-strings error: "options.compareFunction" must be a function but is not');

    // arrays to hold the id values in the two arrays
    const firstIds = [];
    const secondIds = [];

    // index the first array by its id values.
    // if first is [{ id: 1, a: 1 }, { id: 2, a: 3 }] then
    // firstIndex will be { 1: { id: 1, a: 1 }, 2: { id: 2, a: 3 } }
    // "getKey" has a side-effect of pushing the id value into firstIds; this saves on another iteration through "first"
    const getKey = (o) => {
        firstIds.push(o[idField] ? o[idField] : o); // ! side-effect
        return o[idField] ? o[idField] : o;
    };

    const firstIndex = keyBy(getKey)(first);

    // "groupingFunction" is the function used in the groupBy in the next step.
    // It has a side-effect of pushing the idField value of second object (o2)
    // into the secondIds array. The side-effect can easily be avoided but it saves another iteration "second"
    const groupingFunction = (o2) => {
        secondIds.push(o2[idField] ? o2[idField] : o2); // ! side-effect
        const o1 = firstIndex[o2[idField] ? o2[idField] : o2]; // take advantage of the closure
        if (!o1) return 'added';
        else if (opts.compareFunction(o1, o2)) return 'same';
        else return 'updated';
    };

    // this creates the "added", "same" and "updated" results
    const result = groupBy(groupingFunction)(second);

    // check what value should be returned for "updated" results
    // updatedValues.second is the default so doesn't have an "if" here
    if (opts.updatedValues === updatedValues.first) {
        result.updated = map(u => firstIndex[u[idField] ? u[idField] : u])(result.updated);
    } else if (opts.updatedValues === updatedValues.both) {
        result.updated = map(u => [firstIndex[u[idField] ? u[idField] : u], u])(result.updated);
    } else if (opts.updatedValues === updatedValues.bothWithDeepDiff) {
        result.updated = map((u) => {
            const f = firstIndex[u[idField] ? u[idField] : u];
            const s = u;
            const dd = deepDiff(f, s);
            return [f, s, dd];
        })(result.updated);
    }

    // now add "removed" and return
    const removedIds = difference(firstIds)(secondIds);
    const removed = map(id => firstIndex[id])(removedIds);
    return { same: [], added: [], updated: [], ...result, removed };
};

diff.updatedValues = updatedValues;

module.exports = diff;
