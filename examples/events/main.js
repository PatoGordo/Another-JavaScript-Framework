const fw = new Framework()

class App {
  selector = "app"
  
  // dynamic store
  store = new Store({
    state: {
      count: 0
    },
    mutation: {
      increment: (state) => {
        this.store.setState('count', state.count + 1)
      }
    }
  })
  
  onInit = () => {
    this.store.subscribe('count', (value, oldValue) => {
      console.log('count state changed from', oldValue, 'to', value)
    })
  }
  
  // increment method just call the increment mutation
  // IMPORTANT! all events except submit dont receive the event in callback
  // in callback they receive the html tag selector, and you can use it to get the event
  increment = (selector) => {
    console.log(selector)
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
