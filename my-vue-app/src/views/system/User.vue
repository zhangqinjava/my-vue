<template>
    <div class="user">
        <el-card>
            <Table :data="tableData" :column="tableTitle" :operation="true" :page="page" :loading="loading"
                @onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" @setCellColor="setCellColor">
                    <template #search>
                        <div style="display: flex; align-items: center; gap: 10px;">
                        <el-form-item label="用户名称：" style="margin-bottom: 0;">
                         <el-input v-model="searchForm.username" placeholder="请输入用户名称" style="width: 200px;"></el-input>
                        </el-form-item>
                         <el-button @click="onRefresh" icon="RefreshRight" circle></el-button>
                        <el-button @click="onSearch" type="primary" icon="Search">查询</el-button>
                        <el-button type="primary" @click="onAddUser">添加用户</el-button>
                    </div>
                </template>
                <template #column="scope">
                    <el-button @click="onEdit(scope)" type="text" style="color:var(--edit)">编辑</el-button>
                    <el-button @click="onRole(scope)" type="text" style="color:var(--role)">权限</el-button>
                    <el-button @click="onDelete(scope)" type="text" style="color:var(--delete)">删除</el-button>
                    <el-button @click="onResetPassWord(scope)" type="text" style="color:var(--role)">重置密码</el-button>
                </template>
            </Table>
            <el-dialog title="分配权限" v-model="roleVisible" width="30%" :show-close="false">
                <el-select v-model="roleId" placeholder="请选择角色" style="width: 100%">
                    <el-option v-for="item in  roleData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button @click="roleVisible = false">取消</el-button>
                    <el-button type="primary" @click="onAddUserRole" :loading="roleLoading">确定</el-button>
                    </span>
                </template>
            </el-dialog>

            <el-dialog :title="userTitle" v-model="userVisible" :show-close="false">
                <el-form :model="userForm" :rules="rules" ref="userRuleForm" status-icon label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item prop="username" label="用户名" :rules="[
                                {required: true, message: '请输入名称', trigger: 'blur'},
                                {pattern: /^[a-zA-Z]\w{4,17}$/, message: '以字母开头，长度在5~18之间，只能包含字母、数字', trigger: 'blur'}]">
                                <el-input v-if="operate==0" v-model="userForm.username" placeholder="请输入名称" style="width:260px" ></el-input>
                                <el-input v-if="operate==1" disabled v-model="userForm.username" placeholder="请输入名称" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="nickname" label="昵称" :rules="[{required: true, message: '请输入昵称', trigger: 'blur'}]">
                                <el-input v-model="userForm.nickname" placeholder="请输入昵称" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item prop="type" label="类型" :rules="[{required: true, message: '请选择类型', trigger: 'change'}]">
                                <!-- <el-radio-group v-model="userForm.type" style="width:260px" >
                                    <el-radio v-for="item in userTypeList" :key="item" :label="item.dicValue">{{item.dicLabel}}</el-radio>
                                </el-radio-group> -->
                                <el-select v-model="userForm.type" placeholder="请选择类型" style="width:260px" >
                                   <el-option v-for="item in userTypeList" :key="item.dicValue" :label="item.dicLabel" :value="item.dicValue"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="gender" label="性别" :rules="[{required: true, message: '请选择性别', trigger: 'change'}]" >
                                <el-radio-group v-model="userForm.gender" style="width:260px" >
                                    <el-radio :label="0">男</el-radio>
                                    <el-radio :label="1">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item prop="birthday" label="出生日期">
                                <el-date-picker v-model="userForm.birthday" type="date" placeholder="选择日期" style="width:260px" ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="email" label="邮箱地址">
                                <el-input v-model="userForm.email" placeholder="请输入邮箱地址" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item prop="phone" label="手机号" :rules="
                                [{required: true, message: '请输入手机号', trigger: 'blur'},
                                // 校验精确程度为低
                                //  {pattern: /^(1[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur'}
                                {pattern: /^1[3-9]\d{9}$$/, message: '请输入正确的手机号', trigger: 'blur'}
                                ]
                                ">
                                <el-input v-model="userForm.phone" placeholder="请输入手机号" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="address" label="地址">
                                <el-input v-model="userForm.address" placeholder="请输入地址" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item v-show="operate == 0" prop="password" label="密码" :rules="passwordRules">
                                <el-input v-model="userForm.password" type="password" placeholder="请输入密码" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-show="operate == 0" prop="rePassword" label="确认密码" :rules="[{validator: validatePass, trigger: 'blur'}]">
                                <el-input v-model="userForm.rePassword" type="password" placeholder="请输入确认密码" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remarks">
                                <el-input v-model="userForm.remarks" placeholder="请填写备注" style="width:260px" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="userVisible = false">取消</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>
