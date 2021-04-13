# Overview

This is a light REST API framework that help developpers to fucus only on value added code. 

# Features
* Robust routing system
* Ready to use express app
* Rich logger managment
* Responses/errors handleling
* Easy External APIs connection

# Quick start
This is the quickest and simplest way to use **light-fmk**.
1. Install the framework
``` $ npm install --save-dev light-fmk```

2. Create an app
```
/* app.js */

import { App } from  'light-fmk';

const port = 3000;
const appName = 'REST_API';
const  app = new  App(port, appName);
...
/* loads middlewares and routes */
...
app.start();
```

## Add new endpoint
You need to create a controller class that extends the light-fmk Controller base class. Then use the anotation `@controller(...)` to register routes and the annotation `@request` before every **static class method** used to handle the endpoints.
```
/* controllers/test.controller.ts */
import { controller, Controller, request } from  'light-fmk';
import { Request, Response } from  'express';

@controller({
	basePath:  '',
	middlewares: [...], // Middlewares used for every endpoints defined by this controller 
	routes: [
		{
			path:  '/version',
			method:  'get',
			handler:  ApiController.getVersion,
			middlewares: [...], // Middlewares used for this endpoint
		},
		{
			path:  '/status',
			method:  'get',
			handler:  ApiController.getStatus
		}
	]
})
export  default  class  ApiController  extends  Controller {

	@request
	public  static  getVersion(req: Request, res: Response) {
		return  'v1.0';
	}

	@request
	public  static  getStatus(req: Request, res: Response) {
		return { node:  'up' };
	}
}
```

```
/* app.js */

...
const  controllerDir: string = `${__dirname}/controllers`;
const extension: string = '.*\\.controller.js'
await app.registerControllers(`api/v1.0`, controllerDir, extention); // load automatically all controllers in the controllerDir

app.start()
```

# API

## App
## ApiService
## Controller
## Logger
## ErrorHttp


# Usefull commands

*  `npm run server`: launch the test server
*  `npm run build:dev`: development in watching mode
*  `npm run lint`: check and correct when possible coding style
*  `npm test`: launch unit tests
