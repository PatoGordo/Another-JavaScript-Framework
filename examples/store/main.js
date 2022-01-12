// this a fake authentication store
// this store can be used in more than one component
// this store can also be used without a component

// dynamic store
// the dynamic store is reactivity
// when a dynamic state change all html state reference or subscriptions will be updated
const authStore = new Store({
  state: {
    username: '',
    password: '',
    token: localStorage.getItem('token') || ''
  },
  // mutations is store functions and can be called using store.commit('mutationName')
  mutation: {
    signIn() {
      signInWithUsernameAndPassword(authStore.state.username, authStore.state.password)
        .then((token) => {
          authStore.setState({
            token
          })
        })
        .catch((err) => {
          alert(err.message)
        })
    }
  }
})

// subscribe is like listeners and they receive all the changes of states
// subscribe('stateToListen', stateChangeCallback(currentValue, oldValue))
authStore.subscribe('token', (value) => {
  validateToken(value)
    .then(() => {
      localStorage.setItem('token', value)
      navigo.navigate('/profile')
    })
    .catch(() => {
      alert("Invalid token!")
      authStore.setState({
        token: ''
      })
    })
})