<script setup>
    import {onMounted, reactive, ref, unref, toRefs} from 'vue'
    import {ElMessage, ElMessageBox} from 'element-plus'
    import Table from '@/components/Table.vue'
    import {dateFormat}from '@/utils/utils.js'
    import {queryUserInfo,dicUser,roleList,userRoleInfo,userRoleAdd,addUser,updateUser,getGroupNameByList,orgList,updatePassWord} from '@/api/systemApi'

    const userRuleForm = ref(null)
    const state = reactive({
        searchForm:{
            username: null,
        },
        loading: false,
        page: {
            current: 1,
            size: 10,
            total: 1,
        },
        tableTitle: [
            {prop:'',label:'',fixed:'left'},
            {prop:'username',label:'名称'},
            {prop:'nickname',label:'昵称'},
            {prop:'type',formatter:'formatterType',label:'类型'},
            {prop:'gender',alias:'genderName',label:'性别'},
            {prop:'birthday',label:'出生日期'},
            {prop:'address',label:'地址'},
            {prop:'phone',label:'手机号'},
            {prop:'openId',label:'微信唯一标识'},
            {prop:'email',label:'邮箱'},
            {prop:'delFlag',alias:'delFlagName',label:'删除状态'},
            {prop:'updateTime',label:'更新时间'},
            {prop:'createTime',label:'创建时间'},
            {prop:'remarks',label:'备注'}
        ],
        tableData:[],
        roleVisible: false,
        roleLoading: false,
        roleData:[],
        roleId: null,
        username: null,
        userVisible: false,
        userTitle: '添加用户',
        operate: 0,
        userTypeList:[],
        userForm:{
            id:'',
            username:'',
            nickname:'',
            type:'',
            gender:'',
            birthday:'',
            address:'',
            phone:'',
            email:'',
            password:'',
            rePassword:'',
            orgId:'',
            remarks:'',
            firstFlag:null,
        },
        orgData:[],
        passwordRules : [{required: true, message: '请输入密码', trigger: 'blur'},
                           {pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,17}$/, message: '至少包含一个大写字母,一个小写字母,一个数字,总长度需要在8到17之间', trigger: 'blur'}],
    })

    const {
        searchForm,loading,page,tableHeight,tableTitle,tableData,statusList,
        roleVisible,roleLoading,roleData,roleId,username,userVisible,userTitle,operate,userTypeList,userForm,orgData,passwordRules
    } = toRefs(state)

    onMounted(() => {
        onUserPage();
        // onOrgList();
    })

    // 初始化数据
    const onUserPage = () =>{
        state.loading = true;
        queryUserInfo(Object.assign(state.page,state.searchForm)).then(res=>{
            state.loading = false;
            state.tableData = res.data.list;
            state.page.current = res.data.pageNum;
            state.page.size = res.data.pageSize;
            state.page.total = res.data.total;
        })
    }
    const onSizeChange = (e) =>{
        state.page.size = e;
        onUserPage();
    }
    const onCurrentChange = (e) =>{
        state.page.current = e;
        onUserPage();
    }
    const onRefresh = () =>{
        state.searchForm = {
            username: null,
        }
        ();
    }
    const onSearch = () =>{
        onUserPage();
    }
    function formatterType(row, column, cellVale,index) {
        return cellValue === 1 ? '超级管理员' : '普通用户'
    }

    // 组织
    const onOrgList = () =>{
        orgList().then(res=>{
            state.orgData = res.result;
        })
    }

   // 编辑
    const onEdit = (val) =>{
        state.userTitle = "修改用户";
        state.operate = 1;
        state.userForm = {
            id: val.column.row.id,
            username: val.column.row.username,
            nickname: val.column.row.nickname,
            type: Number(val.column.row.type),
            gender: Number(val.column.row.gender),
            birthday: val.column.row.birthday,
            address: val.column.row.address,
            phone: val.column.row.phone,
            email: val.column.row.email,
            password: 'p123456',
            rePassword: 'p123456',
            orgId: val.column.row.orgId,
            remarks:val.column.row.remarks,
        }
        onUserTypeList();
        state.userVisible = true;
    }

    // 删除
    const onDelete = (val) =>{
        ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let param = {
                id: val.column.row.id
            }
            dicUser(param).then(res=>{
                if(res){
                    ElMessage.success('删除成功!');
                    onUserPage();
                }
            })
        }).catch(e=>{
            console.log(e)
        })
    }
    // 重置密码
    const onResetPassWord = (val) =>{
        ElMessageBox.confirm('此操作会将用户的密码重置, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let param = {
                id: val.column.row.id,
                password: 'umpay1234',
            }
            updatePassWord(param).then(res=>{
                if(res){
                    ElMessage.success('重置密码成功，重置后密码为:umpay1234');
                    onUserPage();
                }
            })
        }).catch(e=>{
            console.log(e)
        })
    }

    const onRole = (val) =>{
        state.username = null;
        state.roleId = null;
       roleList({status: 1}).then(res=>{
            if(res){
                state.roleData = res.data;
            }
        });
        userRoleInfo({username: val.column.row.username}).then(res=>{
            if(res.data)
                state.roleId = res.data[0].roleId;
            }
        );
        state.username = val.column.row.username;
        state.roleVisible = true;
    }
    const onAddUserRole = () =>{
        userRoleAdd({username: state.username, roleId: state.roleId}).then(res=>{
            if(res){
                ElMessage.success('分配成功！');
            }
        })
        state.roleVisible = false;
    }

    const setCellColor = (e, callback) => {
        /**
         * e.row：表格那一行的数据
         * e.column：表格单元格那一列的信息
         */ 
        if(e.row.delFlag === 0 && e.column.property === 'delFlagName'){
            callback({color: '#67C23A', fontWeight: '700'});
        } else if(e.row.delFlag === 1 && e.column.property === 'delFlagName'){
            callback({color: '#f00', fontWeight: '700'});
        } else {
            callback({});
        }
    }

    // 添加用户信息
    const onAddUser = () =>{
        state.userTitle = "添加用户";
        state.operate = 0;
        state.userForm = {
            id:'',
            username:'',
            nickname:'',
            type:'',
            gender:'',
            birthday:'',
            address:'',
            phone:'',
            email:'',
            password:'',
            rePassword:'',
            orgId:'',
            remarks:'',
            firstFlag:1,
        }
        onUserTypeList();
        state.userVisible = true;
    }

    const validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入确认密码'));
        } else if (value !== state.userForm.password) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
    }

    const onUserTypeList = () =>{
        getGroupNameByList({
            groupName:'user_type'
        }).then(res=>{
            state.userTypeList = res.data;
        });
    }

    const onSubmit = async () =>{
        if(state.operate == 1){
            //密码校验失效
            state.passwordRules = [];
        }
        const form = unref(userRuleForm);
        if (!form) return;
        await form.validate();
        if(state.userForm.birthday instanceof Date){
            state.userForm.birthday = dateFormat(state.userForm.birthday);
        }

        if(state.operate == 0){
            addUser(state.userForm).then(res=>{
                if(res){
                    ElMessage.success({
                        message: '添加成功！',
                        type: 'success'
                    });
                    onUserPage();
                    state.userVisible = false;
                }
            });
        } else {
            state.userForm.password = null;
            updateUser(state.userForm).then(res=>{
                if(res){
                    ElMessage.success({
                        message: '修改成功！',
                        type: 'success'
                    });
                    onUserPage();
                    state.userVisible = false;
                }
            });
        }
        //密码校验生效
        state.passwordRules = [{required: true, message: '请输入密码', trigger: 'blur'},
                           {pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,17}$/, message: '至少包含一个大写字母,一个小写字母,一个数字,总长度需要在8到17之间', trigger: 'blur'}];
    }
</script>
<style lang="scss" scoped>
</style>