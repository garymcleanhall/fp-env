import { isNone, isSome } from "fp-ts/lib/Option"
import { fromString } from "../src/NonEmptyString"

describe('NonEmptyString', () => {
  it('can be constructed from a valid string primitive', () => {
    expect(isSome(fromString('Not empty'))).toBeTruthy()
  })

  it('cannot be constructed from an empty string primitive', () => {
    expect(isNone(fromString(''))).toBeTruthy()
  })
})
