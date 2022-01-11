const fw = new Framework()

class HelloWorld {
  selector = "hello-world"
 
  // static store
  store = {
    state: {
      title: "Hello World"
    }
  }
  
  onInit() {
    console.log("hello-world", "mounted")
  }
  
  render() {
    return`
      <h1>{title}</h1>
    `
  }
}

class App {
  selector = "app"
  
  // just inform to the framework about the component HelloWorld into this component
  components = {
    "hello-world": new HelloWorld()
  }
  
  onInit = () => {
    console.log("title state from hello-world component:", this.components["hello-world"].store.state.title)
  }
  
  // the framework will replace the <hello-world/> to the HelloWorld html content
  render() {
    return `
      <hello-world/>
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
