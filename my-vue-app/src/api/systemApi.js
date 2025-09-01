import axios from '@/utils/axios'
import { pa } from 'element-plus/es/locales.mjs';
//=====================登录====================
/**
 * 登录
 * @param {*} data 
 * @returns 
 */
export function login(data) {
    return axios.post('/api/login', data);
}
/**
 * 修改密码
 * @param {*} params
 * @returns
 */
export function modifyPass(data) {
    return axios.post('/api/modifyPass', data);
}
/**
 * 退出登录
 * @param {*} params
 * @returns
 */
export function logout(data) {
    return axios.post('/api/logout', data);
}
/**
 * 开启手机号要素
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export function enablePhoneElements(params) {
    return axios.post('/api/enablePhoneElements',  params);
}
/**
 * 查询菜单信息
 */
export  function getMenu(data) {
    return axios.get('/api/menu/query',{data: data});
}
export function queryUserInfo(data) {
    return axios.get('/api/user/query', { params: data });
}
/**
 * 添加用户
 * @param {*} params
 * @returns
 */
export function addUser(data) {
    return axios.get('/api/user/save', {params: data});
}
/**
 * 修改用户
 * @param {*} params
 * @returns
 */
export function updateUser(params) {
    return axios.get('/api/user/update', {params:params});
}
/**
 * 删除用户
 * @param {*} params
 * @returns
 */
export function dicUser(params) {
    return axios.get('/api/user/delete', { params: params });
}
/**
 * 列表
 * @param {*} params
 * @returns
 */
export function getGroupNameByList(params) {
    return axios.get('/api/dic/getGroupNameByList', { params: params });
}
/**
 * 组织分页列表
 * @param {*} params
 * @returns
 */
export function orgList(params) {
    return axios.get('/api/org/list', { params: params });
}
/**
 * 重置用户密码
 * @param {*} params
 * @returns
 */
export function updatePassWord(params) {
    return axios.get('/api/user/update', {params:params});
}

/**
 * 用户角色查询
 * @param {*} params
 * @returns
 */
export function userRoleInfo(params) {
    return axios.get('/api/role/query', { params: params });
}
/**
 * 用户角色添加
 * @param {*} params
 * @returns
 */
export function userRoleAdd(params) {
    return axios.get('/api/role/save', { params: params });
}
/**
 * 角色列表
 * @param {*} params
 * @returns
 */
export function roleFind(params) {
    return axios.get('/api/role/find', { params: params });
}
export function roleList(params){
    return axios.get('/api/role/list');
}
/**
 * 删除角色
 */
export function delRole(params){
    return axios.get('/api/role/modify',{params:params});
}   
/**
 * 添加角色
 */
export function saveRole(params){
    return axios.get('/api/role/add',{params:params});
}
/**
 * 更新角色
 */
export function updateRole(params){
  return axios.get('/api/role/modify',{params:params});
}
/**
 * 获取菜单角色
 */
export function menuRoleList(params){
   return  axios.get('/api/role/findMenuRole',{params:params});
}
/**
 * 菜单角色添加
 */
export function menuRoleAdd(params){
   return  axios.get('/api/role/addMenuRole',{params:params});
}
/**
 * 增加菜单
 * @param {} params 
 * @returns 
 */
export function saveMenu(params){
    return axios.get("/api/menu/save",{params:params});
}
/**
 * 删除菜单
 * @param {} params 
 * @returns 
 */
export function delMenu(params){
    return axios.get("/api/menu/delete",{params:params});
}
/**
 * 更新菜单
 * @param {} params 
 * @returns 
 */
export function updateMenu(params){
    return axios.get("/api/menu/update",{params:params});
}
export function menuList(params){
    return axios.get("/api/menu/query",{params,params});
}
/**
 * 字典增加
 * @param {} params 
 * @returns 
 */
export function dicSave(params){
    return axios.get("/api/dic/save",{params:params});
}
/**
 * 字典更新
 * @param {*} params 
 * @returns 
 */
export function dicUpdate(params){
    return axios.get("/api/dic/update",{params:params});
}
/**
 * 字典删除
 * @param {} params 
 * @returns 
 */
export function dicDel(params){
    return axios.get("/api/dic/delete",{params:params});
}
/**
 * 字典查询
 * @param {*} params 
 * @returns 
 */
export function dicList(params){
    return axios.get("/api/dic/query",{params:params});
}
export function logInfoPage(params){
    return axios.get("/api/log/query",{params,params});
}
export function logErrorPage(params){
    return axios.get("/api/log/query",{params,params});
}
export function onUserTypeList(params){
    return axios.get("/api/dic/getGroupNameByList",{params,params});
}