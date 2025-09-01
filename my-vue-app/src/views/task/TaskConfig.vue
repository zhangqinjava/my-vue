

<template>
    <div class="task-config">
        <el-card>
            <Table :data="tableData" :column="tableTitle" :operation="true" :page="page" :loading="loading"
            @OnSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" @onSwitchChange="onSwitchChange">
            <template #search>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <el-form-item label="任务名称:" style="margin-bottom:0;">
                        <el-input v-model="searchForm.name" placeholder="请输入名称" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" style="margin-bottom:0;">
                        <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px;">
                            <el-option
                                v-for="item in status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-button @click="onRefresh" icon="RefreshRight" circle></el-button>
                    <el-button @click="onSearch" type="primary" icon="Search">查询</el-button>
                    <el-button type="primary" @click="onAddTask">创建任务</el-button></div>
            </template>
            <template #column="scope">
                <el-button @click="onTrigger(scope)" type="text" style="color:var(--down)">手动触发</el-button>
                <el-button @click="onEdit(scope)" type="text" style="color:var(--edit)">编辑</el-button>
                <el-button @click="onDelete(scope)" type="text" style="color:var(--delete)">删除</el-button>
            </template>
            </Table>
        </el-card>
        <el-dialog :title="taskTitle" v-model="taskVisible" width="40%" :show-close="false">
            <el-form :model="taskForm" :rules="rules" ref="addRuleForm" label-position="left" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="12">
                <el-form-item label="任务名称" prop="name" :rules="[{required: true, message: '任务名称不能为空', trigger: 'blur'}]">
                <el-input v-model="taskForm.name" placeholder="请输入任务名称"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="服务名称" prop="code" :rules="[{required: true, message: '服务名称不能为空', trigger: 'blur'}]">
                    <el-input v-model="taskForm.code" placeholder="请输入服务名称"  />
                </el-form-item>
            </el-col>
            </el-row>
            <el-row :gutter="20">
               <el-col :span="12">
                <el-form-item label="cron表达式" prop="expression" :rules="[{required: true, message: '执行时间不能为空', trigger: 'blur'}]">
                    <el-input v-model="taskForm.expression" placeholder="请输入执行时间"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重试次数" prop="retryCount" >
                    <el-input v-model="taskForm.retryCount" placeholder="请输入重试次数"></el-input>
                </el-form-item>
            </el-col>
            
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                <el-form-item label="是否启用" prop="status">
                    <el-switch
                        v-model="taskForm.status"
                        :active-value="1"
                        :inactive-value="0"
                        active-text="启用"
                        inactive-text="禁用"
                        :width="60"
                        />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="重试间隔(秒)" prop="retryInterval" >
                    <el-input v-model="taskForm.retryInterval" placeholder="请输入重试间隔"></el-input>
                </el-form-item>
            </el-col>
            </el-row>
                <el-form-item label="任务描述" prop="remarks">
                    <el-input v-model="taskForm.remarks" type="textarea" placeholder="请输入任务描述" :rows="3" maxlength="100" show-word-limit style="width:100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="taskVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref,toRefs,unref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus'
import Table from '../../components/Table.vue';
import {taskPage,updateTask,triggerTask,delTask,saveTask} from '@/api/taskApi.js';
const addRuleForm = ref(null)
const state=reactive({
    tableTitle:[
        {prop:'taskId',label:'任务编码'},
        {prop:'code',label:'任务服务'},
        {prop:'name',label:'任务名称'},
        {prop:'expression',label:'执行时间'},
        {prop:'status',alias:'statusName',label:'状态',
            type:"switch",
            option:{
                activeValue:1,activeColor:'#13ce66',activeText:'启用',
                inactiveValue:0,inactiveColor:"#ff4949",inactiveText:"禁用"
            }

        },
        {prop:'retryCount',label:"重试次数"},
        {prop:'retryInterval',label:"重试间隔(秒)"},
        {prop:'creater',label:"创建人"},
        {prop:'updateTime',label:'更新时间'},
        {prop:'createTime',label:'创建时间'},
        {prop:'remarks',label:'备注'}

    ],
    tableData:[],
    taskVisible:false,
    page:{
        pageSize:20,
        pageNum:1,
        total:1,
    },
    loading:false,
    searchForm:{
        name: null,
        status: null,
     },
    taskForm:{
        id: null,
        code: null,
        name: null,
        expression: null,
        status: 1,
        remarks: null,
        retryCount: null,
        retryInterval: null,
    }
})
const {
        searchForm,loading,page,tableHeight,tableTitle,tableData,
        taskVisible,taskTitle,taskForm
    } = toRefs(state)
