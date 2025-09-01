<template>
    <div class="shop-container">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="logo">购物界面</div>
        <div style="display: flex; align-items: center; gap: 10px;">
        <el-input v-model="search.keyword" placeholder="搜索商品..." class="search-box"/>
        <el-button class="search-btn" @click="onSearch">搜索</el-button>
        </div>
        <el-button class="cart-btn" icon="ShoppingCart" @click="onCart" >购物车({{shoppingCart.cartCount }})</el-button>
      </el-header>
  
      <!-- 轮播图 Banner -->
      <el-carousel height="300px" indicator-position="outside">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <img :src="banner" class="banner-img" />
        </el-carousel-item>
      </el-carousel>
  
      <!-- 商品分类 -->
      <div class="category">
        <el-tag
          v-for="(cat, index) in categories"
          :key="index"
          size="large"
          @click="filterByCategory(cat)"
        >
          {{ cat }}
        </el-tag>
      </div>
  
      <!-- 商品列表 -->
      <el-row :gutter="20" class="product-list">
        <el-col :span="6" v-for="item in products" :key="item.id">
          <el-card shadow="hover" class="product-card">
            <img :src="item.image" class="product-img"/>
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p class="price">￥{{ item.price }}</p>
              <el-button type="success" @click="addToCart(item)">加入购物车</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
  
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="page.total"
          :page-size="page.pageSize"
          v-model:current-page="page.pageNum"
          @current-change="loadProducts"
        />
      </div>
      <el-drawer v-model="state.cartOpen" title="购物车" size="30%">
      <el-empty v-if="cart.items.length===0" description="空空如也~"/>
      <el-scrollbar v-else height="60vh">
        <el-row v-for="item in cart.items" :key="item.productId" class="cart-row">
          <div class="cart-name">{{ item.name }}</div>
          <div class="cart-qty">x{{ item.quantity }}</div>
          <div class="cart-sub">￥{{ item.subtotal }}</div>
        </el-row>
      </el-scrollbar>
      <template #footer>
        <div class="cart-footer">
          <div>合计：<b>￥{{ cart.total }}</b></div>
          <el-button type="primary" :disabled="cart.items.length===0" @click="doCheckout">去结算</el-button>
        </div>
      </template>
    </el-drawer>
      <!-- 底部 -->
      <el-footer class="footer">
        <p>© 2025 MyShop - 版权所有</p>
      </el-footer>
    </div>
  </template>
  
  <script setup>
  import { ref,reactive,unref,onMounted } from 'vue'
  const images = import.meta.glob('@/assets/image/*.{jpg,png}', { eager: true, import: 'default' })
  const state=reactive({
     products:[
    { id: 1, name: 'iPhone 15', price: 6999, image: images['/src/assets/image/iphone15.jpg']},
    { id: 2, name: '华为 Mate 60', price: 5999, image: images['/src/assets/image/mate60.png'] },
    { id: 3, name: '小米电视', price: 2999, image: images['/src/assets/image/xiaomi.jpg' ]},
    { id: 4, name: '耐克运动鞋', price: 899, image: images['/src/assets/image/nike.jpg'] },
  ],
    page:{
        pageNum:1,
        pageSize:5,
        total:4
    },
    banners:[
         images['/src/assets/image/iphone15.jpg'],
         images['/src/assets/image/mate60.png'],
         images['/src/assets/image/xiaomi.jpg'],
         images['/src/assets/image/nike.jpg']
    ],
    categories : ['全部', '手机', '家电', '服装', '数码'],
    search:{
        keyword:null,
    },
    shoppingCart:{
        cartCount:0,
    },
    cartOpen:false,
    cart:{
        total:1,
        items:[{ name: "iPhone", quantity: 1, subtotal: 5000,productId:'100'}],

    },
  })
  const{products,page,banners,categories,search,shoppingCart,cartOpen,cart}=unref(state)
  onMounted(()=>{
  })    
  //点击购物车
  const onCart=()=>{
    console.log("打开购物车")
    state.cart.total=3;
    state.cartOpen=true;
    console.log(cart.items.length,"========");
  }
  const onSearch = () => {
    console.log('搜索关键词:', search.keyword)
  }
  
  const filterByCategory = (cat) => {
    console.log('分类筛选:', cat)
  }
  const doCheckout=()=>{
    console.log("开始进行结算");
  }
  const addToCart = (item) => {
    shoppingCart.cartCount++;
    console.log('加入购物车:', item)
  }
  
  const loadProducts = (page) => {
    console.log('加载第', page, '页商品')
  }
  </script>
  
  <style scoped>
  .shop-container {
    max-width: 100%;
    margin: auto;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-box {
    width: 600px;
    background-color: #fff3f3; /* 浅红背景 */
   border: 1px solid #e74c3c; /* 红色边框 */
   border-radius: 6px;        /* 圆角 */
  }
  .search-btn {
  background-color: #e74c3c !important; /* 红色背景 */
  border-color: #e74c3c !important;     /* 红色边框 */
  color: #fff !important;               /* 文字白色 */
}
  .banner-img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  .category {
    margin: 20px 0;
    display: flex;
    gap: 10px;
  }
  .product-list {
    margin-top: 20px;
  }
  .product-card {
    text-align: center;
  }
  .product-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  .price {
    color: red;
    font-size: 18px;
  }
  .pagination {
    margin: 20px 0;
    text-align: center;
  }
  .footer {
    margin-top: 40px;
    text-align: center;
    color: gray;
  }
  .cart-name {
  flex: 1;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 8px;
}

/* 数量 */
.cart-qty {
  width: 60px;
  text-align: center;
  color: #666;
}

/* 小计 */
.cart-sub {
  width: 80px;
  text-align: right;
  color: #e74c3c;
  font-weight: bold;
}

/* 底部结算区域 */
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
}
.cart-btn {
  background-color: #e74c3c !important; /* 红色背景 */
  border-color: #e74c3c !important;     /* 边框同色 */
  color: #fff !important;               /* 字体白色 */
}
.logo {
    font-size: 20px;
    color: #FF5722; /* 橙色活泼风格 */
}
  </style>
  