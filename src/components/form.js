export class Form extends Component {
  selector = "form"
  
  state = {
    name: ""
  }
  
  // you can access the event only in submit
  handleSubmit = (e) => {
    e.preventDefault()
    
    // to access router in no page components you can use window.navigo or just navigo
    navigo.navigate(`/hello/${this.state.name}`)
  }
  
  render() {
    return`
      <form class="form" @submit="handleSubmit">
        <h3>Hello { state.name } 👋!</h3>
        <input #bind="state.name" placeholder="Your name" required />
        
        <button type="submit">Go to hello page</button>
      </form>
    `
  }
}