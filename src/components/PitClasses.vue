<template>
  <div>
    <template v-if="editMode">
      <div class="w-full h-full fixed block top-0 left-0 bg-black opacity-75 z-10" @click="toggleEdit"></div>
    </template>
    <form
      @submit.prevent="save"
      class="relative"
      v-bind:class="{ 'bg-white w-full block z-50 p-2':editMode }">
      <template v-if="loading.classes">
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
          <td :colspan="editMode ? 6 : 5">
            Aulas
          </td>
        </tr>
        <tr class="desc">
          <th>Componente Curricular</th>
          <th>Curso</th>
          <th>C.H. Total do Componente (Horas relógio)</th>
          <th>C.H. Semanal</th>
          <th>C.H. de Preparação de Aulas</th>
          <th v-if="editMode">Remover</th>
        </tr>
        <template v-if="!editMode">
          <tr v-for="klass of classes" :key="klass.id">
            <td>{{ klass.disciplina }}</td>
            <td>{{ klass.curso }}</td>
            <td>{{ klass.ch_total }}</td>
            <td>{{ klass.ch_semanal }}</td>
            <td>{{ klass.ch_preparacao }}</td>
          </tr>
          <tr class="total">
            <td colspan="3">Total</td>
            <td>{{ total_semanal }}</td>
            <td>{{ total_preparacao }}</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="row of rows" :key="row.id" class="edit">
            <td><input ref="disciplina" v-model="row.disciplina" type="text" /></td>
            <td>
              <select v-model="row.curso">
                <optgroup label="Técnico">
                  <option>Informática para Internet</option>
                  <option>Logística</option>
                </optgroup>
                <optgroup label="Superior">
                  <option>Administração</option>
                  <option>Gestão da Qualidade</option>
                  <option>Sistemas para Internet</option>
                </optgroup>
              </select>
            </td>
            <td><input v-model="row.ch_total" type="number" min="0" @input="updateCHTotal(row)" /></td>
            <td><input v-model="row.ch_semanal" type="number" min="0" step="0.25" /></td>
            <td><input v-model="row.ch_preparacao" type="number" min="0" step=".25" :max="row.ch_semanal" /></td>
            <td>
              <span @click="removeRow(row.id)">
                &times;
              </span>
            </td>
          </tr>
          <tr class="edit">
            <td colspan="6" class="cursor-pointer" @click="addRow">
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
    @apply transition;
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
      &.edit {
        @apply hover:bg-gray-400;
        td {
          @apply px-2 py-1;
          input, select {
            @apply w-full bg-white border border-blue-400 p-0.5 font-bold text-center;
          }
          span {
            @apply bg-red-500 text-white px-2 py-0.5 cursor-pointer hover:bg-red-600;
          }
        }
      }
      &.total {
        @apply bg-gray-100 font-bold border-black border-t-4 text-sm;
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
        this.rows = this.classes
        this.$nextTick(() => {
          let inputs = this.$refs.disciplina
          if (inputs && inputs.length) {
            inputs[0].select()
          }
        });
      }
    },
    addRow() {
      this.rows.push({
        id: Math.random().toString(36).substr(2, 9),
        disciplina: "",
        curso: "",
        ch_total: '',
        ch_semanal: '',
        ch_preparacao: ''
      })
      this.$nextTick(() => {
        let inputs = this.$refs.disciplina
        inputs[inputs.length - 1].select()
      })
    },
    updateCHTotal(row) {
      row.ch_semanal = row.ch_total / 20
      row.ch_preparacao = row.ch_semanal
    },
    removeRow(id) {
      this.rows = this.rows.filter(row => row.id != id)
    },
    save() {
      this.$store.dispatch('saveClasses', this.rows)
      this.toggleEdit()
    }
  },
  computed: {
    ...mapState(['classes', 'loading']),
    total_semanal() {
      return this.classes.reduce((acc, klass) => acc + +klass.ch_semanal, 0)
    },
    total_preparacao() {
      return this.classes.reduce((acc, klass) => acc + +klass.ch_preparacao, 0)
    }
  }
}
</script>