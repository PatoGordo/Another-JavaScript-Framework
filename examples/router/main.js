// IMPORTANT!! to use router you need to add navigo cdn to your html head
// <script src="https://unpkg.com/navigo"></script>

const fm = new Framework()

class App {
  selector = "app"
  
  render() {
    return`
      <main id="router-view"></main>
    `
  }
}

class Home {
  selector = "home"
  
  goToAbout = () => {
    // navigo is a global router instance
    navigo.navigate('/about')
  }
  
  render() {
    return`
      <h1>Home works</h1>
      <br />
      <button @click="goToAbout">Go to about page</button>
    `
  }
}

class About {
  selector = "about"

  // use the href="#/routePath" to redirect to another page without reload
  render() {
    return `
      <h1>About works</h1>
      <br />
      <a href="#/404">Go to 404 page</a>
    `
  }
}

class Page404 {
  selector = "404"
  
  props = {}
  
  // you can also receive props in a pageComponent
  constructor(props) {
    this.props = props
  }

  render() {
    return `
      <h1>{props.text}</h1>
      <br />
      <a href="#/">Return to home</a>
    `
  }
}

// render(componentInstanceToRender, elementWhereWillBeRendered, afterRenderCallback)
fm.render(
  new App(),
  document.querySelector("#app"),
  () => {
    // rootElement is where all pages will be rendered
    const router = new Router({
      rootElement: document.querySelector('#router-view'),
      frameworkInstance: fm
    })
    
    // router.route('path', componentClass, props)
    router.route('/', Home) 
    router.route('/about', About) 
    router.route404(Page404, { text: '404 - Page not found' })
    
    // IMPORTANT!! before you define your routes you need to init the router using router.init()
    router.init()
  }
)
