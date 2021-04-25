import { pipe } from 'fp-ts/lib/function'
import { Monoid } from 'fp-ts/lib/Monoid'
import { foldLeft } from 'fp-ts/lib/ReadonlyArray'
import {
  ReadonlyNonEmptyArray,
  head,
  tail,
} from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { NonEmptyString } from './NonEmptyString'

import deepmerge from 'deepmerge'

export type NestedObject =
  | Record<string, unknown>
  | { [key: string]: NestedObject }

const objectMerge = (a: NestedObject, b: NestedObject): NestedObject =>
  deepmerge(a, b)

export const monoidObjectMerge: Monoid<NestedObject> = {
  concat: objectMerge,
  empty: {},
}

const leafOrBranch = <V>(value: V) =>
  foldLeft<string, V | NestedObject>(
    () => value,
    (h: string, t: ReadonlyArray<string>) => constructObject([h, ...t], value)
  )

export const constructObject = <V>(
  keys: ReadonlyNonEmptyArray<string>,
  value: V
): NestedObject =>
  pipe(
    [head(keys), tail(keys)],
    ([head, tail]: [string, ReadonlyArray<string>]) => ({
      [head]: pipe(tail, leafOrBranch(value)),
    })
  )

export type KeyDecoder = (
  encodedKey: NonEmptyString
) => ReadonlyNonEmptyArray<NonEmptyString>

export const parseNestedObject = (keyDecoder: KeyDecoder) => <V>(
  encodedKey: NonEmptyString,
  value: V
): NestedObject =>
  pipe(encodedKey, keyDecoder, (keys) => constructObject(keys, value))
