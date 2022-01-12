class Framework {
  frameworkPrefix = "fw";
  components = {};
  extensions = {};

  directives = {
    bind: {
      event: "input",
      propSelector: `${this.frameworkPrefix}-input-bind`,
      action: (directive, component) => {
        document.querySelectorAll(`[${directive.selector}`).forEach((elm) => {
          if (elm.getAttribute(directive.propSelector).includes("state.")) {
            const state = elm
              .getAttribute(directive.propSelector)
              .replace("state.", "")
              .trim();

            component.subscribe(state, (value) => {
              elm.value = value;
            });

            elm.addEventListener("input", (e) => {
              component._setState(state, e.target.value);
            });
          } else {
            console.error("You can use #bind directive just with states");
          }
        });
      },
    },
  };
  
  allowStyles = false
  
  safeText(str) {
    return String(str).replace(/[^\w. ]/gi, function(c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }
  
  GenerateId(len, base) {
    base = base || "abcdefghijklmnopqrstuvwxyz0123456789";
  
    var randomString = "";
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * base.length);
      randomString += base.substring(randomPoz, randomPoz + 1);
    }
  
    return randomString;
  }

  render(component, el, afterRendered) {
    this.renderComponent(component, el, afterRendered);
  }

  renderComponent(component, el, afterRendered) {
    const { onInit, render, style, components, props, state } = component;

    let templateActions = [];
    let eventsSelectors = [];
    let nestedComponentsSelectors = [];
    let directivesSelectors = [];
    let submitsSelectors = [];

    let template = render ? String(render()) : null;
    let styles = style ? style() : null;

    component.beforeInit();
    
    if (!component.selector) {
      return console.error("There is a component without a selector")
    }

    const formatTemplate = new Promise((resolve, reject) => {
      if (!template) {
        return;
      }
      if (component) {
        const re = /{([^}]+)}/g;
        let text = "";

        while ((text = re.exec(template))) {
          const tagSelector = `${this.frameworkPrefix}-${
            component.scope
          }-property-${this.GenerateId(6)}`;

          if (text[1].trim().includes("state.")) {
            template = template.replaceAll(
              `{${text[1]}}`,
              `<${tagSelector}>${this.safeText(
                component.state[`${text[1].trim().split("state.")[1]}`]
              )}</${tagSelector}>`
            );

            templateActions.push({
              selector: tagSelector,
              action: text[1].trim(),
            });
          } else {
            if (text[1].trim().includes("()")) {
              template = template.replaceAll(
                `{${text[1]}}`,
                `<${tagSelector}>${this.safeText(
                  component[`${text[1].replace("()", "").trim()}`]()
                )}</${tagSelector}>`
              );
            } else if (text[1].trim().includes(".")) {
              template = template.replaceAll(
                `{${text[1]}}`,
                `<${tagSelector}>${this.safeText(
                  component[`${text[1].trim()}`]
                )}</${tagSelector}>`
              );

              templateActions.push({
                selector: tagSelector,
                action: text[1].trim(),
              });
            } else {
              template = template.replaceAll(
                `{${text[1]}}`,
                `<${tagSelector}>${this.safeText(
                  component[`${text[1].trim()}`]
                )}</${tagSelector}>`
              );
            }
          }
        }
      }

      if (component.components.length) {
        const re = /<(.*?)\/>/g;
        let text = "";

        while ((text = re.exec(template))) {
          if (
            text[1].trim().includes(component.selector + "-") &&
            component.components.find(
              (comp) =>
                comp.selector ===
                text[1].trim().split(`${component.selector}-`)[1].trim()
            )
          ) {
            const tagSelector = `${this.frameworkPrefix}-${
              component.scope
            }-component-${this.GenerateId(6)}`;

            template = template.replaceAll(
              `<${text[1]}/>`,
              `<${tagSelector}></${tagSelector}>`
            );

            nestedComponentsSelectors.push({
              selector: tagSelector,
              component:
                component.components.find(
                  (comp) =>
                    comp.selector ===
                    `${text[1]
                      .trim()
                      .split(`${component.selector}-`)[1]
                      .trim()}`
                ) || null,
            });
          }
        }
      }

      if (component) {
        for (let x in window) {
          if (/\bon/.test(x)) {
            let event = x.replace("on", "");
            if (template.includes(`@${event}="`)) {
              template.match(/(?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*')/g).forEach((x) => {
                x = x.replaceAll('"', "").trim();
                const tagSelector = `${this.frameworkPrefix}-${
                  component.scope
                }-event-${event}-${this.GenerateId(6)}`;
                template = template.replaceAll(`@${event}="${x}"`, tagSelector);
                eventsSelectors.push({
                  selector: tagSelector,
                  event,
                  action: component[x] || null,
                });
              });
            }
          }
        }
      }

      if (this.directives) {
        Object.keys(this.directives).forEach((directive) => {
          const tagSelector = `${this.frameworkPrefix}-${
            component.scope
          }-directive-${directive}-${this.GenerateId(6)}`;

          if (template.includes(`#${directive}`)) {
            template = template.replaceAll(
              `#${directive}`,
              `${tagSelector} ${this.directives[directive].propSelector}`
            );
            directivesSelectors.push({
              selector: tagSelector,
              event: this.directives[directive].event,
              propSelector: this.directives[directive].propSelector,
              action: this.directives[directive].action,
            });
          }
        });
      }

      resolve();
    }).then(() => {
      const mountComponent = new Promise((resolve, reject) => {
        if (el?.length) {
          el.forEach((elm) => {
            elm.innerHTML += template;
          });
        } else {
          el.innerHTML = template;
        }

        if (templateActions) {
          templateActions.forEach((templateAction) => {
            if (templateAction.action.includes("state.")) {
              component.subscribe(
                templateAction.action.split("state.")[1],
                (value) => {
                  document
                    .querySelectorAll(`${templateAction.selector}`)
                    .forEach((elm) => {
                      elm.textContent = value;
                    });
                }
              );
            } else {
              document
                .querySelectorAll(`${templateAction.selector}`)
                .forEach((elm) => {
                  let actualPath = component;

                  Array.from(templateAction.action.split(".")).forEach(
                    (act) => {
                      actualPath = actualPath[act];
                    }
                  );

                  elm.textContent = actualPath;
                });
            }
          });
        }

        if (eventsSelectors) {
          eventsSelectors.forEach((eventSelector) => {
            document
              .querySelectorAll(`[${eventSelector.selector}]`)
              .forEach((elm) => {
                elm.addEventListener(eventSelector.event, eventSelector.action);
              });
          });
        }

        if (nestedComponentsSelectors.length) {
          nestedComponentsSelectors.forEach((nestedComponent) => {
            this.render(
              nestedComponent.component,
              document.querySelectorAll(nestedComponent.selector)
            );
          });
        }

        if (directivesSelectors) {
          directivesSelectors.forEach((directiveSelector) => {
            directiveSelector.action(directiveSelector, component);
          });
        }
        
        resolve()
      });

      mountComponent.then(() => {
        if (this.allowStyles) {
          if (!component.style) {
            return
          }
        
          const styles = component.style()
        
          window.addStyle({
            lang: styles.lang || null,
            cacheScope: styles.cacheScope,
            text: styles.content
          })
        }
        
        onInit ? onInit() : null;
        afterRendered ? afterRendered() : null;
       });
    });
  }
}

