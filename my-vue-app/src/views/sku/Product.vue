<template >
    <div>
        <el-form :inline="true" :model="state.searchForm">
            <el-form-item label="商品编码"><el-input v-model="searchForm.id" placeholder="请输入商品编码"/> </el-form-item>
            <el-form-item label="分类编码">
                <el-input type="text" v-model="searchForm.cateGoryId" placeholder="请输入分类编码"/>
            </el-form-item>
            <el-form-item label="状态" style="width: 200px;">
                <el-select v-model="searchForm.status">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">

                    </el-option>
                </el-select>
            </el-form-item >
            <el-form-item>
                <el-button type="primary" icon="Search" @click="">查询</el-button>
            </el-form-item>
     
        </el-form>

    </div>
    <el-table :data="state.tableData">
        <el-table-column prop="id" label="商品编码" width="200px"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="200px"></el-table-column>
        <el-table-column prop="categoryId" label="分类编码" width="200px"></el-table-column>
        <el-table-column prop="description" label="商品描述" width="200px"></el-table-column>
        <el-table-column prop="status" label="状态" width="200px"></el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="200px"></el-table-column>
        <el-table-column prop="updateAt" label="更新时间" width="200px"></el-table-column>
        <el-table0-column label="操作" width="300">
            <template #default="scope" >
                <el-button type="primary" @click="" icon="Edit">编辑</el-button>
                <el-button type="danger" @click="" icon="Delete">删除</el-button>

            </template>
        </el-table0-column>

    </el-table>
</template>  
<script setup lang="ts">
import {ref,unref,reactive,onMounted} from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus';
const state=reactive({
     searchForm:{
        id:null,
        name:null,
        cateGoryId:null,
        status:null,

    },
    tableData:[],
});
const{searchForm,tableData}=unref(state);
onMounted(()=>{

});
const options=[
    {label:"未上架",value:"0"},
    {label:"已上架",value:"1"}
];
</script>