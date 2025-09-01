<template>
	<div class="login" :style="loginStyle">
		<el-card shadow="always">
			<div class="login-main">
				<div class="login-logo">
					<el-image :src="loginLogo"  style="width: 100%; height: 110%;"></el-image>
				</div>
				<div class="login-form">
					<div v-if="!isLoggedIn" >
						<div class="login-form-title">欢迎运营平台</div>
						<el-form ref="userRef" :model="loginForm" :rules="accountRules">
							<el-form-item >
								<el-input v-model="loginForm.username" prefix-icon="User" placeholder="请输入用户名称" style="width:100%"></el-input>
							</el-form-item>
							<!--登录密码不做长度和规则校验，因为没有注册功能无需添加-->
							<el-form-item>
								<el-input type="password" v-model="loginForm.password" prefix-icon="Lock" show-password placeholder="请输入密码" style="width:100%"></el-input>
							</el-form-item>
							<!-- <div v-if="isLoggedInCheck">
								<el-form-item prop="phone">
									<el-input placeholder="请输入手机号" prefix-icon="PhoneFilled" v-model="loginForm.phone" style="width:100%"/>
								</el-form-item>
								<el-form-item prop="phoneCode">
									<el-input placeholder="请输入验证码" prefix-icon="List" v-model="loginForm.phoneCode" style="width:60%"></el-input>
									<el-button v-if="state.countdownRef == null" type="primary"  @click="handleClick(state.tabIndex)" round class="get-code-button">发送验证码</el-button>
									<el-button v-if="state.countdownRef != null"  type="primary" round class="get-code-button" >{{ state.countdownRef }}秒后重试</el-button>
								</el-form-item> 
							</div> -->
							<el-form-item v-if="!isLoggedInCheck" prop="verifyStatus" :rules="[{required: true,message: '请拖动滑块验证',trigger: 'blur'}]">
								<SlidingVerify ref="slidingVerify" :status="loginForm.verifyStatus" :successFun="onVerifySuccess" :errorFun="onVerifyError"></SlidingVerify>
							</el-form-item>
							<el-form-item>
								<el-checkbox v-model="loginForm.keepPassword" label="记住密码"></el-checkbox>
							</el-form-item>
						</el-form>
					</div>
					<!-- <div v-if="isLoggedIn" class="login-form-title"> -->
						<!-- <div class="login-form-title">手机号登录</div>
						<el-form ref="phoneRef" :model="loginForm" :rules="accountRules">
							<el-form-item prop="phone">
								<el-input placeholder="请输入手机号" prefix-icon="PhoneFilled" v-model="loginForm.phone" style="width:100%"/>
							</el-form-item> 
							<el-form-item prop="phoneCode">
								<el-input placeholder="请输入验证码" prefix-icon="List" v-model="loginForm.phoneCode" style="width:60%"></el-input>
								<el-button v-if="state.countdownRef == null" type="primary"  @click="handleClick(state.tabIndex)" round class="get-code-button">发送验证码</el-button>
								<el-button v-if="state.countdownRef != null"  type="primary" round class="get-code-button" >{{ state.countdownRef }}秒后重试</el-button>
							</el-form-item> 
							<el-form-item prop="verifyStatus">
								<SlidingVerify ref="slidingVerify" :status="loginForm.verifyStatus" :successFun="onVerifySuccess" :errorFun="onVerifyError"></SlidingVerify>
							</el-form-item>
						</el-form>
						<div class="right-aligned">
							<el-tooltip placement="bottom" >
								<span v-bind:style="{ fontSize: '12px', color: '#666',align: 'right' }">收不到验证码?</span>
								<template #content>
									自定义内容 -->
									<!-- <p>1.检查手机的垃圾短信里面是否有.</p> -->
									<!-- <p>2.短信发送频繁,触发垃圾短信限制,请间隔2分钟左右再试.</p> -->
								<!-- </template> -->
							<!-- </el-tooltip> -->
						<!-- </div> -->
					<!-- </div> -->
					<el-form-item>
						<el-button type="primary" class=".btn-black"round @click="submit(state.tabIndex)" style="width:100%">登录</el-button>
					</el-form-item>
					<div v-if="!authentication" >
						<el-divider><el-icon><star-filled /></el-icon></el-divider>
					</div>
					<div v-if="authentication" >
						<el-divider> <span  v-bind:style="{ fontSize: '12px', color: '#666'}" >其他认证方式</span></el-divider>
						<div class="button-container">
							<template v-for="(button, index) in buttons" :key="button.text">
								<el-button :type="button.type" link :class="{ hidden: !button.visible }" @click="hideButton(button)">
									{{ button.text }}
								</el-button>
								<template v-if="index < buttons.length - 1 && buttons[index + 1].visible && button.visible">
									<span class="separator">|</span>
								</template>
							</template>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script setup>
	import {onBeforeMount,reactive,ref,toRefs,unref,onMounted} from "vue"
	import {ElMessage} from 'element-plus'
	import {useRouter} from 'vue-router'
	import {useUserStore, useTokenStore,useTimeStore} from '@/store/settings'
	import {login} from '@/api/systemApi'
	import SlidingVerify from '@/components/SlidingVerify.vue'

	const userStore = useUserStore();
	const tokenStore = useTokenStore();
	const router = useRouter()
	const timeStore = useTimeStore()
	let userRef = ref(null) 
	let phoneRef = ref(null)
	let slidingVerify = ref(60)
	//用于倒计时的本地变量，同时与 localStorage 同步
	const loginLogo = new URL('@/assets/image/image.png', import.meta.url).href
	const state = reactive({
		loginStyle: {
			height: '',
		},
		//登录页面切换
		buttons:[{ text: '账号登录', type: '', visible: false, index: 0},{ text: '手机号登录', type: '', visible: true,index: 1 }],
		//账密登录是否添加手机号要素校验
		isLoggedInCheck:false,
		//认证方式是否也开启手机号登录
		isLoggedIn:false,
		//页面显示其他认证显示是否开启
		authentication:false,
		//倒计时
		countdownRef:null,
		//页面登录标识 0：账号登录 1：手机号登录
		tabIndex:0,
		loginForm: {
			username: '',
			password: '',
			phone: '',
			phoneCode: '',
			verifyStatus: null,
			keepPassword: null,
			//表单提交标识 0：账号登录 1：手机号登录
			loginTabs: '0',
		},
		loginMode: true,
		otherForm: {
			modes:[
			],
			qrcodeTitle: '',
			qrcodeUrl: '',
			status: 0,
		},
		socket: null,
		socketUrl: 'ws://localhost:8005/AssetManagement/ws/',
	})

	const {loginStyle,loginForm,loginMode,otherForm,socket,socketUrl,getCodeText,elButtonDisabled,holdTime,tabIndex,isLoggedIn,buttons,authentication,isLoggedInCheck} = toRefs(state)

	/**加载焦点之前 */
	onBeforeMount(() => {
		state.loginStyle.height = (document.body.clientHeight || document.documentElement.clientHeight) + "px"
	})

	/**初始化数据 */
	onMounted(() => {
      const time = timeStore.getTime;
      if (time) {
        startCountdown(time);
      }
	//   lookStatus().then(res=>{
	// 		if(res.code == 200){
	// 			let result = res.result
	// 			if(result.elementLoginStatus == '1'){
	// 				state.isLoggedInCheck = true;
	// 			}
	// 		}
	// 	}).catch((e)=>{
	// 		console.log(e)
	// 	})
    });

	/**校验规则 */
	const accountRules = {
		username: [{required: true,message: '请输入用户名',trigger: 'blur'},{pattern: /^[a-zA-Z]\w{4,17}$/,message: '用户名格式有误，请重新输入',trigger: 'blur'}],
		// password: [{required: true,message: '请输入密码',trigger: 'blur'},{pattern: /^[a-zA-Z]\w{5,17}$/,message: '密码格式有误，请重新输入',trigger: 'blur'}],
		phone: [{required: true,message: '请输入手机号',trigger: 'blur'},{pattern: /^\d{11}$/,message: '手机号格式有误，请重新输入',trigger: 'blur'}],
		verifyStatus: [{required: true,message: '请拖动滑块验证',trigger: 'blur'}],
	  };
	  
	const onVerifySuccess = (e) =>{
		state.loginForm.verifyStatus = e;
	}
	const onVerifyError = (e) =>{
		state.loginForm.verifyStatus = e;
	}
	
	 // 开始倒计时的方法
	const startCountdown = (data) => {
      let intervalId;
	  state.countdownRef = data;
      const timer = setInterval(() => {
        state.countdownRef--;
        if (state.countdownRef <= 0) {
          clearInterval(intervalId);
          state.countdownRef = null; // 重置倒计时
          timeStore.delTime(); // 移除本地存储的倒计时
        } else {
		  timeStore.setTime(state.countdownRef); // 更新本地存储的倒计时
        }
      }, 1000);

      intervalId = timer; // 保留 intervalId 以便停止计时器
    };

	/**验证码倒计时进行储存 */
	const handleClick = async (tab) =>{
		// console.log(tab)
		// //校验表单信息
		// const currentFormRef = tabsVali(tab)
		// if (!currentFormRef) return;
		// await currentFormRef.validate();

		// //入参
		// let param = {
		// 	username: state.loginForm.username,
		// 	phone: state.loginForm.phone,
		// 	// verifyStatus: state.loginForm.verifyStatus,
		// 	loginTabs: state.loginForm.loginTabs,
		// }
		// //获取验证码
		// verificationCode(param).then(res=>{
		// 	if(res.code == 200){
		// 		//定时查询
		// 		startCountdown(59);
		// 		ElMessage.success("获取验证码成功")
		// 	}
		// }).catch(()=>{
		// 	// state.loginForm.verifyStatus = null;
		// 	// slidingVerify.value.onRefresh()
		// })
		
	}

	/**tabs切换触发 */
	const hideButton = (button) => {
		//手机号登录暂时不需要
		// state.isLoggedIn = !state.isLoggedIn
		//滑动回滚
		state.loginForm.verifyStatus = null;
		state.tabIndex = button.index;
		//账号登录
		if(state.tabIndex == 0){
			state.buttons = [{ text: '账号登录', type: '', visible: false, index: 0},{ text: '手机号登录', type: '', visible: true,index: 1 }]
		}else{
			state.buttons = [{ text: '账号登录', type: '', visible: true, index: 0},{ text: '手机号登录', type: '', visible: false,index: 1 }]
		}
	}

	const tabsVali=(tab)=>{
		let currentFormRef = unref(null);
		if(tab == 0){
			//账号密码登录
			currentFormRef =  unref(userRef)
			state.loginForm.loginTabs = '0';
		}else{
			//手机号登录
			currentFormRef =  unref(phoneRef)
			state.loginForm.password = null;
			state.loginForm.username = null;
			state.loginForm.loginTabs = '1';
		}
		return currentFormRef

	}

	//登录
	const submit = async (tab) => {
		//校验表单信息
		let currentFormRef = tabsVali(tab)
		if (!currentFormRef) return;
		await currentFormRef.validate();

		if(state.isLoggedInCheck && state.loginForm.phoneCode == ''){
			ElMessage.warning('验证码未填写')
			return
		}
		//入参
		let param = {
			username: state.loginForm.username,
			password: state.loginForm.password,
			loginTabs: state.loginForm.loginTabs,
			phone: state.loginForm.phone,
			phoneCode: state.loginForm.phoneCode,
			// verifyStatus: state.loginForm.verifyStatus,
		}
		
		login(param).then(res=>{
			if(res.code == 200){
				// 存储用户信息和token
				userStore.setUser(res.data);
				tokenStore.setToken(res.data.token);
				timeStore.delTime();
				router.push({path: 'main'});
			}
		}).catch(()=>{
			state.loginForm.verifyStatus = null;
			slidingVerify.value.onRefresh()
		})
	}

	const otherLogin = (type) =>{
		// 1、微信，2、微博，3、QQ，4、GitHub
		let modes = state.otherForm.modes;
		if(type === 1){
			let mode = modes.find(function(item){
				return item.id == type;
			});
			state.otherForm.qrcodeTitle = mode.name;

			// 请求接口获取二维码
			let id = '';
			state.otherForm.status = 0;
			wxLogin({}).then(res=>{
				if(res){
					
					userStore.delUser();
					 tokenStore.delToken();
					
					state.otherForm.qrcodeUrl = res.result.qrcode;
					// 建立 socket 连接
					let url = state.socketUrl + res.result.state;
					webSocket(url)
				} else {
					ElMessage.warning(res.message)
				}
			})
			state.loginMode = false;
		} else {
			ElMessage.warning("暂不支持该登录方式！")
		}
	}

	const webSocket = (url) =>{
		if ('WebSocket' in window) {
			state.socket = new WebSocket(url);
			state.socket.onmessage = function (event) {
				let resp = JSON.parse(event.data);
				if(resp.status == 200){
					state.otherForm.status = 1;
					// 存储用户信息和token
					userStore.setUser(resp);
					tokenStore.setToken(resp.token);
					router.push({path: 'main'});
				} else {
					state.otherForm.status = 2;
				}
			}
			state.socket.onopen = function () {
				console.log('连接已建立')
			}
			state.socket.onclose = function () {
				console.log('连接已关闭')
			}
			state.socket.onerror = function () {
				console.log('连接异常,尝试重新连接')
				webSocket();
			}
			window.onbeforeunload = function () {
				state.socket.onclose();
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">

	/* 下划线切换高亮 */
	::v-deep .el-tabs__active-bar {
	 background-color: #242e42;
	 padding: 0 34px;
  	 box-sizing: border-box !important;
 	 background-clip: content-box !important;
	}

	/* 鼠标选中时样式 */
	::v-deep .el-tabs__item.is-active {
	color: #242e42;
	font-size: 18px;
	font-weight: bold;
	opacity: 1;
	}

	// /* 鼠标悬浮时样式 */
	// ::v-deep .el-tabs__item:hover {
	// color: #242e42;
	// cursor: pointer;
	// font-size: 18px;
	// font-weight: bold;
	// opacity: 1;
	// }

	/* 设置文字颜色为灰色 */
	.custom-tooltip .el-tooltip__popper {
	color: gray !important; 
	font-size: 12px; /* 设置一个较小的字体大小，具体的最小值取决于你的项目全局样式 */
	}
	
	.button-container {
		display: flex;
     align-items: center; /* 使按钮与分隔符垂直居中 */
     justify-content: center; /* 使按钮与分隔符水平居中（如果需要） */
     gap: 2px; /* 调整按钮与分隔符之间的间距，根据实际需求更改数值 */
	}

   .separator {
	margin: 0 20px; /* 调整分隔符左右两侧的间距，使其与按钮内容保持适当距离，根据实际需求更改数值 */
     font-size: 14px; /* 设置分隔符字体大小，与按钮文字保持一致或根据设计要求调整 */
     line-height: 1; /* 确保分隔符与按钮文字垂直对齐 */
   }
   
	/* 添加间隔 */
	.get-code-button {
	margin-left: 5px; 
	}
	/**右对齐*/
	.right-aligned {
		text-align: right;
	}
	::v-deep .el-tabs__item {
		color: #2c2929;
		opacity: 0.5;
	}
	.hidden {
	display: none;
	}
	.login {
		background-image: url('../../assets/image/login-bg.svg');
		background-size: 100% 100%;
		height: 200%;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		.el-card__body{
			padding: 0;
		}
		.login-main{
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			.login-logo{
				background: var(--theme);
				width: 20rem;
				padding: 8rem 5rem;
				border-top-right-radius: 38px;
				border-bottom-right-radius: 38px;
			}
			.login-form{
				width: 20rem;
				padding: 8rem 5rem;
				.login-form-title{
					font-size: 20px;
					font-weight: 700;
					text-align: center;
					padding-bottom: 2rem;
				}
				.btn-black {
  				  background-color: #25786e !important;  /* hover 深一点 */
 					 border-color: #25786e !important;
  					color: white !important;
				}
				.other-login{
					text-align: center;
				}
			}
			.other-form{
				text-align: center;
				.el-image{
					padding: 2px;
					border: 2px solid #67C23A;
					border-radius: 4px;
				}
			}
		}
	}
</style>
