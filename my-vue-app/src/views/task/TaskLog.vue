<template>
    <div class="TaskLog">
        <el-card>
            <Table :data="tableData" :column="tableTitle" :page="page" :loading="loading"
            @onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" @setCellColor="setCellColor" >
            <template #search>
                <div><el-button @click="onClear" type="danger" icon="DeleteFilled">清空日志</el-button>
                <el-button @click="onRefresh" icon="RefreshRight" circle></el-button></div>
            </template>    
        </Table>

        </el-card>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref,toRefs,unref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import Table from '@/components/Table.vue';
import {logPage,logClear} from '@/api/taskApi.js';
const state=reactive({
    loading:false,
    page:{
        pageNum:1,
        pageSize:10,
        total:1,
    },
    tableTitle:[
        {prop:"serverName",label:"任务服务"},
        {prop:"status",label:"任务状态"},
        {prop:'executionTime',label:'执行时间'},
        {prop:'createTime',label:'创建时间'},
        {prop:'remarks',label:'备注'}
    ],
    tableData:[],
})
const {loading,page,tableTitle,tableData} = toRefs(state)
onMounted(() => {
        onTaskLogPage();
})
// 初始化数据
const onTaskLogPage = () =>{
        state.loading = true;
        logPage(state.page).then(res=>{
            state.loading = false;
            state.tableData = res.data.list;
            state.page.pageNum = res.data.pageNum;
            state.page.pageSize = res.data.pageSize;
            state.page.total = res.data.total;
        })
}
const onSizeChange = (e) =>{
        state.page.pageSize = e;
        onTaskLogPage();
    }
    const onCurrentChange = (e) =>{
        state.page.pageNum = e;
        onTaskLogPage();
    }
    const onRefresh = () =>{
        onTaskLogPage();
    }

    const onClear = () =>{
        ElMessageBox.confirm('此操作将永久清空, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            logClear({}).then(res=>{
                if(res){
                    ElMessage.success('操作成功!');
                    onTaskLogPage();
                }
            })
        }).catch(e=>{
            console.log(e)
        })
    }
    const setCellColor = (e, callback) => {
        /**
         * e.row：表格那一行的数据
         * e.column：表格单元格那一列的信息
         */ 
        if(e.row.status === 0 && e.column.property === 'statusName'){
            callback({color: '#67C23A', fontWeight: '700'});
        } else if(e.row.status === 1 && e.column.property === 'statusName'){
            callback({color: '#f00', fontWeight: '700'});
        } else {
            callback({});
        }
    }
</script>
<style lang="scss" scoped>
</style>