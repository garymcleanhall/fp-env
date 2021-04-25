import { pipe } from 'fp-ts/lib/function'
import { concatAll, fromArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { map, some } from 'fp-ts/lib/Option'
import { constructObject, monoidObjectMerge } from '../src/NestedObject'

describe('Nested Object', () => {
  it('Can merge an array of objects', () => {
    const objs = fromArray([
      { a: { b: { c: 1 } } },
      { a: { b: { d: 2 } } },
      { a: { e: { f: 3 } } },
    ])
    const actual = pipe(
      objs,
      map(concatAll(monoidObjectMerge))
    )
    expect(actual).toStrictEqual(some({
      a: {
        b: {
          c: 1,
          d: 2
        },
        e: {
          f: 3
        }
      }
    }))
  })
})

describe('Construct Object', () => {
  it('Can build an linear object from keys', () => {
    expect(constructObject(['a', 'b', 'c'], 1)).toStrictEqual(
      {
        a: {
          b: {
            c: 1
          }
        }
      }
    )
  })
})
