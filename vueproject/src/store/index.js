import {defineStore} from "pinia";
let isApp = false
export const userStateStore = defineStore("user", {
    state: () => {
        if (isApp) {
            let perviousData = localStorage.getItem("userInfo")
            if (perviousData) {
                perviousData = JSON.parse(perviousData)
                return {
                    user_id: perviousData['user_id'],
                    user_name: perviousData['user_name'],
                    profile_photo: perviousData['profile_photo'],
                    register_date: perviousData['register_date'],
                    isAuthentic: perviousData['isAuthentic'],
                    email: perviousData['email'],
                    nickname: perviousData['nickname'],
                    headImage: perviousData['headImage'],
                    sign: perviousData['sign']
                }
            }
        }
        return {
            user_id: 1,
            user_name: "admin",
            profile_photo: "src/assets/image/default-avatar.png",
            register_date: "default",
            isAuthentic: false,
            email: "",
            nickname: "",
            headImage: "",
            sign: ""
        }
    },

    persist: {
        enabled: true,
        key: "demo",
        storage: sessionStorage,
    },

    getters: {
        getUserName: (state) => {
            return state.user_name
        },
        getUserId: (state) => {
            return state.user_id
        },
        getProfilePhoto: (state) => {
            return state.profile_photo
        },
        getRegisterDate: (state) => {
            return state.register_date
        },
        getIsAuthentic: (state) => {
            return state.isAuthentic
        }
    },

    actions: {
        async login_store_info(accountInfo, _email) {
            // this.user_id = accountInfo.user_id
            // this.user_name = accountInfo.user_name
            // if (accountInfo.profile_photo.substring(0, 3) === "/9j") {
            //     this.profile_photo = 'data:image/jpg;base64,' + accountInfo.profile_photo
            // } else if (accountInfo.profile_photo.substring(0, 3) === "iVB") {
            //     this.profile_photo = 'data:image/png;base64,' + accountInfo.profile_photo
            // } else {
            //     this.profile_photo = "src/assets/image/default-avatar.png"
            // }
            // this.register_date = accountInfo.register_date
            // this.isAuthentic = true
            // console.log("accountInfo")
            // console.log(accountInfo)
            
            this.email = _email;
            this.headImage = accountInfo.url;
            this.nickname = accountInfo.nickname;
            this.sign = accountInfo.sign;
            this.user_id = accountInfo.user_id;
            if (isApp) {
                localStorage.setItem("userInfo", JSON.stringify({
                    user_id: this.user_id,
                    user_name: this.user_name,
                    profile_photo: this.profile_photo,
                    register_date: this.register_date,
                    isAuthentic: this.isAuthentic,
                    email: this.email,
                    nickname: this.nickname,
                    headImage: this.headImage,
                    sign: this.sign
                }))
            }
        },
        async reg_success_info(accountInfo) {
            this.user_name = accountInfo.user_name
            this.isAuthentic = true
        },
        async logout() {
            this.isAuthentic = false
            localStorage.clear()
        }
    }
})

export default userStateStore