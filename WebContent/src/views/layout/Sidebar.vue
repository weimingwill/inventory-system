<template>
    <v-sidebar height="100vh" fixed :drawer="!isNotRoot">
        <div class="sidebar-logo">
            <img class="logo" src="../../assets/logo.png">
            <p class="logo-title">
                EC Inventory
                <v-btn @click.native="clearStorage" icon="icon" slot="activator" v-tooltip:top="{ html: 'Reload DB' }">
                    <v-icon>replay</v-icon>
                </v-btn>
            </p>
        </div>

        <!--<v-divider light />-->
        <v-list dense :close-on-lock="false">
            <template v-for="(item,i) in userMenus">
                <v-list-group v-if="item.subItems">
                    <v-list-item slot="item">
                        <v-list-tile ripple>
                            <v-list-tile-avatar>
                                <v-icon>{{ item.meta.icon }}</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-title v-text="item.title" />
                            <v-list-tile-action>
                                <v-icon>keyboard_arrow_down</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-if="subItem.isMenu" v-for="(subItem,i) in item.subItems" :key="i">
                        <v-list-tile ripple :href="subItem.path" :router="subItem.router">
                            <v-list-tile-title v-text="subItem.title" />
                        </v-list-tile>
                    </v-list-item>
                </v-list-group>
                <v-subheader v-else-if="item.header" v-text="item.header" />
                <v-divider v-else-if="item.divider" light />
                <v-list-item v-else>
                    <v-list-tile ripple :href="item.path" :router="item.router">
                        <v-list-tile-avatar>
                            <v-icon>{{ item.meta.icon }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-title v-text="item.title" />
                    </v-list-tile>
                </v-list-item>
            </template>
            <div class="bottom-aligned">

                <v-divider light />
                <v-list-item>
                    <v-list-tile ripple>
                        <v-menu class="message-menu" top right>
                            <v-btn icon="icon" slot="activator" dark>
                                <v-list-tile-avatar class="message-icon">
                                    <v-icon
                                        v-badge="badge"
                                        class="red--after"
                                    >email</v-icon>
                                </v-list-tile-avatar>
                            </v-btn>
                            <v-list three-line class="elevation-1 message-list">
                                <template v-for="item in notifications">
                                    <v-subheader v-if="item.header" v-text="item.header"/>
                                    <v-divider v-else-if="item.divider" v-bind:inset="item.inset"/>
                                    <v-list-item v-else v-bind:key="item.title">
                                        <v-list-tile :href="item.href" avatar>
                                            <v-list-tile-avatar>
                                                <v-icon
                                                    class="grey--text text--darken-2"
                                                >{{ item.icon }}</v-icon>
                                            </v-list-tile-avatar>
                                            <v-list-tile-content>
                                                <v-list-tile-title v-html="item.title"/>
                                                <v-list-tile-sub-title v-html="item.subtitle"/>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list-item>
                                </template>
                            </v-list>
                        </v-menu>

                        <v-list-tile-title class="message-title" v-text="message"/>
                    </v-list-tile>
                </v-list-item>

                <v-divider light />

                <v-list-item>
                    <v-list-tile ripple class="bottom-list-item">
                        <v-list-tile-avatar class="customised-avatar">
                            <img class="ui small circular image avatar-image"
                                 :src="user.image">
                        </v-list-tile-avatar>
                        <v-list-tile-content class="avatar-title-content">
                            <v-list-tile-title class="avatar-title" v-text="user.name"/>
                            <v-list-tile-sub-title v-text="user.position"/>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn @click.native="logoutUser" icon v-tooltip:top="{ html: 'Logout' }">
                                <v-icon class="red--text">power_settings_new</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-item>

            </div>

        </v-list>
    </v-sidebar>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'sidebar',

    computed: {
      ...mapGetters([
        'userMenus',
        'notifications',
        'isNotRoot',
        'user'
      ]),
    },

    methods: {
      ...mapActions([
        'logout'
      ]),

      clearStorage: function () {
        console.log('Clear Storage');
        localStorage.clear();
      },

      logoutUser () {
        this.logout();
        this.$router.replace('/')
      }
    },

    data () {
      return {
        username: 'Zhuang Weiming',
        position: 'Inventory Manager',
        message: 'Message',
        items: [
          {
            title: 'title',
            subtitle: 'sub',
            icon: 'alarm',
          },
          { divider: true, inset: true },
          {
            title: 'title2',
            subtitle: 'sub2',
            icon: 'mail',
          }
        ],
        badge: { value: 6, right: true, overlap: true },
      }
    }
  }
</script>

<style lang="stylus" scoped>
    @import "../../../semantic/dist/components/image.css";

    /* Todo: responsive sidebar */

    /* active tab */
    .list__tile--active {
        background-color: rgba(82, 122, 154, 0.3);
        /*color: #2196f3;*/
    }

    .list__tile--active .list__tile__title {
        font-weight: bold;
        color: #58acff !important;
    }

    .sidebar-logo {
        text-align: center;
        color: white;
        font-size: 20px;
        margin: 25px 0 30px 0;
        padding: 0 20px;
    }

    .logo-title {
        margin-top: 10px;
    }

    .logo {
        height: auto;
    }

    .bottom-aligned {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }

    .bottom-list-item {
        height: 80px !important;
        padding: 10px 15px !important;
    }

    .avatar-image {
        width: auto !important;
        height: 90% !important;
        position: absolute;
    }

    .avatar-title-content {
        margin-left: 10%;
    }

    .avatar-title {
        font-size: 15px !important;
        margin-bottom: 3%;
    }

    .message-icon {
        margin-left: 6%;
    }

    .message-title {
        margin-left: 4%;
    }

    .message-menu {

    }

    .message-list {
        width: 250px;
    }

    .message-list li a {
        color: #424242;
    }

    .badge:after {
        height: 17px;
        width: 17px;
        font-size: 0.8rem;
    }
</style>