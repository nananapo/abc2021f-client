import { SignupAsync,SetNameAsync } from "../store.js";

const Signup = Vue.component("Signup",{
  template: "#signup",
  data() {
    return {
      name: "",
    };
  },
  methods: {
    async signup() {
        if(await SignupAsync()){
            this.$router.push('/');
            await SetNameAsync(this.name);
        }else{
            alert('登録に失敗しました');
        }
    }
  }
});

export {Signup}