// @ts-nocheck
export const USE_SET_NAME = 'set'
export const USE_SET_ADD = 'add'
export const USE_SET_HAS = 'has'
export const USE_SET_CLEAR = 'clear'
export const USE_SET_REMOVE = 'remove'

const USE_SET_DEFAULT_OPTIONS = {
  name: USE_SET_NAME,
  add: USE_SET_ADD,
  has: USE_SET_HAS,
  clear: USE_SET_CLEAR,
  remove: USE_SET_REMOVE,
}

// 让 Set 中的方法自动触发响应式
export const useSet = (
  options: Partial<typeof USE_SET_DEFAULT_OPTIONS> = {},
) => {
  const { name, add, has, clear, remove } = {
    ...USE_SET_DEFAULT_OPTIONS,
    ...options,
  }

  return {
    data() {
      return {
        [name]: new Set(),
      }
    },
    methods: {
      [add](key) {
        if (!this[name].has(key)) {
          this[name] = new Set([...this[name], key])
        }
      },
      [remove](key) {
        if (this[name].has(key)) {
          this[name].delete(key)
          this[name] = new Set(this[name])
        }
      },
      [has](key) {
        return this[name].has(key)
      },
      [clear]() {
        this[name] = new Set()
      },
    },
  }
}
