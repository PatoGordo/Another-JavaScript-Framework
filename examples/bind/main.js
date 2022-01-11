const fw = new Framework()

class App {
  selector = "app"
  
  // dynamic store
  store = new Store({
    state: {
      name: ''
    }
  })
  
  // #bind can only be used with dynamic store
  render() {
    return `
      <h1>{name}</h1>
      <input #bind="name" placeholder="Your name" />
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
