<template>
    <v-sidebar height="auto">
        <v-list dense>
            <!--<p style="color: white">{{ menu }}</p>-->
            <template v-for="(item,i) in menu">
                <v-list-group v-if="item.subItems">
                    <v-list-item slot="item">
                        <v-list-tile ripple>
                            <v-list-tile-title v-text="item.title" />
                            <v-list-tile-action>
                                <v-icon>keyboard_arrow_down</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item v-for="(subItem,i) in item.subItems" :key="i">
                        <v-list-tile ripple :href="subItem.path" :router="subItem.router">
                            <v-list-tile-title v-text="subItem.title" />
                        </v-list-tile>
                    </v-list-item>
                </v-list-group>
                <v-subheader v-else-if="item.header" v-text="item.header" />
                <v-divider v-else-if="item.divider" light />
                <v-list-item v-else>
                    <v-list-tile ripple>
                        <v-list-tile-title v-text="item.title" />
                    </v-list-tile>
                </v-list-item>
            </template>
        </v-list>
    </v-sidebar>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'sidebar',

    computed: mapGetters({
      menu: 'menuitems',
    }),

//    data () {
//      return {
//        itemGroup: [
//          { header: 'Header' },
//          {
//            title: 'Inventory Control',
//            group: '/inventory',
//            subItems: [
//              {
//                title: 'Inventory',
//                path: '/inventory',
//                router: true
//              },
//              {
//                title: 'Variants',
//                path: '/variant',
//                router: true
//              }
//            ]
//          },
//          { title: 'Stock' },
//          { title: 'Link' },
//          { divider: true },
//          { header: 'Another Header' },
//          { title: 'Link' }
//        ],
//        sidebar4: ''
//      }
//    }
  }
</script>

<style>
    /* Todo: change height of sidebar */
</style>