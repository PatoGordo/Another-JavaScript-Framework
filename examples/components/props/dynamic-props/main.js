const fw = new Framework()

class HelloWorld {
  selector = "hello-world"
 
  // dynamic store
  store = new Store({
    state: {
      title: "Hello World"
    }
  })
  
  render() {
    return`
      <h1>{title}</h1>
    `
  }
}

class App {
  selector = "app"
  
  components = {
    "hello-world": new HelloWorld()
  }
  
  // dynamic store
  store = new Store({
    state: {
      input: ''
    }
  })
  
  // this subscribe will the all changes in input state
  // the subscribe action will get the new state value and reassign the HelloWorld title state to the input state value
  onInit = () => {
    this.store.subscribe('input', (value) => {
      this.components['hello-world'].store.setState('title', value)
    })
  }
  
  render() {
    return `
      <hello-world/>
      <input #bind="input" placeholder="Choose the new title" />
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
