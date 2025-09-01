<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
</script> -->

<!-- <template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template> -->
<!-- <template>
  <h1>Hello Vue 3!</h1>
  <MyPage />
</template> -->
<!-- <template>
  <div>
    <h1>首页1</h1>
    <el-button type="primary" @click="goToMyPage">去新页面</el-button>
  </div>
</template> -->
<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goToMyPage = () => {
  router.push('/my-page') // 跳转到 /my-page
}
</script>
<!-- 
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->
<style >
 :root{
    /* 颜色 */
    --theme: #242e42;

    /* 背景色 */
    --bg1: #eff4f9;

    /* 文字颜色 */
    --t1: #fff;
    --t2: #f4f4f4;
    --t3: #ededed;
    --t4: #d8d8d8;
    --t5: #b3b3b3;
    --t6: #999;
    --t7: #666;
    --t8: #3d3d3d;
    --t9: #181818;

    /* 操作颜色 */
    --delete: #f56c6c;
    --edit: #0084ff;
    --add: #63ba4d;
    --query: #909399;
    --down: #E6A23C;
    --upper: #67C23A;
    --role: #006000;
  }
  
  html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 14px;
  }

  #nprogress .bar {
    /*自定义进度条颜色*/
    background: var(--theme) !important;
  }
</style>