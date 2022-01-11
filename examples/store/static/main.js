const fw = new Framework()

class App {
  selector = "app"
  
  // static store
  // it can be reassigned but the html will not receive the update
  store = {
    state: {
      name: 'John Doe'
    }
  }
  
  // {name} will be replaced by name state and will not be updated if the state change
  render() {
    return `
      <h1>{name}</h1>
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
