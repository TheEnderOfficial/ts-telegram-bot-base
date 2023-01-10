<template>
    <v-app>
        <v-navigation-drawer permanent app dark>
            <v-list nav>
                <v-list-item lines="two" prepend-avatar="mdi-account-circle" :title="store.user.username" subtitle="Logged in"
                    v-if="store.isAuth"></v-list-item>
                    <v-list-item prepend-icon="mdi-account-circle" title="Профиль" link href="/profile" v-if="store.isAuth"></v-list-item>
                <v-list-item prepend-icon="mdi-logout" title="Выйти" @click="logout" v-if="store.isAuth"></v-list-item>
                <v-list-item v-if="!store.isAuth" prepend-icon="mdi-login" title="Войти" link
                    href="/login"></v-list-item>
                <v-list-item v-if="!store.isAuth" prepend-icon="mdi-login" title="Регистрация" link
                    href="/register"></v-list-item>

                <v-divider></v-divider>

                <v-list-item prepend-icon="mdi-home-city" title="Главная" link href="/"></v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app dark>
            <v-toolbar-title>{{ store.navTitle }}</v-toolbar-title>
            <!-- Your app bar content goes here -->

        </v-app-bar>
        <v-main>

            <!-- Provides the application the proper gutter -->
            <v-container fluid>

                <!-- If using vue-router -->
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import store from '@/store'
export default {
    methods: {
        async logout() {
            localStorage.removeItem("token");


            await store.relog();
        }
    },
    async created() {
        await store.relog();
        
    },
    data() {
        return {
            store
        }
    }
}
</script>