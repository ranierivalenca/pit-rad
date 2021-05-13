<template>
  <div>
    <template v-if="editMode">
      <div class="w-full h-full fixed block top-0 left-0 bg-black opacity-75 z-10" @click="toggleEdit"></div>
    </template>
    <form @submit.prevent="save" class="relative" v-bind:class="{ 'bg-white w-full block z-50 p-2':editMode }">
      <template v-if="loading.data">
        <div class="w-full h-full absolute top-0 left-0
          bg-black bg-opacity-50 z-10
          flex items-center justify-center">
          <svg class="animate-spin h-20 w-20 mr-3 stroke-current text-green-400">
            <circle cx="50%" cy="50%" r="40%" stroke-width="5" stroke-dasharray="60%" fill="transparent" />
          </svg>
        </div>
      </template>
      <table class="data-block">
        <tr>
          <td colspan="2">
            <div class="title">Campus</div>
            <div class="value">
              <!-- <template v-if="!editMode"> -->
                {{ data.campus }}
              <!-- </template> -->
              <!-- <template v-else>
                <input v-model="form.campus" type="text" />
              </template> -->
            </div>
          </td>
          <td colspan="2">
            <div class="title">Coordenação</div>

            <div class="value">
              <template v-if="!editMode">
                {{ data.coord }}
              </template>
              <template v-else>
                <input ref="coord" v-model="form.coord" type="text" />
              </template>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="title">Professor(a)</div>
            <div class="value">
              <template v-if="!editMode">
                {{ data.name }}
              </template>
              <template v-else>
                <input v-model="form.name" type="text" />
              </template>
            </div>
          </td>
          <td>
            <div class="title">Grupo</div>
            <div class="value">
              <template v-if="!editMode">
                {{ data.grupo }}
              </template>
              <template v-else>
                <select v-model="form.grupo">
                  <option>I</option>
                  <option>II</option>
                  <option>III</option>
                  <option>IV</option>
                  <option>V</option>
                  <option>VI</option>
                </select>
              </template>
            </div>
          </td>
          <td>
            <div class="title">Regime de Trabalho</div>
            <div class="value work-group">
              <template v-if="!editMode">
                <span>
                  <template v-if="data.regime == '20h'">&times;</template>
                </span>20h
                <span>
                  <template v-if="data.regime == '40h'">&times;</template>
                </span>40h
                <span>
                  <template v-if="data.regime == 'DE'">&times;</template>
                </span>DE
              </template>
              <template v-else>
                <label>
                  <input type="radio" v-model="form.regime" value="20h">
                  <span><b></b></span> 20h
                </label>
                <label>
                  <input type="radio" v-model="form.regime" value="40h">
                  <span><b></b></span> 40h
                </label>
                <label>
                  <input type="radio" v-model="form.regime" value="DE">
                  <span><b></b></span> DE
                </label>
              </template>
            </div>
          </td>
        </tr>
      </table>
      <div class="text-right">
        <template v-if="!editMode">
          <a href="#" @click="toggleEdit">Editar</a>
        </template>
        <template v-else>
          <div class="pt-2">
            <input type="submit" value="Salvar" class="cursor-pointer bg-green-500 px-3">&nbsp;
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
  td {
    .title {
      @apply px-1;
      @apply italic;
      @apply small-caps;
      @apply text-sm;
    }
    .value {
      @apply px-1;
      @apply small-caps;
      @apply font-bold;
      input, select {
        @apply w-full bg-white border border-blue-400 p-0.5 font-bold;
      }
      input[type="radio"] {
        @apply hidden;
        &:checked + span > b::before {
          content:'\d7'
        }
      }
    }
    .work-group {
      label {
        cursor: pointer;
        @apply hover:bg-gray-200;
      }
      span {
        @apply inline-flex;
        @apply justify-between;
        @apply w-6;
        @apply mr-0.5;
        @apply ml-1.5;
        &:first-child {
          @apply ml-0;
        }
      }
      span::before {
        content: '(';
      }
      span::after {
        content: ')';
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
      form: {
        campus: null,
        coord: null,
        name: null,
        grupo: null,
        regime: null
      }
    }
  },
  methods: {
    toggleEdit() {
      this.editMode = !this.editMode
      if (this.editMode) {
        for (let field in this.form) {
          this.form[field] = this.data[field]
        }
        this.$nextTick(() => {
          // this.focusInput();
          this.$refs.coord.select()
        });
      }
    },
    save() {
      this.$store.dispatch('updateData', this.form)
      this.toggleEdit()
    }
  },
  computed: {
    ...mapState(['data', 'loading'])
  }
}
</script>