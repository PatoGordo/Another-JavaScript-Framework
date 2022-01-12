const fw = new Framework()

class HelloWorld extends Component {
  selector = "hello-world"
 
  state = {
    title: "Hello World"
  }
  
  onInit() {
    console.log("hello-world", "mounted")
  }
  
  render() {
    return`
      <h1>{ state.title }</h1>
    `
  }
}

class App extends Component {
  selector = "app"
  
  // just inform to the framework about the component HelloWorld into this component
  components = [
    new HelloWorld()
  ]
  
  onInit = () => {
    console.log("title state from hello-world component:", this.components[0].state.title)
  }
  
  // to use a component you need to include fisrt the parent selector and after the child selector
  // <parent_selector-child_selector />
  // the framework will replace the <app-hello-world/> to the HelloWorld html content
  render() {
    return `
      <app-hello-world/>
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
