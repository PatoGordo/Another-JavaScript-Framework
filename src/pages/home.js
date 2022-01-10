import { Counter } from "../components/counter.js"
import { Form } from "../components/form.js"

export class Home {
  selector = "home"
  
  components = {
    counter: new Counter(),
    form: new Form()
  }
  
  render() {
    return`
      <h2>Home page</h2>
      <br />
      <counter/>
      <br />
      <br />
      <form/>
    `
  }
}
