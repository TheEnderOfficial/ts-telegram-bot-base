import { reactive } from "vue";
import axios from "axios";

export default reactive({
  isAuth: false,
  user: {} as any,
  navTitle: "Vuetify Project",
  http: axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      authorization: localStorage.getItem("token")
        ? "Bearer " + localStorage.getItem("token")
        : undefined,
    },
    validateStatus: (status) => true,
  }),
  async relog() {
    let token = localStorage.getItem("token");

    if (!token) {
      this.isAuth = false;
    } else {
      this.isAuth = true;
      let user = await this.http.get("/webUsers/me");
      this.user = user.data;
    }
  },
  async logout() {
    localStorage.removeItem("token");
    await this.relog();
  }
});
