import axios from 'axios'
import { pa } from 'element-plus/es/locales.mjs';
//============商品分类接口==============
export function skuSearch(params){
    return axios.get("/api/sku/query",{params,params});
}

export function skuSave(params){
    return axios.get("/api/sku/save",{params,params});
}
export function skuUpdate(params){
    return axios.get("/api/sku/update",{params,params});
}
export function skuDelete(params){
    return axios.get("/api/sku/delete",{params,params});
}
export function skuList(params){
    return axios.get("/api/sku/list",{params,params});
}
export function exportTree(params){
    return axios.get("api/sku/export-tree",{params:params,responseType:'blob'});
}