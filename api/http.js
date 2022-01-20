const axios = require('axios').default
const { ERR_CODE_OK } = require('@shopflex/utils')

const baseURL =
  process.env.NODE_ENV !== 'production' ? '/api' : process.env.BASE_URL || ``

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  transformRequest: [data => JSON.stringify(data)],
  withCredentials: true,
  timeout: process.env.API_TIMEOUT || 30 * 1000,
})

instance.interceptors.response.use(res => {
  return {
    ...res.data,
    status: res.status,
  }
})

instance.interceptors.response.use((data = {}) => {
  const code = data.code || ERR_CODE_OK
  return code === ERR_CODE_OK
    ? Promise.resolve({ ...data.data, responseStatus: data.status })
    : // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        message: data.message,
        responseStatus: data.status,
      })
})

module.exports = instance
