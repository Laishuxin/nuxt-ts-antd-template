// @ts-nocheck
import type Vue from 'vue'

import { isDef } from '~/utils'
let id = 1

export const DEFAULT_TIMEOUT = 8 * 1000
export const USE_LOADING_IS_IDLE = 'isIdle'
export const USE_LOADING_IS_LOADING = 'isLoading'
export const USE_LOADING_IS_SUCCESS = 'isSuccess'
export const USE_LOADING_IS_ERROR = 'isError'
export const USE_LOADING_SET_LOADING = 'setLoading'
export const USE_LOADING_SET_LOADING_ASYNC = 'setLoadingAsync'

export const USE_LOADING_STAT_LOADING = 'LOADING'
export const USE_LOADING_STAT_SUCCESS = 'SUCCESS'
export const USE_LOADING_STAT_ERROR = 'ERROR'
export const USE_LOADING_STAT_IDLE = 'IDLE'

const DEFAULT_OPTIONS = {
  timeout: DEFAULT_TIMEOUT,
  timeoutCallback: undefined,
  isIdle: USE_LOADING_IS_IDLE,
  isLoading: USE_LOADING_IS_LOADING,
  isSuccess: USE_LOADING_IS_SUCCESS,
  isError: USE_LOADING_IS_ERROR,
  setLoading: USE_LOADING_SET_LOADING,
  setLoadingAsync: USE_LOADING_SET_LOADING_ASYNC,
}

/**
 * Create mixin function.
 * Usage: const instance = new Vue({ mixins: [useLoading(options)] })
 * @default {timeout=8000}
 * @default {timeoutCallback=undefined}
 * @default {isIdle='isIdle'}
 * @default {isLoading='isLoading'}
 * @default {isSuccess='isSuccess'}
 * @default {isError='isError'}
 * @default {setByLoadingPromise='setLoadingByPromise'}
 * @default {setLoading='setLoading'}
 * @returns { Vue.ComponentOptions }
 */
export const useLoading = (
  options: Partial<
    typeof DEFAULT_OPTIONS & {
      timeoutCallback: (instance?: Vue, ...args: any[]) => any
    }
  > = {},
) => {
  const {
    timeout,
    timeoutCallback,
    isLoading,
    isError,
    isIdle,
    isSuccess,
    setLoadingAsync,
    setLoading,
  } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const stat = `@@useLoading-stat-${id++}`

  return {
    data() {
      return {
        [stat]: USE_LOADING_STAT_IDLE,
      }
    },
    computed: {
      [isIdle]() {
        return this[stat] === USE_LOADING_STAT_IDLE
      },
      [isLoading]() {
        return this[stat] === USE_LOADING_STAT_LOADING
      },
      [isSuccess]() {
        return this[stat] === USE_LOADING_STAT_SUCCESS
      },
      [isError]() {
        return this[stat] === USE_LOADING_STAT_ERROR
      },
    },
    methods: {
      [setLoadingAsync](promise) {
        if (!(promise instanceof Promise)) {
          return Promise.reject(promise)
        }

        let timer = setTimeout(() => {
          this[stat] = USE_LOADING_STAT_IDLE
          timer = undefined
          if (timeoutCallback) {
            timeoutCallback(this)
          }
        }, timeout)

        this[stat] = USE_LOADING_STAT_LOADING
        promise
          .then(res => {
            this[stat] = USE_LOADING_STAT_SUCCESS
            return res
          })
          .catch(e => {
            this[stat] = USE_LOADING_STAT_ERROR
            throw e
          })
          .finally(() => {
            if (isDef(timer)) {
              clearTimeout(timer)
              timer = undefined
            }
          })

        return promise
      },
      [setLoading](isLoading = false) {
        this[stat] = isLoading
          ? USE_LOADING_STAT_LOADING
          : USE_LOADING_STAT_IDLE
      },
    },
  }
}
