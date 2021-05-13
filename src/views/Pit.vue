<template>
  <div>
    <div class="text-center text-2xl">
      <h1 class="small-caps">Plano Individual de Trabalho</h1>
      <h1>Semestre 2021.1</h1>
    </div>

    <PitMain />
    <PitClasses />
    <PitTeaching />
    <pit-research />
    <pit-extension />
    <pit-admin />
    <pit-summary />
  </div>
</template>

<style lang="scss">
  .small-caps {
    font-variant: small-caps;
  }
  h1 {
    @extend .small-caps;
    @apply font-bold;
  }
  table {
    @apply border-4;
    @apply border-black;
    @apply w-full;
    @apply mt-6;
    td, th {
      @apply py-1;
      @apply border;
      @apply border-gray-600;
    }
  }
</style>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
import PitMain from '@/components/PitMain.vue'
import PitClasses from '@/components/PitClasses.vue'
import PitTeaching from '@/components/PitTeaching.vue'
import PitResearch from '@/components/PitResearch.vue'
import PitExtension from '@/components/PitExtension.vue'
import PitAdmin from '@/components/PitAdmin.vue'
import PitSummary from '@/components/PitSummary.vue'

export default {
  name: 'Pit',
  computed: {
    ...mapState(['data']),
  },
  components: {
    PitMain,
    PitClasses,
    PitTeaching,
    PitResearch,
    PitExtension,
    PitAdmin,
    PitSummary,
  }
}
</script>