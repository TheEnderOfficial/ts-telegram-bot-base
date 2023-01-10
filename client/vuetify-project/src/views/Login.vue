<template>
    <v-text-field label="Логин" v-model="login" outlined clearable></v-text-field>
    <v-text-field label="Пароль" type="password" v-model="password" outlined clearable></v-text-field>
    <v-btn color="primary" elevation="6" fab icon="mdi-login" outlined @click="loginF"></v-btn>
</template>

<script lang="ts">
import store from "../store"
export default {
    data() {
        return {
            login: "",
            password: ""
        }
    },
    mounted() {
        store.navTitle = "Вход"
    },
    methods: {
        async loginF() {
            let resp = await store.http.post<{ token?: string, user?: any, error?: string }>("/webUsers/login", {username: this.login, password: this.password})
            if (resp.data.error) {
                alert(resp.data.error)
            }
            else if (resp.data.user && resp.data.token) {
                store.user = resp.data.user
                store.isAuth = true
                localStorage.setItem("token", resp.data.token)
                this.$router.push("/profile")
            }
            else {
                alert("Неизвестная ошибка")
            }
        }
    }
}
</script>
