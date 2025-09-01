<template>

    <div>
    <el-form :inline="true" :model="searchForm">
        <el-form-item label="分类编码">
            <el-select
                v-model="state.searchForm.id"
                filterable
                remote
                reserve-keyword
                collapse-tags 
                collapse-tags-tooltip
                clearable
                placeholder="请选择分类"
                :remote-method="remoteMethod"
                :loading="state.loading"
                style="width: 200px;"
                @change="handleChange"
            >
                <el-option
                    v-for="item in state.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                <template #default>
                    <span style="float: left">{{ item.name }}</span>
                     <span style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">{{ item.id }}</span>
                </template>
         
                </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="父类编码"><el-input type="text" placeholder="请输入父类编码" v-model="searchForm.parentId">
        </el-input></el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSearch" icon="Search" >查询</el-button>
            <el-button type="primary" @click="addSku" icon="Plus" >添加</el-button>
            <el-button type="primary" @click="onExport" icon="Download" >导出</el-button>

        </el-form-item>
    </el-form>
    <el-table :data="state.treeData"
    border
    row-key="id":tree-props="{ children: 'children', hasChildren: 'children' }"
    style="width: 100%" v-loading="loading" >   
    <el-table-column  prop="id"  align='left' label="分类编码" width="250"  />
    <el-table-column prop="name" align='center'label="分类名称" width="300" />
    <el-table-column prop="parentId"align='center' label="父分类编码" width="200" />
    <el-table-column prop="createdAt" align='center'label="创建时间" width="200"></el-table-column>
    <el-table-column prop="updatedAt" align='center'label="更新时间" width="200"></el-table-column>
    <el-table-column label="操作"align='center' width="300">
      <template #default="scope">
        <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)">编辑</el-button>
        <el-button type="primary" size="small" icon="Plus" @click="add(scope.row)">添加</el-button>
        <el-button type="danger" size="small" icon="Delete"@click="remove(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        :page-size="page.pageSize"
        :page-sizes="[20,50,100]"
        :current-page="page.pageNum"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;">
      </el-pagination>
    </div>
    <el-dialog   v-model="state.addVisit" title="添加商品分类" :close-on-click-model="false" width="30%">
        <el-form :model="state.addForm" label-width="100px" :rules="rules" ref="addRule" >
            <el-form-item label="分类名称" prop="name" :rules="[{required: true,message: '请输入分类名称',trigger: 'blur'}]">
                <el-input v-model="state.addForm.name" placeholder="请输入分类名称"  style="width: 200px;"></el-input>
            </el-form-item>    
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary"  @click="onSubmit" icon="Check" :loading="loading">提交</el-button>
                    <el-button type="danger" @click="state.addVisit=false" icon="Close">取消</el-button>
                </span>
        </template>
    </el-dialog>
    <el-dialog v-model="state.editVisit" title="商品分类修改" :close-on-click-model="false" width="50%">
        <el-form :model="state.editForm" label-width="100px" :rules="rules" ref="editRule">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="分类编码" prop="id" >
                        <el-input v-model="state.editForm.id" placeholder="请输入商品编码" style="width: 200px;" readonly></el-input>
                     </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="分类名称" prop="name" :rules="[{required:true ,message:'请输入分类名称',trigger:'blur'}]">
                        <el-input v-model="state.editForm.name" placeholder="请输入分类名称" style="width: 200px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
           <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="父分类编码" prop="parentId" :rules="[{required:true,message:'父分类编码不能为空',trigger:'blur'}]">
                    <el-input v-model="state.editForm.parentId" placeholder="请输入父类编码" style="width: 200px;"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="创建时间" prop="createdAt" >
                    <el-input v-model="state.editForm.createdAt" style="width: 200px;" readonly> </el-input>
                </el-form-item> 
            </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-form-item label="修改时间" prop="updatedAt" >
                    <el-input v-model="state.editForm.updatedAt"  style="width: 200px;" readonly></el-input>
                </el-form-item>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary"  @click="editSubbit" icon="Check" :loading="loading">提交</el-button>
                <el-button type="danger" @click="state.editVisit=false" icon="Close">取消</el-button>
            </span>
        </template>
    </el-dialog>
  </template>
<script setup lang="ts">
import {ref,unref,reactive,onMounted} from 'vue';
import {skuSearch,skuSave,skuUpdate,skuDelete,skuList,exportTree} from '@/api/skuApi.js';
import {ElMessage, ElMessageBox} from 'element-plus';
import 'element-plus/dist/index.css'

