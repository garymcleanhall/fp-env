import { pipe } from "fp-ts/lib/function"
import { ReadonlyRecord, toReadonlyArray } from 'fp-ts/lib/ReadonlyRecord'
import { map as mapROArray } from 'fp-ts/lib/ReadonlyArray'
import { concatAll } from 'fp-ts/lib/Monoid'
import { fromArray, ReadonlyNonEmptyArray, of, head, tail, map as mapRONEArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { fromString, NonEmptyString } from './NonEmptyString'
import { getOrElse } from "fp-ts/lib/Option"
import { map as mapArray, compact } from "fp-ts/lib/Array"
import { KeyDecoder, monoidObjectMerge, NestedObject, parseNestedObject } from "./NestedObject"
import { Monoid } from "fp-ts/lib/string"

export type Environment = ReadonlyRecord<NonEmptyString, string>

const split = (delimiter: string) => (string: string): string[] =>
  string.split(delimiter)

const toLower = (string: NonEmptyString): NonEmptyString => 
  string.toLowerCase() as NonEmptyString

const capitalizeFirst = (string: NonEmptyString): NonEmptyString =>
  `${string[0].toUpperCase()}${string.slice(1)}` as NonEmptyString

const snakeCaseToCamelCase = (snakeCaseString: NonEmptyString): NonEmptyString =>
  pipe(
    snakeCaseString,
    splitNonEmptyString('_'),
    (parts) => 
      pipe(
        [
          head(parts),
          tail(parts)
        ],
        ([head, tail]: [ NonEmptyString, ReadonlyArray<NonEmptyString> ]) => 
          [head, ...mapROArray(capitalizeFirst)(tail)]
      ),
    concatAll(Monoid),
    fromString,
    getOrElse(() => snakeCaseString)
  )

const splitNonEmptyString = (delimiter: string) => (string: NonEmptyString): ReadonlyNonEmptyArray<NonEmptyString> =>
  pipe(
    string,
    split(delimiter),
    mapArray(fromString),
    compact,
    fromArray,
    getOrElse(() => of(string))
  )

const decodeEnvironmentKey: KeyDecoder = (encodedKey) =>
  pipe(
    encodedKey,
    toLower,
    splitNonEmptyString('__'),
    mapRONEArray(snakeCaseToCamelCase),
  )

const parseEnvironmentEntry = parseNestedObject(decodeEnvironmentKey)

/**
 * Parses a flat environment into a structured recored.
 * @example
 * ```
 * const env = {
 *     "SETTING__ONE": '1',
 *     "SETTING__TWO": '2',
 *     "SETTING__SUB_SETTING__THREE": '3'
 *   }
 *   expect(parseEnvironment(env)).toStrictEqual({
 *     setting: {
 *       one: '1',
 *       two: '2',
 *       subSetting: {
 *         three: '3'
 *       }
 *     }
 *   })
 * ```
 */
export const parseEnvironment = (environment: Environment): NestedObject =>
  pipe(
    environment,
    toReadonlyArray,
    mapROArray(([k, v]) => parseEnvironmentEntry(k, v)),
    concatAll(monoidObjectMerge)
  )
