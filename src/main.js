import { Home } from "./pages/home.js"
import { About } from "./pages/about.js"
import { Hello } from "./pages/hello.js"
import { Page404 } from "./pages/404.js"

import { Navbar } from "./components/navbar.js"

const fm = new Framework()

class App {
  selector = "app"
  
  components = {
    navbar: new Navbar({ title: 'App' })
  }
  
  render() {
    return`
      <navbar/>
      <main id="router-view"></main>
    `
  }
  
  style() {
    return {
      lang: 'scss',
      content: `
        #app {
          display: flex;
          flex-direction: column;
          align-items: start;
          #router-view {
            width: 100%;
            padding: 16px;
            padding-top: 80px;
            display: flex;
            flex-direction: column;
            align-items: center
            h2 {
              text-align: center;
            }
          }
        }
      `
    }
  }
}

fm.render(
  new App(),
  document.querySelector("#app"),
  () => {
    const router = new Router({
      rootElement: document.querySelector('#router-view'),
      frameworkInstance: fm
    })
    
    router.route('/', Home)
    router.route('/about', About)
    router.route('/hello/:name', Hello)
    router.route404(Page404, { text: '404 - Page not found' })
    
    router.init()
  }
)
