// 通过设置get设置只读

export default {
  dbs: 'mongodb://127.0.0.1:27017/project',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  }
}
