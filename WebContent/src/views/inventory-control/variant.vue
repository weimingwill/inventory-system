<template>
    <v-card>
        <v-card-title>
            Variant
            <v-spacer></v-spacer>
            <v-text-field
                append-icon="search"
                label="Search"
                single-line
                hide-details
                v-model="e3"
            ></v-text-field>
        </v-card-title>
        <v-data-table
            v-bind:headers="headers"
            select-all
        >
            <template slot="items" scope="props">
                <td>
                    <v-checkbox
                        hide-details
                        primary
                        v-model="props.item.value"
                    ></v-checkbox>
                </td>
                <td>
                    <v-edit-dialog
                        @open="props.item._name = props.item.name"
                        @cancel="props.item.name = props.item._name || props.item.name"
                        lazy
                    > {{ props.item.name }}
                        <v-text-field
                            slot="input"
                            label="Edit"
                            v-bind:value="props.item.name"
                            v-on:change="val => props.item.name = val"
                            single-line counter="counter"
                        ></v-text-field>
                    </v-edit-dialog>
                </td>
                <td class="text-xs-right">{{ props.item.calories }}</td>
                <td class="text-xs-right">{{ props.item.fat }}</td>
                <td class="text-xs-right">{{ props.item.carbs }}</td>
                <td class="text-xs-right">{{ props.item.protein }}</td>
                <td class="text-xs-right">{{ props.item.sodium }}</td>
                <td class="text-xs-right">{{ props.item.calcium }}</td>
                <td>
                    <v-edit-dialog
                        class="text-xs-right"
                        @open="props.item._iron = props.item.iron"
                        @cancel="props.item.iron = props.item._iron || props.item.iron"
                        large
                        lazy
                    >
                        <div class="text-xs-right">{{ props.item.iron }}</div>
                        <div slot="input" class="mt-3 title">Update Iron</div>
                        <v-text-field
                            slot="input"
                            label="Edit"
                            v-bind:value="props.item.iron"
                            v-on:blur="val => props.item.iron = val"
                            single-line
                            counter
                            autofocus
                        ></v-text-field>
                    </v-edit-dialog>
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
  export default {
    name: 'inventory',
    data () {
      return {
        headers: [
          {
            text: 'Dessert (100g serving)',
            left: true,
            sortable: false,
            value: 'name'
          },
          { text: 'Calories', value: 'calories' }
        ],
        items: [
          {
            value: false,
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            sodium: 87,
            calcium: '14%',
            iron: '1%'
          },
          {
            value: false,
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            sodium: 129,
            calcium: '8%',
            iron: '1%'
          }
        ],
        e3: '',
        items3: ''
      }
    }
  }
</script>