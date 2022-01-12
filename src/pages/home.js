import { Counter } from "../components/counter.js"
import { Form } from "../components/form.js"

export class Home extends Component {
  selector = "home"
  
  components = [
    new Counter(),
    new Form()
  ]
  
  render() {
    return`
      <h2>Home page</h2>
      <br />
      <home-counter/>
      <br />
      <br />
      <home-form/>
    `
  }
}
