// @ts-nocheck
import { isNotVoid, isPlainObject } from '~/utils'

/**
 * @param { {[key in string]: ((val) => any) | { alias: string, resolver: (val) => any }} } parsers
 * @returns
 */
export const useParseQuery = parsers => {
  const computed = {}
  const keys = Object.keys(parsers)

  keys.forEach(key => {
    const parser = parsers[key]
    let resolver = parser
    let alias = key

    if (isPlainObject(parser)) {
      resolver = parser.resolver || (v => v)
      alias = parser.alias || key
    }

    computed[alias] = function () {
      return isNotVoid(this.$route.query[key])
        ? resolver(this.$route.query[key])
        : resolver('')
    }
  })

  return {
    computed,
  }
}
