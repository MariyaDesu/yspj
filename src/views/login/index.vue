<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { LoginApi } from '@/api/loginApi'
import AppFooter from '@/components/common/AppFooter.vue'
import { setToken } from '@/utils/auth/token'
import { getLocal, removeLocal, setLocal } from '@/utils/storage'
import bgImg from '@/assets/images/login_bg.webp'

const title: string = import.meta.env.VITE_APP_TITLE

const router = useRouter()
// const route = useRoute()
// const query = route.query

interface LoginInfo {
  username: string
  password: string
}

const loginInfo = ref<LoginInfo>({
  username: '',
  password: '',
})

const localLoginInfo = getLocal('loginInfo') as LoginInfo
if (localLoginInfo) {
  loginInfo.value.username = localLoginInfo.username || ''
  loginInfo.value.password = localLoginInfo.password || ''
}

const loging = ref<boolean>(false)
const isRemember = useStorage('isRemember', false)
async function handleLogin() {
  const { username, password } = loginInfo.value
  if (!username || !password) {
    window.$message?.warning('请输入用户名和密码')
    return
  }
  try {
    loging.value = true
    const res = await LoginApi.login({ username, password: password.toString() })
    if (res.code === 200) {
      setToken(res.data.token)
      if (isRemember.value)
        setLocal('loginInfo', { username, password })
      else
        removeLocal('loginInfo')

      // if (query.redirect) {
      //   const path = query.redirect as string
      //   Reflect.deleteProperty(query, 'redirect')
      //   router.push({ path, query })
      // }
      // else {
      //   router.push('/')
      // }
      router.push('/')
    }
    else {
      window.$message?.warning(res.message)
    }
  }
  catch (error: any) {
    window.$message?.error(error.message)
  }
  loging.value = false
}
</script>

<template>
  <div
    class="cus-scroll h-full py-15 flex-col overflow-auto bg-cover"
    :style="{ backgroundImage: `url(${bgImg})` }"
  >
    <div m-auto p-15 f-c-c min-w-345 rounded-10 card-shadow bg-white dark:bg-dark bg-opacity-60>
      <div w-380 hidden md:block px-20 py-35>
        <img src="@/assets/images/login_banner.webp" w-full alt="login_banner">
      </div>

      <div w-320 flex-col px-20 py-35>
        <h5 f-c-c text-24 font-normal color="#6a6a6a">
          <icon-custom-logo mr-30 text-50 color-primary />{{ title }}
        </h5>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.username"
            autofocus
            class="text-16 items-center h-50 pl-10"
            placeholder="用户名"
            :maxlength="20"
          />
        </div>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.password"
            class="text-16 items-center h-50 pl-10"
            type="password"
            show-password-on="mousedown"
            placeholder="密码"
            :maxlength="20"
            @keydown.enter="handleLogin"
          />
        </div>

        <div mt-20>
          <n-checkbox :checked="isRemember" label="记住我" :on-update:checked="(val:boolean) => (isRemember = val)" />
        </div>

        <div mt-20>
          <n-button w-full h-50 rounded-5 text-16 type="primary" :loading="loging" @click="handleLogin">
            登录
          </n-button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