class Store {
  state = {};
  mutation = {};
  subscribers = [];

  commit(mutation) {
    this.mutation[mutation](this.state);
  }

  subscribe(target, action) {
    this.subscribers.push({
      target,
      action,
    });
  }

  _setState(target, value) {
    const oldValue = this.state[target];

    this.state[target] = value;

    this.stateChanged(target, value, oldValue);
  }

  setState(newStates) {
    Object.keys(newStates).forEach((state) => {
      this._setState(state, newStates[state]);
    });
  }

  stateChanged(target, value, oldValue) {
    if (this.subscribers) {
      this.subscribers.forEach((subscriber) => {
        if (subscriber.target === target) {
          subscriber.action(value, oldValue);
        }
      });
    }
  }
}

class Component extends Store {
  scope = this.GenerateId(6);

  selector = null

  state = {};
  mutation = {};
  components = [];

  constructor() {
    super();
  }
  
  beforeInit() {}

  onInit() {}
  
  safeText(str) {
    return String(str).replace(/[^\w. ]/gi, function(c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }
  
  GenerateId(len, base) {
    base = base || "abcdefghijklmnopqrstuvwxyz0123456789";
    
    var randomString = "";
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * base.length);
      randomString += base.substring(randomPoz, randomPoz + 1);
    }
    
    return randomString;
  }

