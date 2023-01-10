<template>
    <v-text-field label="Логин" v-model="login" outlined clearable></v-text-field>
    <v-text-field label="Пароль" v-model="password" type="password" outlined clearable></v-text-field>
    <v-btn color="primary" elevation="6" fab icon="mdi-chevron-right" outlined @click="loginF"></v-btn>
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
        store.navTitle = "Регистрация"
    },
    methods: {
        async loginF() {
            let resp = await store.http.post<{ token?: string, user?: any, error?: string }>("/webUsers/register", {username: this.login, password: this.password})
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
