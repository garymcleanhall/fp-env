import { parseEnvironment } from '../src/Environment'

describe('Parse Environment', () => {
  it('Can parse the environment to a nested object', () => {
    const env = {
      SETTING__ONE: '1',
      SETTING__TWO: '2',
      SETTING__SUB_SETTING__THREE: '3',
    }
    expect(parseEnvironment(env)).toStrictEqual({
      setting: {
        one: '1',
        two: '2',
        subSetting: {
          three: '3',
        },
      },
    })
  })
})
