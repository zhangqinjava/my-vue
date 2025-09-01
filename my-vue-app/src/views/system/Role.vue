<template>
    <div class="role">
        <el-card>
            <Table :data="tableData" :column="tableTitle" :page="page" :operation="true" :loading="loading"
                @onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" 
                @onSwitchChange="onSwitchChange">
                <template #search>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <el-form-item label="名称：" style="margin-bottom: 0;">
                            <el-input v-model="searchFrom.name" style="width: 200px;"></el-input>
                        </el-form-item >
                        <el-form-item label="类型：" style="margin-bottom: 0;">
                            <!-- <el-input v-model="searchFrom.type" style="width: 200px;"></el-input> -->
                            <el-select v-model="searchFrom.type" placeholder="请选择类型" style="width: 200px;">
                                <el-option label="平台角色" :value=0></el-option>
                                <el-option label="非平台角色"  :value=1></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态：" style="margin-bottom: 0;">
                            <el-select v-model="searchFrom.status" placeholder="请选择状态" style="width: 200px;">
                            <el-option label="未启用" :value=0></el-option>
                            <el-option label="启用" :value=1></el-option>
                        </el-select>
                        </el-form-item >
                        <el-button type="primary" native-type="submit" @click="onRolePage">查询</el-button>
                        <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
                    </div>
                </template>
                <template #column="scope">
                    <el-button @click="onEdit(scope)" type="text" style="color:var(--edit)">编辑</el-button>
                    <el-button @click="onRole(scope)" type="text" style="color:var(--role)">权限</el-button>
                    <el-button @click="onDelete(scope)" type="text" style="color:var(--delete)">删除</el-button>
                </template>
            </Table>
            <el-dialog :title="title" v-model="addRoleVisible" width="30%" :show-close="false">
                <el-form :model="addRoleForm" :rules="rules" ref="addRoleRuleForm" label-position="right" label-width="100px">
                    <el-form-item label="角色名称" prop="name" :rules="[{required: true, message: '角色名称不能为空', trigger: 'blur'}]">
                        <el-input v-model="addRoleForm.name" placeholder="请输入角色名称" style="width:90%"></el-input>
                    </el-form-item>
                    <el-form-item label="角色类型" prop="type" :rules="[{required: true, message: '请选择角色类型', trigger: 'change'}]">
                        <el-select v-model="addRoleForm.type" placeholder="请选角色类型" style="width:90%">
                            <el-option label="平台角色" :value=0></el-option>
                            <el-option label="非平台角色" :value=1></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button @click="addRoleVisible = false">取消</el-button>
                    <el-button type="primary" @click="onAddRole">确定</el-button>
                    </span>
                </template>
            </el-dialog>
            <el-dialog title="分配权限" v-model="roleVisible" width="30%" :show-close="false">
                <el-tree :data="roleTrees" show-checkbox node-key="id" ref="roleTree"
                    :default-checked-keys="checkedKeys"
                    :props="{children: 'children',label: 'chineseName'}">
                </el-tree>
                <template #footer>
                    <span class="dialog-footer">
                    <el-button @click="roleVisible = false">取消</el-button>
                    <el-button type="primary" @click="onAddMenuRole" :loading="roleLoading">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>
