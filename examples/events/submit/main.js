const fw = new Framework()

class App {
  selector = "app"
  
  // dynamic store
  store = new Store({
    state: {
      name: ''
    }
  })
  
  // only the event submit recive the event informations
  handleSubmit = (event, selector) => {
    event.preventDefault()
    console.log(selector)
    
    // IDK why but print the event makes all website slow
    // and the only reason of the submit be the only event to receive the event informations is the preventDefault
    // console.log(event)
    
    alert(`Hello ${this.store.state.name}`)
  }
  
  // when the form is submitted the handleSubmit method will be called
  render() {
    return `
      <form @submit="handleSubmit">
        <input #bind="name" placeholder="Your name" required />
        
        <button type="submit">Receive a hello 👋</button>
      </form>
    `
  }
}

fw.render(new App(), document.querySelector('#app'))
