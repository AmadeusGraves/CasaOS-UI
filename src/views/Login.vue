<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:30:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-28 09:31:07
 * @Description: 
 * @FilePath: \CasaOS-UI\src\views\Login.vue
-->
<template>
  <div id="login-page" class="is-flex is-justify-content-center is-align-items-center ">
    <div class="login-panel step4 is-shadow" v-if="!isLoading">
      <div class="is-flex is-justify-content-center ">
        <div class="has-text-centered">
          <b-image :src="require('@/assets/img/account/default-avatar.svg')" class="is-128x128" rounded></b-image>
          <p class="is-size-5 has-text-weight-bold mt-3">{{username}}</p>
        </div>

      </div>
      <b-notification auto-close type="is-danger" v-model="notificationShow" aria-close-label="Close notification" role="alert">
        {{message}}
      </b-notification>
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <!-- <ValidationProvider rules="required" name="User" v-slot="{ errors, valid }">
          <b-field label="Username" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
            <b-input type="text" v-model="username" v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider> -->
        <ValidationProvider rules="required|min:5" vid="password" name="Password" v-slot="{ errors, valid }">
          <b-field :label="$t('Password')" class="mt-5 has-text-light" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
            <b-input type="password" v-model="password" password-reveal v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider>
        <b-button type="is-primary" class="mt-5" rounded expanded @click="handleSubmit(login)">{{$t('Login')}}</b-button>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";

export default {

  name: "login-page",
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      message: "",
      notificationShow: false,
      isInit: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  created() {
    this.isInit = !this.$store.state.needInitialization
    if (!this.isInit) {
      this.$router.push("/welcome");
    }
  },
  mounted() {
    this.$api.user.getAllUserName().then(users => {
      this.username = users.data.data[0];
    })
  },

  watch: {
    // Watch  System  Initialization
    '$store.state.needInitialization': {
      handler(data) {
        this.isInit = !data
        if (!this.isInit) {
          this.$router.push("/welcome");
        }
      },
      deep: true
    },
  },
  methods: {
    login() {
      this.$api.user.login({
        username: this.username,
        pwd: this.password
      }).then((res) => {
        if (res.data.success == 200) {
          localStorage.setItem("user_token", res.data.data.token)
          localStorage.setItem("user_id", res.data.data.user.id)
          localStorage.setItem("version", res.data.data.version)
          this.$store.commit('setToken', res.data.data.token)
          this.$store.commit('changeUserInfo', res.data.data)
          this.$router.push('/')
        } else {
          this.notificationShow = true;
          this.message = this.$t("Password error!")
        }
      })

    }
  }
}
</script>

<style lang="scss">
#login-page {
  height: calc(100% - 5.5rem);
  position: relative;
  z-index: 500;

  .login-panel {
    text-align: left;
    background: rgba(255, 255, 255, 0.46);
    backdrop-filter: blur(1rem);
    border-radius: 8px;
    padding: 2.5rem 4rem;

    .label {
      color: #dfdfdf;
    }

    .input {
      background: rgba(255, 255, 255, 0.32);
      border-color: transparent;
    }

    &.step1 {
      padding: 4rem 6rem;
    }

    &.step2 {
      padding: 2.5rem 4rem;
      width: 32rem;
    }

    &.step3 {
      padding: 4rem 8rem;
    }

    &.step4 {
      width: 28rem;
    }
  }
}

@media screen and (max-width: 480px) {
  .login-panel {
    text-align: left;
    background: rgba(255, 255, 255, 0.46);
    backdrop-filter: blur(1rem);
    border-radius: 8px;
    margin: 0 2rem;
    padding: 2rem !important;

    .label {
      color: #dfdfdf;
    }

    .input {
      background: rgba(255, 255, 255, 0.32);
      border-color: transparent;
    }

    .is-128x128 {
      height: 96px;
      width: 96px;
    }

    .is-3 {
      font-size: 1.5rem;
    }

    &.step1 {
      .is-2 {
        font-size: 1.5rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }

    &.step3 {
      padding: 4rem !important;
    }
  }
}
</style>