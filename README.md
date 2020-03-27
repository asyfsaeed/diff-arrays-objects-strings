# diff-arrays-objects-strings

> Compare two arrays of objects, finding added, removed, updated and identical objects. Details the differences between updated objects.

## Install

```bash
$ npm install diff-arrays-objects-strings --save
```
## Usage

```js
const diff = require('diff-arrays-objects-strings');
var result = diff(
  [
    {id: 1, name: 'a'},
    {id: 2, name: 'b'},
    {id: 3, name: 'c'},
    {id: 4, name: 'd'},
    {id: 5, name: 'e'}
  ],
  [
    {id: 1, name: 'a'},
    {id: 2, name: 'z'},
    {id: 7, name: 'e'}
  ],
  'id'
);

console.log(result);
// {
//   added: [
//     { id: 7, name: 'e' }
//   ],
//   removed: [
//     { id: 3, name: 'c' },
//     { id: 4, name: 'd' },
//     { id: 5, name: 'e' }
//   ],
//   updated: [
//     { id: 2, name: 'z' }
//   ],
//   same: [
//     { id: 1, name: 'a' }
//   ]
// }

let result = diff(['5d416a0e063cbf4ac130b3b4',
                      '5d416a0e063cbf4ac130b3b5',
                      '5d416a0e063cbf4ac130b3b6',
                      '5d416a0e063cbf4ac130b3b7',
                      '5d416a0e063cbf4ac130b3b8',
                      '5d416a0e063cbf4ac130b3b9',
                      '5d416a0e063cbf4ac130b3ba',
                      '5d416a0e063cbf4ac130b3bb',
                      '5d416a0e063cbf4ac130b3bc',
                      '5d416a0e063cbf4ac130b3bd'],
                      [ '5d416a0e063cbf4ac130b3b8',
                      '5d416a0e063cbf4ac130b3b9',
                      '5c416a0e063cbf4ac130b3ba']);

console.log(result);

{ same: [ '5d416a0e063cbf4ac130b3b8', '5d416a0e063cbf4ac130b3b9' ],
  added: [ '5c416a0e063cbf4ac130b3ba' ],
  updated: [],
  removed:
   [ '5d416a0e063cbf4ac130b3b4',
     '5d416a0e063cbf4ac130b3b5',
     '5d416a0e063cbf4ac130b3b6',
     '5d416a0e063cbf4ac130b3b7',
     '5d416a0e063cbf4ac130b3ba',
     '5d416a0e063cbf4ac130b3bb',
     '5d416a0e063cbf4ac130b3bc',
     '5d416a0e063cbf4ac130b3bd' ] }
```




## API

### diff-arrays-objects-strings (first, second, idField, [options])

#### first

*Required*<br>
Type: `array`

First array to be compared.

#### second

*Required*<br>
Type: `array`

Second array to be compared.

#### idField

*Required*<br>
Type: `string`

The id field that is used to compare the arrays. Defaults to 'id'.

#### options

Type: `object`

```js
{
  compareFunction: <Func> // defaults to lodash's isEqual; must accept two parameters (o1, o2)
  updatedValues: <Number> // controls what gets returned in the "updated" results array:
                          // diff.updatedValues.first (1): the value from the first array
                          // diff.updatedValues.second (2): the value from the second array (default)
                          // diff.updatedValues.both (3): both values, as an array [first, second]
                          // diff.updatedValues.bothWithDeepDiff (4): both values, plus the results of the deep-diff module; [first, second, deep-diff]
}
```

Examples:

```js
const diff = require('diff-arrays-objects-strings');
const first = [{ id: 1, letter: 'a' }];
const second = [{ id: 1, letter: 'b' }];

const result = diff (first, second, idField, { updatedValues: diff.updatedValues.first });
// result.updated is [{ id: 1, letter: 'a' }]

const result = diff (first, second, idField, { updatedValues: diff.updatedValues.second });
// result.updated is [{ id: 1, letter: 'b' }]

const result = diff (first, second, idField, { updatedValues: diff.updatedValues.both });
// result.updated is [{ id: 1, letter: 'a' }, { id: 1, letter: 'b' }]

const result = diff (first, second, idField, { updatedValues: diff.updatedValues.bothWithDeepDiff });
// result.updated is [{ id: 1, letter: 'a' }, { id: 1, letter: 'b' }, { kind: 'E', path: ['letter'], lhs: 'a', rhs: 'b' }]
```

See [deep-diff](https://github.com/flitbit/diff) for more info on deep-diff results

## License

MIT
