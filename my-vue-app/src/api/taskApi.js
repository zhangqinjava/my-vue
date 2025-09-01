import axios from '@/utils/axios'
import { pa } from 'element-plus/es/locales.mjs';
/**
 * 任务分页
 * @param {*} params
 * @returns
 */
export function taskPage(params) {
    return axios.get('/api/task/query', { params: params });
}
export function updateTask(params) {
    return axios.get('/api/task/update', { params: params });
}
export function triggerTask(params) {
    return axios.get('/api/task/trigger', { params: params });
}
export function delTask(params) {
    return axios.get('/api/task/delete', { params: params });
}
export function saveTask(params) {
    return axios.get('/api/task/save', { params: params });
}
export function logPage(params){
    return axios.get("/api/tasklog/query",{params:params});
}
export function logClear(params){
    return axios.get("/api/tasklog/delete",{params:params});
}