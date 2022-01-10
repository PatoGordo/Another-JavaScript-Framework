export class Navbar {
  selector = "navbar"
  
  props = {}
  
  constructor(props) {
    this.props = props
  }
  
  render() {
    return`
      <nav>
        <h1>{props.title}</h1>
        
        <ul>
          <li><a href="/" data-navigo>Home</a></li>
          <li><a href="/about" data-navigo>About</a></li>
        </ul>
      </nav>
    `
  }
  
  style() {
    return {
      lang: 'scss',
      content: `
        nav {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: fixed;
          top: 0;
          padding: 16px;
          background: #7E57C2;
          color: #fff;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
          ul {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            list-style: none;
            li a {
              color: #fff;
              transition: all easy 300ms;
              text-decoration: none;
              &:hover {
                color: #42A5F5;
              }
            }
          }
        }
      `
    }
  }
}