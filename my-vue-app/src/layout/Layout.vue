<template>
    <el-container class="layout-container">
        <el-aside :style="{height: defaultHeight+'px'}" :width="asideWidth" style="padding-bottom:4rem;">
            <el-card v-show="!isCollapse" shadow="always">
                <div>
                    <el-icon :size="26" style="vertical-align: middle;"><OfficeBuilding/></el-icon>
                    <span class="system-title">运营管理平台</span>
                </div>
            </el-card>
            <el-menu router :default-active="$route.path" :collapse="isCollapse" @select="onSelect"
            text-color="#444" active-text-color="#e74c3c" background-color="#fff">>
                <template v-for="item in routers" :key="item">
                    <el-menu-item v-if="!item.children " :index="item.type == 1 ? item.path:''">
                        <el-icon v-if="item.icon" style="vertical-align: middle;">
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span v-if="item.type == 1" style="vertical-align: middle;">{{item.chineseName}}</span>
                        <span v-else-if="item.type == 2" @click="onNestedLink(item)" style="vertical-align: middle;">{{item.chineseName}}</span>
                        <a v-else-if="item.type == 3" :href='item.url' target='_blank' style="vertical-align: middle;text-decoration: none;color:#242e42;">{{item.chineseName}}</a>
                    </el-menu-item>
                    <Submenu v-else :data="item"></Submenu>
                </template>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header height="50">
                <div class="header">
                    <div style="padding-left: 0.4rem;">
                        <el-icon @click="onCollapse" :size="20" style="vertical-align: middle; cursor: pointer;">
                            <component :is="isCollapse?'Expand':'Fold'"></component>
                        </el-icon>
                        <el-icon :size="16" color="#55bc8a" style="vertical-align: middle;padding-left:2rem;">
                            <Timer/>
                        </el-icon>
                        <span style="padding-right: 2rem;vertical-align: middle;">{{nowTimes}}</span>
                    </div>
                    <div style="padding-right:0.4rem;">
                        <el-dropdown style="line-height: 60px;">
                            <span class="el-dropdown-link" style="color:var(--theme);">
                                <span style="cursor:pointer;vertical-align: middle;">{{username}} 欢迎您</span>
                                <el-icon style="vertical-align: middle;"><arrow-down /></el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-if="elementLoginType" @click="elementLogin" icon="Lock">{{ elementLoginTexe }}</el-dropdown-item>
                                    <el-dropdown-item @click="onPassword" icon="Lock">修改密码</el-dropdown-item>
                                    <el-dropdown-item @click="onLogout" icon="SwitchButton">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-dialog v-model="dialogPass" title="修改密码" width="35%" :destroy-on-close="true" :show-close="false">
                            <el-form :model="passForm" :rules="rules" ref="validateForm" status-icon label-width="100px">
                                <el-form-item label="原始密码" prop="oldPassword" :rules="[{required: true, message: '原始密码不能为空', trigger: 'blur'}]">
                                    <el-input class="input-size" type="password" v-model="passForm.oldPassword" prefix-icon="Lock" autocomplete="off" style="width:100%"/>
                                </el-form-item>
                                <el-form-item label="新密码" prop="password" :rules="[
                                    {required: true, message: '请输入新密码', trigger: 'blur'},
                                    {pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,17}$/, message: '至少包含一个大写字母,一个小写字母,一个数字,总长度需要在8到17之间', trigger: 'blur'}]">
                                    <el-input class="input-size" type="password" v-model="passForm.password" prefix-icon="Lock" autocomplete="off" style="width:100%"/>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="rePassword" :rules="[{validator: validatePass, trigger: 'blur'}]">
                                    <el-input class="input-size" type="password" v-model="passForm.rePassword" prefix-icon="Lock" autocomplete="off" style="width:100%"/>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="dialogPass = false">取消</el-button>
                                    <el-button type="primary" @click="onPassSubmit">立即修改</el-button>
                                </span>
                            </template>
                        </el-dialog>
                        <el-dialog v-model="dialogPassFlag" title="修改密码" width="30%" :destroy-on-close="true" :show-close="false" :close-on-click-modal="false">
                            <el-form :model="passForm" :rules="rules" ref="validateForm" status-icon label-width="100px">
                                <el-form-item label="原始密码" prop="oldPassword" :rules="[{required: true, message: '原始密码不能为空', trigger: 'blur'}]">
                                    <el-input class="input-size" type="password" v-model="passForm.oldPassword" prefix-icon="Lock" autocomplete="off" style="width:100%"/>
                                </el-form-item>
                                <el-form-item label="新密码" prop="password" :rules="[
                                    {required: true, message: '请输入新密码', trigger: 'blur'},
                                    {validator: validatePassFirst, trigger: 'blur'},
                                    {pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,17}$/, message: '至少包含一个大写字母,一个小写字母,一个数字,总长度需要在8到17之间', trigger: 'blur'}]">
                                    <el-input class="input-size" type="password" v-model="passForm.password" prefix-icon="Lock" autocomplete="off" style="width:100%"/>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="rePassword" :rules="[{validator: validatePass, trigger: 'blur'}]">
                                    <el-input class="input-size" type="password" v-model="passForm.rePassword" prefix-icon="Lock" autocomplete="off" style="width:100%"/>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button type="primary" @click="onPassSubmit">修改密码</el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </div>
                </div>
                <TabsMenu></TabsMenu>
            </el-header>
            <el-main :style="{height: defaultHeight+'px'}">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
                <iframe v-show="iframe.isIframe" :src="iframe.src" :style="{height:(defaultHeight-110)+'px'}" width="100%" frameborder="0"></iframe>
            </el-main>
        </el-container>
        <el-backtop target=".el-main"></el-backtop>
    </el-container>
