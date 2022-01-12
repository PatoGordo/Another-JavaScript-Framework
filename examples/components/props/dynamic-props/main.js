const fw = new Framework()

class HelloWorld extends Component {
  selector = "hello-world"
 
  state = {
    title: "Hello World"
  }
  
  render() {
    return`
      <h1>{ state.title }</h1>
    `
  }
}

class App extends Component {
  selector = "app"
  
  components = [
    new HelloWorld()
  ]
  
  state = {
    input: ''
  }
  
  // this subscribe will the all changes in input state
  // the subscribe action will get the new state value and reassign the HelloWorld title state to the input state value
  onInit = () => {
    this.subscribe('input', (value) => {
      this.components[0].setState({
        title: value
      })
    })
  }
  
  render() {
    return `
      <app-hello-world/>
      <input #bind="state.input" placeholder="Choose the new title" />
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