  render() {
    return ``;
  }
}

class Router {
  el = "";
  frameworkInstance = null;
  routes = {};
  _route404 = null;
  router = null;

  constructor({ rootElement, frameworkInstance }) {
    if (typeof Navigo === undefined) {
      console.warn(
        'To use router you need to add the navigo cdn to your html head (<script src="https://unpkg.com/navigo"></script>)'
      );
      return;
    }

    this.frameworkInstance = frameworkInstance;
    this.el = rootElement;
    this.router = new Navigo("/", { hash: true, linksSelector: "a" });
  }

  route(path, component, props) {
    this.routes[path] = {
      component,
      props,
    };
  }

  route404(component, props) {
    this._route404 = {
      component,
      props,
    };
  }

  hooks(_hooks) {
    this.router.hooks(_hooks);
  }

  init() {
    const mountRoutes = new Promise((resolve, reject) => {
      Object.keys(this.routes).forEach((route) => {
        this.router.on(route, (match) => {
          this.frameworkInstance.render(
            new this.routes[route].component(this.routes[route].props || {}, {
              match,
              router: this.router,
            }),
            this.el
          );
        });
      });

      if (this._route404) {
        this.router.notFound((match) => {
          this.frameworkInstance.render(
            new this._route404.component(this._route404.props || {}, {
              match,
              router: this.router,
            }),
            this.el
          );
        });
      }

      resolve();
    }).then(() => {
      window["navigo"] = this.router;
      this.router.resolve();
    });
  }
}

class Style {
  frameworkInstance = null
  defaultLanguage = 'css'
  allowCache = true

  constructor({ frameworkInstance, defaultLanguage, allowCache }) {
    this.defaultLanguage = defaultLanguage || 'css'
    this.allowCache = allowCache || 'true'
    this.frameworkInstance = frameworkInstance
  }

  add = ({ cacheScope, lang, text }) => {
    if (!cacheScope && this.allowCache) {
      return console.error("To use cache you also need to add cacheScope in the style return")
    }
    
    lang = lang? lang : this.defaultLanguage
    
    if (lang === "scss" || lang === "sass") {
      if (typeof Sass === undefined) {
        console.warn(
          'To use sass or scss you need to add the sass.js cdn to your html head (<script src="https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js"></script>)'
        );
        return;
      }
      
      this.sass(lang, text, cacheScope)
    } else {
      this.css(text, cacheScope)
    }
  }

  sass = (lang, text, scope) => {
    Sass.compile(text.trim(),
      { indentedSyntax: lang === 'sass'? true : false },
      (compiledCss) => {
        this.css(compiledCss.text, scope)
      }
    )
  }

  css = (text, scope) => {
    let frameworkCssTag = document.querySelector(
      `#fw-styles-global`
    );
    
    if (frameworkCssTag) {
      if (this.allowCache) {
        frameworkCssTag.textContent += this.getCache(scope)
        if (this.getCache(scope) !== text) {
          this.setCache(scope, text)
          frameworkCssTag.textContent += text;
        }
      } else {
        frameworkCssTag.textContent += text;
      }
    } else {
      frameworkCssTag = document.createElement("style");
      frameworkCssTag.id = `fw-styles-${scope}`;
      document.head.appendChild(frameworkCssTag);
      if (this.allowCache) {
        frameworkCssTag.textContent += this.getCache(scope)
        if (this.getCache(scope) !== text) {
          this.setCache(scope, text)
          frameworkCssTag.textContent += text;
        }
      } else {
        frameworkCssTag.textContent += text;
      }
    }
  }

  setCache(scope, text) {
    localStorage.setItem(`fw-styles-cached-style-${scope}`, text)
  }
  
  getCache(scope) {
    return localStorage.getItem(`fw-styles-cached-style-${scope}`) || null
  }
  
  init = () => {
    this.frameworkInstance.allowStyles = true
    window['addStyle'] = this.add
  }
}

window["Framework"] = Framework;
window["Store"] = Store;
window["Component"] = Component;
window["Router"] = Router;
window['Style'] = Style;