</template>
<script setup>
    import {onBeforeMount, onMounted, onDeactivated, reactive, ref, unref, toRefs} from 'vue'
    import {ElMessage, ElMessageBox} from 'element-plus'
    import {useRouter} from 'vue-router'
    import Submenu from "../components/Submenu.vue"
    import TabsMenu from "../components/TabsMenu.vue"
    import {useUserStore, useTokenStore, useMenuStore,useTimeStore} from '../store/settings'
    import {timeFormate} from '../utils/utils.js'
    import {modifyPass,logout,enablePhoneElements} from '../api/systemApi.js'

    const router = useRouter()
    const userStore = useUserStore();
    const tokenStore = useTokenStore();
    const menuStore = useMenuStore();
    const timeStore = useTimeStore();
    const username = userStore.getUser.username == null ? '未登录':userStore.getUser.username;
    const nowTimes = ref('');
    const validateForm = ref(null)
    const state = reactive({
        isCollapse: false,
        asideWidth: '240px',
        defaultHeight: null,
        routers: [],
        dialogPass: false,
        passForm: {
            oldPassword: '',
            password: '',
            rePassword: '',
            firstFlag:0,
        },
        //是否有要素开启的权限
        elementLoginType:false,
        //要素开启的文字提示
        elementLoginTexe:'',
        //要素当前状态 1：开启 2为关闭
        elementLoginStatus:'',
        iframe: {
            isIframe: true,
            src: '',
        },
        dialogPassFlag:false,
    })

    const {
        logo,isCollapse,asideWidth,defaultHeight,routers,dialogPass,passForm,iframe,elementLoginTexe,elementLoginType,elementLoginStatus,dialogPassFlag
    } = toRefs(state)

    onBeforeMount(() => {
        state.defaultHeight = (document.body.clientHeight || document.documentElement.clientHeight);

    })

    onMounted( ()=>{
        if(userStore.getUser.type == 0 ){
            state.elementLoginType = true;
            refreshElement(userStore.getUser.elementLoginStatus);
        }
    //自适应窗口
	// if(window.screen.width > 1200){
	// 	function bodyScale(){
	// 		let deviceWidth = document.documentElement.clientWidth;
	// 		let scale = deviceWidth / 1920;
	// 		document.body.style.zoom = scale;
	// 	}
	// 	window.onload = window.onresize = function(){
	// 		bodyScale();
	// 	}
	// }
        if (location.href.indexOf("#reloaded") == -1) {
			location.href = location.href + "#reloaded";
            localStorage.setItem("loadFlag",true);
		}
        // 获取菜单
		//menuStore.delMenu();

    //   if(userStore.getUser.firstFlag !=1 && !userStore.getUser.isMoreFlag){
        state.routers = menuStore.getMenu;
        console.log("test:{}",state.routers);
    //   }
        onNowTimes();
      if( userStore.getUser.isMoreFlag && localStorage.getItem("loadFlag")){
          ElMessage.warning("登录密码超过三个月需要重新修改密码！");
      }
        if((userStore.getUser.firstFlag==1 || userStore.getUser.isMoreFlag) && localStorage.getItem("loadFlag")){
            state.dialogPassFlag = true;

        }
        window.addEventListener('resize', onDefaultHeight);

    })

    onDeactivated(()=>{
        window.removeEventListener('resize', onDefaultHeight, false)
    })
    /**刷新显示按钮 */
    const refreshElement = (elementLoginStatus) => {
        //是否开启还是关闭
        if(elementLoginStatus == '1'){
            state.elementLoginTexe = '登录要素关闭'
            state.elementLoginStatus = '2'
        }else{
            state.elementLoginTexe = '登录要素开启'
            state.elementLoginStatus = '1'
        }
    }
    const onDefaultHeight = () =>{
        state.defaultHeight = window.innerHeight
    }


    const onNestedLink = (val) =>{
        state.iframe.isIframe = true;
        state.iframe.src = val.url;
    }

    const onSelect = (e) =>{
        if(e){
            state.iframe.isIframe = false;
        }
    }

    const onCollapse = () => {
        if (state.isCollapse) {
            state.asideWidth = '240px'
            state.isCollapse = false
        } else {
            state.isCollapse = true
            state.asideWidth = '64px'
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 退出
    const onLogout = () =>{
        ElMessageBox.confirm('您确定要退出吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            logout({}).then(res=>{
                if(res){
                    // 清除相关缓存信息
                    userStore.delUser();
                    tokenStore.delToken();
                    menuStore.delMenu();
                    timeStore.delTime();
                    router.push({path: 'login'})
                }
            });
        }).catch(e=>{
            console.log(e)
        })
    }

    // 当前时间
    const onNowTimes = () =>{
        setInterval(()=>{
            nowTimes.value = timeFormate(new Date());
        },1000);
    }

    // 修改密码
    const onPassword = () =>{
        state.passForm = {
            oldPassword: '',
            password: '',
            rePassword: '',
            firstFlag: 0,
        }
        state.dialogPass = true;
    }

    // 要素开关
    const elementLogin = () =>{
        ElMessageBox.confirm('此操作设置登录要素, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let param = {
                id:  userStore.getUser.id,
                elementLoginStatus: state.elementLoginStatus
            }
            enablePhoneElements(param).then(res=>{
                if(res.code == 200){
                    //修改本地缓存 中的开启功能
                    userStore.updateUserElementLoginStatus(state.elementLoginStatus);
                    //刷新功能
                    refreshElement(state.elementLoginStatus);
                    ElMessage.success('操作成功!');
                }
            })
        }).catch(e=>{
            console.log(e)
            if(e != 'cancel'){
                ElMessage.warning('操作失败!');
            }
        })
    }

    const validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== state.passForm.password) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    }
    const validatePassFirst = (rule, value, callback) => {
       if((userStore.getUser.firstFlag==1 || userStore.getUser.isMoreFlag) && state.passForm.password==state.passForm.oldPassword){
            callback(new Error('新密码和原密码不能一样!'))
        }else {
            callback()
        }
    }
    const onPassSubmit = async () => {
        const form = unref(validateForm)
        if (!form) return;
        await form.validate();
        state.passForm.username = userStore.getUser.username;
        modifyPass(state.passForm).then(res=>{
            if(res){
                ElMessageBox.alert('修改密码成功，需重新登录！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                        if ('confirm' == action) {
                            router.push({path: 'login'});
                        }
                    }
                })
            }
        });
    }