<script setup>
    import {onMounted, reactive, ref, unref, toRefs} from 'vue'
    import {ElMessage, ElMessageBox} from 'element-plus'
    import Table from '../../components/Table.vue'
    import {getCheckTreeIds} from '../../utils/utils.js'
    import {roleFind,delRole,saveRole,updateRole,menuRoleList,menuRoleAdd} from '../../api/systemApi.js'
    
    const addRoleRuleForm = ref(null)
    const roleTree = ref(null)
    const state = reactive({
        loading: false,
        searchFrom:{
            name:null,
            status:null,
            startTime:null,
            endTime:null,
            type:null,
            current: 1,
            size: 10,
            total: 0,

        },
        page: {
            current: 1,
            size: 10,
            total: 0,
        },
        tableTitle: [
            {prop:'id',label:'编码'},
            {prop:'name',label:'名称'},
            {prop:'type',alias:'typeName',label:'类型'},
            {prop:'status',alias:'statusName',label:'状态',
                type:'switch',
                option:{
                    activeValue:1,activeColor:'#13ce66',activeText:'是',
                    inactiveValue:0,inactiveColor:'#ff4949',inactiveText:'否'
                }
            },
            {prop:'updateTime',label:'更新时间'},
            {prop:'createTime',label:'创建时间'},
        ],
        tableData:[],
        operate: 1,
        title: '新增角色',
        addRoleVisible: false,
        addRoleForm: {
            id: null,
            name:null,
            type:null,
            status:null
        },
        roleLoading: false,
        roleVisible: false,
        roleTrees:[],
        checkedKeys:[],
        roleId: null,
    })
    const {
        loading,page,tableHeight,tableTitle,tableData,
        operate,title,addRoleVisible,addRoleForm,roleLoading,roleVisible,roleTrees,checkedKeys,roleId,searchFrom    } = toRefs(state)

    onMounted(()=>{
        onRolePage();
    })

    const onRolePage = () =>{
        state.loading = true;
        roleFind(Object.assign(state.searchFrom)).then(res=>{
            if(res){
                state.loading = false;
                state.tableData = res.data.list;
                state.page.current = res.data.pageNum;
                state.page.size = res.data.pageSize;
                state.page.total = res.data.total;
            }
        })
    }
  
    const onSizeChange = (e) =>{
        state.searchFrom.size = e;
        onRolePage();
    }
    const onCurrentChange = (e) =>{
        state.searchFrom.current = e;
        onRolePage();
    }
    const onSwitchChange = (row) =>{
        updateRole({id:row.id, status: row.status}).then(res=>{
            if(res){
                ElMessage.success("操作成功！");
                onRolePage();
            }
        })
    }

    const onAdd = () =>{
        state.addRoleForm = {
            id: '',
            name: '',
            type: ''
        }
        state.operate = 1;
        state.title = '添加角色';
        state.addRoleVisible = true;
    }
    const onAddRole = async () =>{
        if(state.operate == 1){
            const form = unref(addRoleRuleForm);
            if(!form) return;
            await form.validate();
            state.addRoleForm.status=1;
            saveRole(state.addRoleForm).then(res=>{
                if(res){
                    state.addRoleVisible = false;
                    ElMessage.success('添加成功！');
                    state.addRoleForm = {
                        id: '',
                        name:'',
                        type:''
                    };
                    onRolePage();
                }
            })
        } else if (state.operate == 2) {
            updateRole(state.addRoleForm).then(res=>{
                if(res){
                    state.addRoleVisible = false;
                    ElMessage.success('更新成功！');
                    onRolePage();
                    state.addRoleForm = {
                        id: '',
                        name:'',
                        type:''
                    };
                }
            })
        }
    }
    const onEdit = (val) =>{
        state.addRoleForm = {
            id: val.column.row.id,
            name: val.column.row.name,
            type: Number(val.column.row.type)
        }
        state.operate = 2;
        state.title = '编辑角色';
        state.addRoleVisible = true;
    }
    const onDelete = (val) =>{
        ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            delRole({id: val.column.row.id}).then(res=>{
                if(res){
                    ElMessage.success({
                        type: 'success',
                        message: '删除成功!'
                    });
                    onRolePage();
                }
            })
        }).catch(e=>{
            console.log(e)
        })
    }

    const onRole = (val) =>{
        state.roleTrees = [];
        state.checkedKeys = [];
        menuRoleList({roleId: val.column.row.id}).then(res=>{
            if(res){
                state.roleTrees = res.data;
                state.checkedKeys = getCheckTreeIds(res.data);
                state.roleId = val.column.row.id;
                state.roleVisible = true;

                // console.log(getCheckTreeIds(res.result))
            }
        })
    }
    const onAddMenuRole = () =>{
        const keys = unref(roleTree);
        if(keys.getCheckedKeys().length == 0){
            ElMessage.error("请先选择菜单！");
            return false;
        }
        state.roleLoading = true;
        let param = {
            roleId: state.roleId,
            menuIds: keys.getCheckedKeys()
        }
        menuRoleAdd(param).then(res=>{
            if(res){
                ElMessage.success("分配权限成功！");
                state.roleLoading = false;
                state.roleVisible = false;
            }
        })
    }
</script>
<style lang="scss" scoped>
    .role{
        
    }
</style>