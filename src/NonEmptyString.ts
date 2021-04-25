import { Monoid } from 'fp-ts/lib/Monoid'
import { Option, some, none } from 'fp-ts/lib/Option'

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol
}

export type NonEmptyString = NonEmptyStringBrand & string

export const fromString = (string: string): Option<NonEmptyString> =>
  string.length > 0 ? some(string as NonEmptyString) : none