const state=reactive({
    treeData:[],
    page:{
        pageNum:1,
        pageSize:20,
        total:1,
    },
    searchForm:{
        id:null,
        name:null,
        parentId:null,
   },
    loading:false,
    addVisit:false,
    editVisit:false,
    addForm:{
        id:null,
        name:null,
        parentId:null,

    },
    editForm:{
        id:null,
        name:null,
        parentId:null,
        createdAt:null,
        updatedAt:null,
    },
    options:[],
    selectValues:[],
    searchKeyword:null,
});
const addRule=ref(null);
const editRule=ref(null);
const{treeData,page,searchForm,addForm,loading,addVisit,editVisit,editForm,options,selectValues,searchKeyword}=unref(state);
onMounted(()=>{

})
const handlePageChange=(e)=>{
     state.page.pageNum=e;
     onSearch();
}
const handleSizeChange=(e)=>{
    state.page.pageSize=e;
    onSearch();
}
const onSearch=()=>{
    state.loading=true;
    skuSearch(Object.assign(state.searchForm)).then((res)=>{
        if(res.code==200){
            state.loading=false;
            state.treeData=res.data;
        }else{
            ElMessage.error(data.msg);
        }
  
    });

}
const addSku=()=>{
    state.addVisit=true;
    state.addForm={
        id:null,
        name:null,
        parentId:0,
    };

}
const onSubmit=async ()=>{
    const form = unref(addRule);
    if (!form) return;
    await form.validate();
    state.loading=true;
    skuSave(Object.assign(state.addForm)).then((res)=>{
        if(res.code==200){
            ElMessage.success('添加成功');
            onSearch();
            state.addVisit=false;
            state.loading=false;
        }
    })
};
//编辑
const edit=(val)=>{
    state.editForm.id=val.id;
    state.editForm.name=val.name;
    state.editForm.parentId=val.parentId;
    state.editForm.createdAt=val.createdAt;
    state.editForm.updatedAt=val.updatedAt;
    state.editVisit=true;

}
const remoteMethod = (query) => {
    state.loading = true
    try {
      skuList(Object.assign(state.searchForm)).then((res)=>{
        if(res.code=200){
           state.options=res.data;
        }
        state.options = res.data   // 假设返回 [{id:1,name:"分类A"}]
      }
      );
    } finally {
      state.loading = false
    }

}
const editSubbit=async()=>{
    const form=unref(editRule);
    if(!form){return;}
    await form.validate;
    if(String(state.editForm.id)===String(state.editForm.parentId)){
        ElMessage.error('父类编码与当前的分类编码冲突!');
        return;
    }
    state.loading=true;
    state.editForm.createdAt=null;
    state.editForm.updatedAt=null;
    skuUpdate(Object.assign({},state.editForm)).then((res)=>{
        if(res.code==200){
            ElMessage.success("修改商品分类成功!");
            onSearch();
            state.editVisit=false;
            state.loading=false;
       }else{
            ElMessage.error(res.msg);
       }
    })

}
const add=(val)=>{
    state.addForm.parentId=val.id;
    state.addForm.name=null;
    state.addForm.id=null;
    state.addVisit=true;

}
const remove=(row)=>{
    ElMessageBox.confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let param = {
                id: row.id
            }
            skuDelete(param).then(res=>{
                if(res.code=200){
                    ElMessage.success('删除成功!');
                    onSearch();
                }else{
                    ElMessage.error(res.msg);
                }
            })
        }).catch(e=>{
            console.log(e)
        });

}
const onExport=()=>{
    ElMessageBox.confirm('确认导出所有的商户分类,是否继续','提示',{
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
    }).then(()=>{
            exportTree(Object.assign(state.searchForm)).then((res)=>{
            let objectUrl = res.data;
            const blob = new Blob([res.data], {type:'application/vnd.ms-excel;charset=utf-8'});
            objectUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objectUrl;
            a.download = "商户分类.xlsx";
            a.click();
            a.remove();
            URL.revokeObjectURL(objectUrl);
        })
    });
}


</script>
<style scoped>
/* 只改这个弹窗的头部 */
.add-category-dialog .el-dialog__header {
  background-color: #409eff; /* Element Plus 默认主色 */
  color: white;
  font-weight: bold;
}

</style>