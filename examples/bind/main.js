const fw = new Framework()

class App extends Component {
  selector = "app"
  
  state = {
    name: ''
  }
  
  // #bind is used to connect the value of an input and the component state
  render() {
    return `
      <h1>{ state.name }</h1>
      <input #bind="state.name" placeholder="Your name" />
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
