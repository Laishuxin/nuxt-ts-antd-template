// @ts-nocheck
import type { Options } from 'promise-memoize'

import memoize from 'promise-memoize'
const memo = new Set()

export function clearPromiseMemo() {
  memo.forEach(m => m.clear())
  memo.clear()
}

export function promiseMemoize<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options: Options,
): Fn {
  const memoizedFn = memoize(fn, options)
  memo.add(memoizedFn)
  return memoizedFn
}
