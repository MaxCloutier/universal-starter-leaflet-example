
<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1016365/10639063/138338bc-7806-11e5-8057-d34c75f3cafc.png" alt="Universal Angular" height="320"/>
</p>

# Angular Universal Starter (with Leaflet.js) [![Universal Angular](https://img.shields.io/badge/universal-angular2-brightgreen.svg?style=flat)](https://github.com/angular/universal)

Please see the original repo for more details on Angular Universal and getting started. This repo serves as a demo/workaround for getting Leaflet.js (and probably other libraries that rely heavily on the DOM) working with server-side rendering.

## Getting Started

### Installation
* `npm install` or `yarn`

### Development (Client-side only rendering)
* run `npm run start` which will start `ng serve`

### Production (also for testing SSR/Pre-rendering locally)
**`npm run build:ssr && npm run serve:ssr`** - Compiles your application and spins up a Node Express to serve your Universal application on `http://localhost:4000`.

**`npm run build:prerender && npm run serve:prerender`** - Compiles your application and prerenders your applications files, spinning up a demo http-server so you can view it on `http://localhost:8080`
**Note**: To deploy your static site to a static hosting platform you will have to deploy the `dist/browser` folder, rather than the usual `dist`


## The Workaround using 'Universal Gotchaes'

Unfortunately, the Leaflet library relies upon various global variables (such as Window) when initialised. Even mocking these variables doesn't get us very far. So what do we do?

We only import the Leaflet library on the client, of course! This is one such method for approaching this.

1. In map.service.ts, we check whether the current platform is the browser. If so, we perform the import of leaflet and store it on the service.

```
    constructor(@Inject(PLATFORM_ID) private  platformId: Object)  {
          if (isPlatformBrowser(platformId)) {
            this.L  =  require('leaflet');
          }
        }
```

2. We can then use the L field on the service as the global L namespace.

```this.map  =  this.mapService.L.map('map').setView([51.505,  -0.09],  13);```

If the L field is null, then our component should not run any map code.

3. We can still use the type definitions of leaflet (e.g. `private  circle: Circle;`), but we must make sure to always use the mapService's L object for actual implementation (e.g. `this.circle  =  this.mapService.L.circle(...)`). Failing to do this will lead to Leaflet being imported globally, and the server platform will fail to build.

Following this approach, we can write Angular universal apps that will render the majority of our app, get sent over to the client, where the client will import and render the missing Leaflet components.

# License
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)
