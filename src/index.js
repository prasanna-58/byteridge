import Vue from "vue";
import VeeValidate from "vee-validate";

import { store } from "./_store";
import { router } from "./_helpers";
import App from "./app/App";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: "veeFields",
});
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
});
