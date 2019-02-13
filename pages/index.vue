<template>
  <section class="container">
    <div>
      <div>
        <h3>登陆</h3>
        <a-input v-model="name" size="large" placeholder="large size" />
        <a-input v-model="word" size="large" placeholder="large size" />
        <a-button type="primary" block @click="login">login</a-button>
      </div>
      <div>
        <h3>注册</h3>
        <a-input v-model="username" size="large" placeholder="large size" />
        <a-input v-model="password" size="large" placeholder="large size" />
        <a-button type="primary" block @click="register">register</a-button>
      </div>
    </div>
  </section>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  data: () => {
    return {
      username: '',
      password: '',
      name: '',
      word: ''
    }
  },
  methods: {
    login() {
      if (!this.name || !this.word) {
        this.$message.warning('请输入姓名和账号')
        return false
      }
      this.$axios
        .post('/users/signin', {
          username: encodeURIComponent(this.name),
          // MD5加密，由于MD5方法返回的是一堆数组，需要通过toString转为字符串
          password: CryptoJS.MD5(this.word).toString()
        })
        .then(({ status, data }) => {
          if (status === 200) {
            if (data && data.code === 0) {
              this.$message.success(data.msg)
            } else {
              this.$message.warning(data.msg)
            }
          } else {
            this.$message.error(`服务器出错，错误码：${status}`)
          }
          // 定时清空error信息
          setTimeout(() => {
            this.error = ''
          }, 1500)
        })
        .catch(error => {
          console.log(error)
        })
    },
    register() {
      if (!this.username || !this.password) {
        this.$message.warning('This is a normal message')
        return false
      }
      this.$axios
        .post('/users/signup', {
          username: encodeURIComponent(this.username),
          // MD5加密，由于MD5方法返回的是一堆数组，需要通过toString转为字符串
          password: CryptoJS.MD5(this.password).toString()
        })
        .then(({ status, data }) => {
          if (status === 200) {
            if (data && data.code === 0) {
              this.$message.success(data.msg)
            } else {
              this.$message.warning(data.msg)
            }
          } else {
            this.$message.error(`服务器出错，错误码：${status}`)
          }
          // 定时清空error信息
          setTimeout(() => {
            this.error = ''
          }, 1500)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  async mounted() {
    const {
      status,
      data: { user }
    } = await this.$axios.get('/users/getUser').then()
    if (status === 200) {
      console.log(user)
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
