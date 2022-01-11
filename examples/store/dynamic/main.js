const fw = new Framework()

class App {
  selector = "app"
  
  // dynamic store
  // the dynamic store is reactivity
  // when a dynamic state change all html state reference or subscriptions will be updated
  store = new Store({
    state: {
      count: 0
    },
    // mutations is store functions and can be called using store.commit('mutationName')
    mutation: {
      increment: (state) => {
        // setState is used to change a state value
        // store.setState('stateName', newStateValue)
        this.store.setState('count', state.count + 1)
      }
    }
  })
  
  // onInit will be called one time when app component is mounted
  onInit = () =>  {
    // subscribe is like listeners and they receive all the changes of states
    // subscribe('stateToListen', stateChangeCallback(currentValue, oldValue))
    this.store.subscribe('count', (value, oldValue) => {
      console.log('count state changed from', oldValue, 'to', value)
    })
  }
  
  // increment method just call the increment mutation
  increment = () => {
    this.store.commit('increment')
  }
  
  // {count} will to receive the count state value and will be updated if count state change
  // @click="increment" will call the method increment in every button click
  render() {
    return `
      <h1>You clicked {count} times!</h1>
      <button @click="increment">Increment one</button>
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
