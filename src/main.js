// import "./assets/main.css";
import axios from "axios";

import { createApp } from "vue";
import App from "./App.vue";
//부트스트랩
import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import JsonViewer from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";

const app = createApp(App);

app.use(BootstrapVue3);
app.use(JsonViewer);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
app.config.globalProperties.axios = axios;

app.mount("#app");
