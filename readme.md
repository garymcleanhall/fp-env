# fp-env

## Functional Programming - Environment

Environment parser.

**Example:**

```ts
import { parseEnvironment } from 'fp-env'

const env = {
    "SETTING__ONE": '1',
    "SETTING__TWO": '2',
    "SETTING__SUB_SETTING__THREE": '3'
  }
  expect(parseEnvironment(env)).toStrictEqual({
    setting: {
      one: '1',
      two: '2',
      subSetting: {
        three: '3'
      }
    }
  })
```
