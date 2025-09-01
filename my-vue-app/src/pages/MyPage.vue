<template>
  <div class="login-page">
    <!-- 背景动画 -->
    <div class="bg-wrapper">
      <svg
        version="1.1"
        baseProfile="full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 800"
      >
        <!-- 这里粘你的 rect, path, circle 动画代码 -->
      </svg>
    </div>

    <!-- 登录表单 -->
    <div class="login-form-wrapper">
      <el-form
        ref="userRef"
        :model="loginForm"
        :rules="accountRules"
        label-width="80px"
        class="login-form"
      >
        <h2 class="title">系统登录</h2>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const userRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const accountRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const onSubmit = () => {
  userRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('登录成功')
    }
  })
}

const onReset = () => {
  userRef.value.resetFields()
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.login-form-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.login-form {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
