export class Form {
  selector = "form"
  
  store = new Store({
    state: {
      name: ""
    }
  })
  
  // you can access the event only in submit
  handleSubmit = (e) => {
    e.preventDefault()
    
    // to access router in no page components you can use window.navigo or just navigo
    navigo.navigate(`/hello/${this.store.state.name}`)
  }
  
  render() {
    return`
      <form class="form" @submit="handleSubmit">
        <h3>Hello {name} 👋!</h3>
        <input #bind="name" placeholder="Your name" required />
        
        <button type="submit">Go to hello page</button>
      </form>
    `
  }
  
  style() {
    return {
      lang: 'scss',
      content: `
        .form {
          display: flex;
          flex-direction: column;
          align-items: start;
          gap: 12px;
          input {
            width: 50%;
            padding: 12px 16px;
            border-radius: 6px;
            border: 1px solid #333;
          }
          button {
            width: 50% ;
            padding: 12px 16px;
            background: #03A9F4;
            color: #fff;
            border: 0;
            border-radius: 6px;
            transition: filter .3s;
            &:hover {
              filter: brightness(0.8);
            }
          }
        }
      `
    }
  }
}