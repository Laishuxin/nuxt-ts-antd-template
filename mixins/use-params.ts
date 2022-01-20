// @ts-nocheck
import { isNotVoid, isPlainObject } from '~/utils'

export const useParseParams = (parsers: {
  [key in string]:
    | ((val: any) => any)
    | { alias: string; resolver(val: any): any }
}) => {
  const computed = {}
  const keys = Object.keys(parsers)

  keys.forEach(key => {
    const parser = parsers[key]
    let resolver = parser
    let alias = key

    if (isPlainObject(parser)) {
      resolver = parser.resolver ?? (v => v)
      alias = parser.alias ?? key
    }

    computed[alias] = function () {
      return isNotVoid(this.$route.params[key])
        ? resolver(this.$route.params[key])
        : resolver('')
    }
  })

  return {
    computed,
  }
}
