<template>
  <div>
    <template v-if="editMode">
      <div class="w-full h-full fixed block top-0 left-0 bg-black opacity-75 z-10" @click="toggleEdit"></div>
    </template>
    <form
      @submit.prevent="save"
      class="relative"
      v-bind:class="{ 'bg-white w-full block z-50 p-2':editMode }">
      <template v-if="loading.teaching">
        <div class="w-full h-full absolute top-0 left-0
          bg-black bg-opacity-50 z-10
          flex items-center justify-center">
          <svg class="animate-spin h-20 w-20 mr-3 stroke-current text-green-400">
            <circle cx="50%" cy="50%" r="40%" stroke-width="5" stroke-dasharray="60%" fill="transparent" />
          </svg>
        </div>
      </template>

      <table class="data-block text-center">
        <tr class="title">
          <td :colspan="editMode ? 4 : 3">
            Atividades de Apoio ao Ensino
          </td>
        </tr>
        <tr class="desc">
          <th>Atividade</th>
          <th>Local / Horário / Portaria</th>
          <th>C.H. Semanal</th>
          <th v-if="editMode">Remover</th>
        </tr>
        <template v-if="!editMode">
          <tr v-for="activity of teaching" :key="activity.id">
            <td>{{ activity.atividade }}</td>
            <td>{{ activity.lhp }}</td>
            <td>{{ activity.ch_semanal }}</td>
          </tr>
          <tr class="total">
            <td colspan="2">Total</td>
            <td>{{ total_semanal }}</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="row of rows" :key="row.id" class="edit">
            <td>
              <input ref="atividade" v-model="row.atividade" type="text" />
            </td>
            <td>
              <input v-model="row.lhp" type="text">
            </td>
            <td><input v-model="row.ch_semanal" type="number" min="0" step="0.25" /></td>
            <td>
              <span @click="removeRow(row.id)">
                &times;
              </span>
            </td>
          </tr>
          <tr class="edit">
            <td colspan="4" class="cursor-pointer" @click="addRow">
              +
            </td>
          </tr>
        </template>
      </table>

      <div class="text-right">
        <template v-if="!editMode">
          <a href="#" @click.prevent="toggleEdit">Editar</a>
        </template>
        <template v-else>
          <div class="py-4">
            <input type="submit" value="Salvar" class="text-xl font-bold cursor-pointer bg-green-500 px-6">&nbsp;
            <button class="bg-red-500 text-white px-3" @click="toggleEdit">Cancelar</button>
          </div>
        </template>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
  .small-caps {
    font-variant: small-caps;
  }
  table {
    tr {
      &.title {
        @extend .small-caps;
        @apply font-bold;
        @apply text-sm;
      }
      &.desc {
        // @apply small-caps;
        @apply bg-gray-300;
      }
    }
  }
</style>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      editMode: false,
      rows: []
    }
  },
  methods: {
    toggleEdit() {
      this.editMode = !this.editMode
      if (this.editMode) {
        this.rows = this.teaching
        this.$nextTick(() => {
          let inputs = this.$refs.atividade
          if (inputs && inputs.length) {
            inputs[0].select()
          }
        });
      }
    },
    addRow() {
      this.rows.push({
        id: Math.random().toString(36).substr(2, 9),
        atividade: "teste",
        lhp: "test / 10h",
        ch_semanal: 3,
      })
      this.$nextTick(() => {
        let inputs = this.$refs.atividade
        inputs[inputs.length - 1].select()
      })
    },
    removeRow(id) {
      this.rows = this.rows.filter(row => row.id != id)
    },
    save() {
      this.$store.dispatch('saveTeaching', this.rows)
      this.toggleEdit()
    },
  },

  computed: {
    ...mapState(['teaching', 'loading']),
    total_semanal() {
      return this.teaching.reduce((acc, activity) => acc + +activity.ch_semanal, 0)
    }
  }
}
</script>