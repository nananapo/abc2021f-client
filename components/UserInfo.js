import { getUserNameAsync } from "../store.js";

const UserInfo = Vue.component("UserInfo",{
  template: "#userinfo",
  props: {
    userId: String,
    prefix: String,
  },
  data() {
    return {
      name: "",
    };
  },
  methods: {
    async refresh() {
      this.name = await getUserNameAsync(this.userId);
    },
  },
  watch: {
    userId: function (newVal, oldVal) {
      this.refresh();
    },
  },
});

export {UserInfo}