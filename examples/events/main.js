const fw = new Framework()

class App extends Component {
  selector = "app"
  
  state = {
    count: 0
  }
  
  mutation = {
    increment: (state) => {
      this.setState({
        count: state.count + 1
      })
    }
  }
  
  onInit = () => {
    this.subscribe('count', (value, oldValue) => {
      console.log('count state changed from', oldValue, 'to', value)
    })
  }
  
  // increment method just call the increment mutation
  increment = (e) => {
    console.log(e)
    this.commit('increment')
  }
  
  // { state.count } will to receive the count state value and will be updated if count state change
  // @click="increment" will call the method increment in every button click
  render() {
    return `
      <h1>You clicked { state.count } times!</h1>
      <button @click="increment">Increment one</button>
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
