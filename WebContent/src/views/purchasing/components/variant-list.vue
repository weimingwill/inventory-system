<template>
  <v-menu
      lazy
      v-model="menu"
      transition="v-scale-transition"
      offset-y
  >
    <v-text-field
        slot="activator"
        v-on:keyup.native="searchVariants"
        name="name"
        v-model="searchContent"
    ></v-text-field>

    <v-card class="item-list">
      <v-list>
        <template v-for="variant in filteredVariants">
          <v-list-item
              v-bind:key="variant.id"
              ref="listItem"
              class="list-item"
          >
            <input type="hidden" v-model="variant.id" name="0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img v-bind:src="variant.image" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="variant.fullname" />
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-menu>

</template>

<script>
  export default {
    name: 'VariantList',

    props: ['variants', 'searchContent', 'items'],

    watch: {
      variants () {
        this.filteredVariants = this.variants;
      }
    },

    methods: {
      searchVariants: function () {
        // Todo: onkeyup has problem when deleting input
        this.isKeyup = true;

        // Filtered added orderedItems
        this.filteredVariants = this.variants.filter(variant => this.items.filter(item => item.id === variant.id).length === 0)
        this.filteredVariants = this.filteredVariants.filter(v => v.fullname.includes(this.searchContent)).slice(0,5);


        Array.from(document.getElementsByClassName('list-item')).forEach(($list) => {
          let $input = $list.firstChild;
          // use name as boolean value to add event listener only once
          if ($input.name === "0") {
            $list.addEventListener('click', () => this.$emit('itemClicked', parseInt($input.value)));
            $input.name = "1";
          }
        });
      },
    },

    beforeDestroy() {
      Array.from(document.getElementsByClassName('list-item')).forEach(($list) => {
        $list.removeEventListener('click', () => this.$emit('itemClicked', parseInt($list.firstChild.value)))
      });
    },

    data() {
      return {
        isKeyup: false,
        filteredVariants: this.variants,
        menu: ''
      }
    }
  }
</script>