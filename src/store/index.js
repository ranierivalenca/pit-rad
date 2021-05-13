import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from '../firebase'
import router from '../router/index'

const redirectTo = route => {
  if (router.currentRoute.path == route) return
  router.push(route)
}

// const fetchCollection = async (userDoc, collection) => {
//   return (await userDoc.collection(collection).get()).docs.map(doc => doc.data())
// }

// const loadClasses = () => {
//   console.log('loadClasses')
//   firebase.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
//     console.log('new snapshot')
//     let postsArray = snapshot.docs.map(doc => {
//       let post = doc.data()
//       post.id = doc.id

//       return post
//     })
//     console.log(postsArray)
//     store.commit('setPosts', postsArray)
//   })
// }

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    email: null,
    data: {},
    loading: {
      data: false,
      classes: false,
      teaching: false,
      research: false,
      extension: false,
    },
    classes: [],
    teaching: [],
    research: [],
    extension: [],
    admin: []
  },
  mutations: {
    setEmail(state, email) {
      state.email = email
    },
    setData(state, data) {
      state.data = data
    },
    setClasses(state, classes) {
      state.classes = classes
    },
    setTeaching(state, teaching) {
      state.teaching = teaching
    },
    setResearch(state, research) {
      state.research = research
    },
    setExtension(state, extension) {
      state.extension = extension
    },
    setAdmin(state, admin) {
      state.admin = admin
    },
    setLoading(state, [wat, status]) {
      // console.log(`state.${wat} = ${status}`)
      state.loading[wat] = status
    }
  },
  actions: {
    async fetchData({ commit, dispatch }, user) {
      let userDoc = await firebase.pitsCollection.doc(user.email)
      commit('setEmail', user.email)
      if (!(await userDoc.get()).exists) {
        return
      }
      dispatch('syncUserData', userDoc)
      dispatch('syncClasses', userDoc)
      dispatch('syncTeaching', userDoc)
      dispatch('syncResearch', userDoc)
      dispatch('syncExtension', userDoc)
      dispatch('syncAdmin', userDoc)
      redirectTo('/pit')
    },
    async syncUserData({ commit }, userDoc) {
      commit('setLoading', ['data', true])
      userDoc.onSnapshot(snapshot => {
        // console.group('snapshot')
        // console.log(snapshot.data())
        // console.groupEnd('snapshot')
        commit('setData', snapshot.data())
        commit('setLoading', ['data', false])
      })
    },
    async syncClasses({ commit }, userDoc) {
      commit('setLoading', ['classes', true])

      userDoc
      .collection('classes')
      .orderBy('sortKey')
      .onSnapshot(snapshot => {
        commit('setClasses', snapshot.docs.map(doc => doc.data()))
        commit('setLoading', ['classes', false])
      })
    },
    async syncTeaching({ commit }, userDoc) {
      commit('setLoading', ['teaching', true])

      userDoc
        .collection('teaching')
        .orderBy('sortKey')
        .onSnapshot(snapshot => {
          commit('setTeaching', snapshot.docs.map(doc => doc.data()))
          commit('setLoading', ['teaching', false])
        })
    },
    async syncResearch({ commit }, userDoc) {
      commit('setLoading', ['research', true])

      userDoc
        .collection('research')
        .orderBy('sortKey')
        .onSnapshot(snapshot => {
          commit('setResearch', snapshot.docs.map(doc => doc.data()))
          commit('setLoading', ['research', false])
        })
    },
    async syncExtension({ commit }, userDoc) {
      commit('setLoading', ['extension', true])

      userDoc
        .collection('extension')
        .orderBy('sortKey')
        .onSnapshot(snapshot => {
          commit('setExtension', snapshot.docs.map(doc => doc.data()))
          commit('setLoading', ['extension', false])
        })
    },
    async syncAdmin({ commit }, userDoc) {
      commit('setLoading', ['admin', true])

      userDoc
        .collection('admin')
        .orderBy('sortKey')
        .onSnapshot(snapshot => {
          commit('setAdmin', snapshot.docs.map(doc => doc.data()))
          commit('setLoading', ['admin', false])
        })
    },
    async login({ dispatch }) {
      await firebase.auth
        .signInWithPopup(firebase.googleAuthProvider)
        .then(async result => {
          let user = result.user
          let userDoc = await firebase.pitsCollection.doc(user.email)
          if (!(await userDoc.get()).exists) {
            await userDoc.set({
              name: user.displayName,
              campus: 'Igarassu',
              coord: '-',
              grupo: '-',
              regime: ''
            })
          }
          dispatch('fetchData', user)
        })
    },
    async logout({ commit }) {
      firebase.auth.signOut()

      commit('setEmail', null)
      commit('setData', {})
      redirectTo('/')
    },

    async updateData({ commit }, form) {
      commit('setLoading', ['data', true])

      let userDoc = await firebase.pitsCollection.doc(firebase.auth.currentUser.email)
      if (!(await userDoc.get()).exists) {
        return
      }
      console.log('now set')
      await userDoc.update({
        name: form.name,
        coord: form.coord,
        grupo: form.grupo,
        regime: form.regime
      })

      // dispatch('fetchUserData', userDoc)
    },

    async saveClasses({ commit }, classes) {
      commit('setLoading', ['classes', true])

      let userDoc = await firebase.pitsCollection.doc(firebase.auth.currentUser.email)
      if (!(await userDoc.get()).exists) {
        return
      }
      let docs = (await userDoc.collection('classes').get()).docs
      docs.map(doc => {
        let klass = classes.find(klass => klass.id == doc.id)
        if (!klass) {
          doc.ref.delete().then(() => { console.log('deleted') })
        }
      })
      classes.map(klass => {
        klass.sortKey = klass.curso + '-' + klass.disciplina
        klass.lastUpdate = new Date()
        userDoc.collection('classes').doc(klass.id).set(klass).then(() => { console.log('setted') })
      })
      // for (let klass of classes) {
      // }
      // console.log('dispatching')
      // dispatch('fetchClasses', userDoc)
    },

    async saveTeaching({ commit }, activities) {
      commit('setLoading', ['teaching', true])

      let userDoc = await firebase.pitsCollection.doc(firebase.auth.currentUser.email)
      if (!(await userDoc.get()).exists) {
        return
      }

      let docs = (await userDoc.collection('teaching').get()).docs
      docs.map(doc => {
        let activity = activities.find(activity => activity.id == doc.id)
        if (!activity) {
          doc.ref.delete().then(() => { console.log('deleted') })
        }
      })
      activities.map(activity => {
        activity.sortKey = activity.atividade
        activity.lastUpdate = new Date()
        userDoc.collection('teaching').doc(activity.id).set(activity).then(() => { console.log('setted') })
      })
    },

    async saveResearch({ commit }, activities) {
      commit('setLoading', ['research', true])

      let userDoc = await firebase.pitsCollection.doc(firebase.auth.currentUser.email)
      if (!(await userDoc.get()).exists) {
        return
      }

      let docs = (await userDoc.collection('research').get()).docs
      docs.map(doc => {
        let activity = activities.find(activity => activity.id == doc.id)
        if (!activity) {
          doc.ref.delete().then(() => { console.log('deleted') })
        }
      })
      activities.map(activity => {
        activity.sortKey = activity.atividade
        activity.lastUpdate = new Date()
        userDoc.collection('research').doc(activity.id).set(activity).then(() => { console.log('setted') })
      })
    },

    async saveExtension({ commit }, activities) {
      commit('setLoading', ['extension', true])

      let userDoc = await firebase.pitsCollection.doc(firebase.auth.currentUser.email)
      if (!(await userDoc.get()).exists) {
        return
      }

      let docs = (await userDoc.collection('extension').get()).docs
      docs.map(doc => {
        let activity = activities.find(activity => activity.id == doc.id)
        if (!activity) {
          doc.ref.delete().then(() => { console.log('deleted') })
        }
      })
      activities.map(activity => {
        activity.sortKey = activity.atividade
        activity.lastUpdate = new Date()
        userDoc.collection('extension').doc(activity.id).set(activity).then(() => { console.log('setted') })
      })
    },

    async saveAdmin({ commit }, activities) {
      commit('setLoading', ['admin', true])

      let userDoc = await firebase.pitsCollection.doc(firebase.auth.currentUser.email)
      if (!(await userDoc.get()).exists) {
        return
      }

      let docs = (await userDoc.collection('admin').get()).docs
      docs.map(doc => {
        let activity = activities.find(activity => activity.id == doc.id)
        if (!activity) {
          doc.ref.delete().then(() => { console.log('deleted') })
        }
      })
      activities.map(activity => {
        activity.sortKey = activity.atividade
        activity.lastUpdate = new Date()
        userDoc.collection('admin').doc(activity.id).set(activity).then(() => { console.log('setted') })
      })
    },
  },
  modules: {
  }
})

export default store