</script>
<style lang="scss">
    .layout-container{
        .el-header{
            padding: 0;
            background: var(--bg1);

            .header{
                display: flex;
                justify-content: space-between;
                line-height: 50px;
                color: var(--theme);
                // border:1px transparent solid;
                // border-image:linear-gradient(to right,var(--bg1),#DCDFE6,var(--bg1)) 1 10;
                // box-shadow: 0 4px 8px 0 rgba(36,46,66,.06)!important;
                padding-right: 0.4rem;
                
                .el-dialog__header{
                    background: var(--theme);
                    padding: 0 10px;
                    .el-dialog__title{
                        color: var(--theme);
                    }
                }
            }
        }

        .el-aside{
            height: 100%;
            transition: all .5s;
            background: var(--bg1);
            overflow-y: auto;
            overflow-x: hidden;
            .el-menu{
                border: none;
                .el-menu-item, .el-sub-menu__title{
                    height: 40px;
                    line-height: 40px;
                }
                .el-sub-menu__title:hover{
                    background: var(--bg1) !important;
                }
                .el-menu-item:hover{
                    background: var(--bg1) !important;
                }
            }
            .el-card{
                margin: 0.4rem 0.6rem;
                background-color: var(--theme);
                color:#fff;
                .el-card__body{
                    padding: 1rem 2rem;
                }
            }
        }
        .el-aside::-webkit-scrollbar{
            width: 0px;
        }
        .el-main{
            padding: 0;
            overflow-x: hidden;
            overflow-y: auto;
            background: var(--bg1);
            .el-dialog__header{
                background: var(--theme);
                padding: 10px;
                .el-dialog__title{
                    color: #fff;
                }
            }
        }
        .el-main::-webkit-scrollbar{
            width: 0px;
        }
   }
   .system-title {
    vertical-align: middle;
    padding-left: 1rem;
    font-size: 15px;
    font-weight: bold;
    background: linear-gradient(90deg, #e74c3c, #ff9800);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>