<template>
  <div>
     <table class="data-block text-center">
        <tr class="title">
          <td colspan="7">
            Distribuição da Carga Horária
          </td>
        </tr>
        <tr class="desc">
          <th>Aulas</th>
          <th>Preparação de Aulas</th>
          <th>Apoio ao Ensino</th>
          <th>Pesquisa</th>
          <th>Extensão</th>
          <th>Administrativo-Pedagógico</th>
          <th>Total</th>
        </tr>
        <tr class="total">
          <td>{{ch_classes}}h</td>
          <td>{{ch_preparacao}}h</td>
          <td>{{ch_teaching}}h</td>
          <td>{{ch_research}}h</td>
          <td>{{ch_extension}}h</td>
          <td>{{ch_admin}}h</td>
          <td>{{ch_total}}h</td>
        </tr>
     </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },
  methods: {
  },

  computed: {
    ...mapState(['classes', 'teaching', 'research', 'extension', 'admin']),
    ch_classes() {
      return this.classes.reduce((acc, klass) => acc + +klass.ch_semanal, 0)
    },
    ch_preparacao() {
      return this.classes.reduce((acc, klass) => acc + +klass.ch_preparacao, 0)
    },
    ch_teaching() {
      return this.teaching.reduce((acc, activity) => acc + +activity.ch_semanal, 0)
    },
    ch_research() {
      return this.research.reduce((acc, activity) => acc + +activity.ch_semanal, 0)
    },
    ch_extension() {
      return this.extension.reduce((acc, activity) => acc + +activity.ch_semanal, 0)
    },
    ch_admin() {
      return this.admin.reduce((acc, activity) => acc + +activity.ch_semanal, 0)
    },
    ch_total() {
      return this.ch_classes +this.ch_preparacao +this.ch_teaching +this.ch_research +this.ch_extension +this.ch_admin
    }
  }
}
</script>