<template>
    <v-container>
        <v-card elevation="24">
            <v-card-text>
                <v-card-title>Основные настройки</v-card-title>
                <v-text-field label="Айди пользователя" v-model="store.user.id" filled readonly></v-text-field>
                <v-text-field label="Логин" v-model="store.user.username" filled readonly></v-text-field>
                <v-text-field label="Ваша роль" v-model="role" filled readonly></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-card-title>Telegram</v-card-title>
                <v-checkbox v-model="isTgUser" :label="isTgLabel" color="green" readonly></v-checkbox>
                <v-text-field label="Telegram ID" v-model="store.user.tgUser.telegramId" filled readonly v-if="isTgUser"></v-text-field>
                <v-text-field label="Имя" v-model="store.user.tgUser.name" filled readonly v-if="isTgUser"></v-text-field>
                <v-btn color="red" elevation="6" outlined v-if="isTgUser" @click="unlink">Отключить Telegram</v-btn>
                <v-btn color="green" elevation="6" outlined v-if="!isTgUser" :href="activateTgLink">Подключить Telegram</v-btn>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-card-title>Допольнительные настройки</v-card-title>

                <v-btn color="red" elevation="6" outlined>Выйти из аккаунта</v-btn>

            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import store from '@/store';
export default {
    data() {
        return { store, role: "", isTgUser: false, isTgLabel: "Отключен", activateTgLink: "/profile" }
    },
    methods: {
        renderRole() {
            switch (store.user.role.toLowerCase()) {
                case "admin":
                    return "Администратор 👑";
                case "user":
                    return "Пользователь 👤";
                default:
                    return "Неизвестная роль";
            }
        },
        async unlink() {
            await store.http.post("/webUsers/me/unlinkTelegram")
            store.user.tgUser = null;
            this.isTgUser = false;
            await store.relog()
        }
    },
    async mounted() {
        if (!store.isAuth) return location.href = "/";

        let {data} = await store.http.get("/webUsers/me/linkTelegram")

        store.navTitle = `Профиль ${store.user.username}`;
        this.role = this.renderRole();
        this.isTgUser = !!store.user.tgUser ? true : false;
        this.isTgLabel = this.isTgUser ? "Подключен" : "Отключен";
        this.activateTgLink = data.url;
    }
}
</script>
