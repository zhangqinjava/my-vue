import { defineStore } from 'pinia'

// 存储用户信息
export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        loginTime: '',
        id:'',
        elementLoginStatus:'',
        type:null,
        firstFlag:null,
        isMoreFlag:null,
    }),
    getters: {
        getUser(){
            if(!this.username){
                let user = JSON.parse(sessionStorage.getItem('user'))
                this.username = user.username
                this.loginTime = user.loginTime
                this.id = user.id
                this.elementLoginStatus = user.elementLoginStatus
                this.type = user.type
                this.firstFlag=user.firstFlag,
                this.isMoreFlag=user.isMoreFlag
            }
            return {
                username: this.username,
                loginTime: this.loginTime,
                id : this.id,
                elementLoginStatus : this.elementLoginStatus,
                type : this.type,
                firstFlag:this.firstFlag,
                isMoreFlag:this.isMoreFlag,
            }
        }
    },
    actions: {
        setUser (data) {
            this.username = data.username
            this.loginTime = data.loginTime
            this.id = data.id
            this.elementLoginStatus = data.elementLoginStatus
            this.type = data.type
            this.firstFlag=data.firstFlag
            this.isMoreFlag=data.isMoreFlag

            sessionStorage.setItem('user', JSON.stringify({
                username: data.username,
                loginTime: data.loginTime,
                id : data.id,
                elementLoginStatus : data.elementLoginStatus,
                type : data.type,
                firstFlag:data.firstFlag,
                isMoreFlag:data.isMoreFlag
            }))
        },
        delUser () {
            sessionStorage.clear()
        },
        updateUserElementLoginStatus (elementLoginStatus) {
            this.elementLoginStatus = elementLoginStatus
        }
    }
})

// 存储 token
export const useTokenStore = defineStore('token', {
    state: () => ({
        token: '',
    }),
    getters: {
        getToken(){
            if(!this.token){
                this.token = sessionStorage.getItem('token')
            }
            return this.token;
        }
    },
    actions: {
        setToken (data) {
            this.token = data
            sessionStorage.setItem('token', data)
        },
        delToken () {
            sessionStorage.clear()
        }
    }
})

// 存储菜单信息
export const useMenuStore = defineStore('menu', {
    state: () => ({
        menu: '',
    }),
    getters: {
        getMenu(){
            if(!this.menu){
                this.menu = JSON.parse(sessionStorage.getItem('menu'))
            }
            return this.menu;
        }
    },
    actions: {
        setMenu (data) {
            this.menu = data
            sessionStorage.setItem('menu', JSON.stringify(data))
        },
        delMenu () {
            sessionStorage.clear()
        }
    }
})

// 存储定时器信息
export const useTimeStore = defineStore('time', {
    state: () => ({
        time: null,
    }),
    getters: {
        getTime(){
            if(!this.time){
                this.time = JSON.parse(sessionStorage.getItem('time'))
            }
            return this.time;
        }
    },
    actions: {
        setTime (data) {
            this.time = data
            sessionStorage.setItem('time', data)
        },
        delTime () {
            sessionStorage.setItem('time',null)
        }
    }
})