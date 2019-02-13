import Router from 'koa-router'
// import Redis from 'koa-redis'
import User from '../dbs/models/users'
import axios from './utils/axios'
import Passport from './utils/passport'
const router = new Router({
  prefix: '/users'
})

// let Store = new Redis().client

// 注册
router.post('/signup', async (ctx) => {
  const {
    username,
    password
  } = ctx.request.body

  let user = await User.find({
    username
  })

  // 用户名已注册
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }

  let newUser = await User.create({
    username,
    password
  })
  if (newUser) {
    const res = await axios.post(`/users/signin`, {
      username,
      password
    })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

// 登录
router.post('/signin', async (ctx, next) => {
  // 调用local策略
  return Passport.authenticate('local', (error, user, info, status) => {
    if (error) {
      ctx.body = {
        code: -1,
        msg: error
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const { username } = ctx.session.passport.user
    ctx.body = {
      user: username
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})
// 退出
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  // 检查是否在登录状态
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})
export default router
