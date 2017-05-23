<template>
  <v-app>
    <main>
      <v-content>
        <v-container>
          <div class="logo">
            <img class="logo-image" src="../assets/logo.png">
            <p class="logo-title">
              EC Inventory
            </p>
          </div>

          <v-card>
              <v-text-field
                  v-model="username"
                  label="Username"
                  type="text"
                  :rules="rules.username"
                  required
              >
              </v-text-field>

              <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  :rules="rules.password"
                  required
              >
              </v-text-field>

              <v-btn @click.native="loginValidate" class="login-btn" primary light>Login</v-btn>
          </v-card>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Login',

    data () {
      return {
        username: '',
        password: '',
        rules: {
          username: [],
          password: [],
        }
      }
    },

    computed: {
      ...mapGetters([
        'verifyUser'
      ])
    },

    methods: {
      ...mapActions([
        'login',
        'initApp',
        'toggleIsRoot'
      ]),

      loginValidate() {
        if (!this.username) {
          this.rules.username = [() => 'Username is required']
        }

        if (!this.password) {
          this.rules.password = [() => 'Password is required']
        }

        if (this.username && this.password) {
          let user = this.verifyUser(this.username, this.password);
          if (user) {
            this.login(user);
            if (user.username === 'purchasing') {
              this.$router.replace('/purchasingDashboard');
            } else if (user.username === 'inbound') {
              this.$router.replace('/receiving');
            } else {
              this.$router.replace('/inventory');
            }
            this.toggleIsRoot();
          } else {
            this.rules.username = [() => 'Username or password is incorrect'];
            this.rules.password = [() => 'Username or password is incorrect'];
          }
        }
      },

    },

    created () {
      this.initApp();
    },

  }
</script>

<style scoped>
  .container {
    position: absolute;
    top: 14%;
    left: 35%;
    right: 0;
    bottom: 0;
  }

  .card{
    height: 280px !important;
    position: absolute;
    width: 400px;
    padding: 2rem 3rem;
  }

  .login-btn {
    width: 100%;
  }

  .logo {
    text-align: center;
    font-size: 25px;
    margin: 25px 0 30px 0;
    width: 400px;
  }
</style>