onMounted(()=>{

})
// 初始化数据
const onTaskPage = () =>{
    state.loading = true;
    taskPage(Object.assign(state.page,state.searchForm)).then(res=>{
        state.loading = false;
        state.tableData = res.data.list;
        if(res.data){
            state.page.pageNum = res.data.pageNum;
            state.page.pageSize = res.data.pageSize;
            state.page.total = res.data.total;
        }
       
    })
}
const status=[
    {label:"全部",value:null},
    {label:"可用",value:1},
    {label:"不可用",value:0}
]
const onSizeChange = (e) =>{
        state.page.pageSize = e;
        onTaskPage();
    }
    const onCurrentChange = (e) =>{
        state.page.pageNum = e;
        onTaskPage();
    }
    const onRefresh = () =>{
        state.searchForm = {
            name: null,
        }
        onTaskPage();
    }
    const onSearch = () =>{
        onTaskPage();
    }

    // 添加
    const onAddTask = () =>{
        state.taskTitle = "创建任务";
        state.taskForm = {
            id: null,
            code: null,
            name: null,
            expression: null,
            status: 1,
            remarks: null,
            retryCount: 0,
            retryInterval: 0,
        }
        state.taskVisible = true;
    }

    // 编辑
    const onEdit = (val) =>{
        state.taskTitle = "修改任务";
        state.taskForm = {
            id: val.column.row.id,
            code: val.column.row.code,
            name: val.column.row.name,
            expression: val.column.row.expression,
            status:val.column.row.status,
            retryCount:val.column.row.retryCount,
            retryInterval:val.column.row.retryInterval,
            remarks: val.column.row.remarks
        }
        state.taskVisible = true;
    }

    const onSubmit = async () =>{
        const form = unref(addRuleForm);
        if(!form) return;
        await form.validate();
        if (state.taskForm.id == null || state.taskForm.id == '') {
            // 添加
            saveTask(state.taskForm).then(res => {
                if (res) {
                    ElMessage.success('添加成功!');
                }
            });
        } else {
            // 修改
            updateTask(state.taskForm).then(res => {
                if (res) {
                    ElMessage.success('修改成功!');
                }
            });
        }
        state.taskVisible = false;
        onTaskPage();
    }

    // 删除
    const onDelete = (val) =>{
        ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let param = {
                id: val.column.row.id
            }
            delTask(param).then(res=>{
                if(res){
                    ElMessage.success('删除成功!');
                    onTaskPage();
                }
            })
        }).catch(e=>{
            console.log(e)
        })
    }
const onSwitchChange = (row) =>{
    updateTask({id:row.id, status: row.status}).then(res=>{
        if(res){
            ElMessage.success("操作成功！");
            onTaskPage();
        }
    })
}
 // 手动触发
 const onTrigger = (val) =>{
      ElMessageBox.confirm('确定执行【' + val.column.row.name + '】此任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: val.column.row.id,
          code: val.column.row.code,
          taskId: val.column.row.taskId
        }
        triggerTask(param).then(res=>{
          if(res.data){
            ElMessage.success('手动触发成功!');
            onTaskPage();
          }
        })
      }).catch(e=>{
        console.log(e)
      })
    }
</script>
<style lang="scss" scoped>
</style>