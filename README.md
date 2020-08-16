# SpruceJS

## Getting started

The easiest way to start a SpruceJS project is by installing the CLI globally on your machine. You can do that with:

```bash
npm i -g @sprucejs/cli
```

Once this has installed, you'll find its behaviour very similar to the Angular and Nest CLI. Start a new project using:

```bash
spr new my-project-name
```

This will create a folder, place all of the starter files inside it and install the necessary dependencies.

## Adding some features.

To add some routes to your app, try running:

```bash
spr generate routes user
```

or

```bash
spr g r user
```

By using the CLI, it will automatically add them to the nearest module. Spruce tries its best to guess what route path you want, but you can go ahead and change it if it didn't get it spot on. Lets take a look at what it's done.

```typescript
export const appModule: IModule = {
  imports: [],
  providers: [UserController],
  routes: [{ url: '/user', router: UserRouter }]
};
```

Now, let's also make a controller.

```bash
spr g c user
```

As you may notice, Spruce will group your routes and controller in to a folder, to keep your code nice and modular. If you want to customise where these go, you can just use the direct URL instead of just the name of the file that you want to create. For example:

```bash
spr g c not-user-folder/user
```

In our controller, we can make methods available for our router to use. Any method in a controller _must_ be asynchronous, in order to utilise the asynchronous behaviour of NodeJS. Don't worry, TypeScript will scream at you if you forget. This function also needs to adhere to the express middleware function prototype, which takes the `req`, `res`, and `next` arguments.

```typescript
export class UserController {
  public async getAll(req: IReq, res: IRes, next: INext): Promise<string> {
    return 'allUsers';
  }
}
```

In our routes file, we can now hook this up by using the Spruce router service. That file should look something like this:

```typescript
@injectable()
export class UserRouter extends CoreRouter {
  constructor(
    routerService: RouterService,
    private readonly _userController: UserController
  ) {
    super(routerService);
  }

  protected _generateRoutes(): void {
    this.routerService.get('/hello', this._userController.getAll.bind(this));
  }
}
```

## Commands

You can take a look at the `package.json` file that gets generated to view the npm commands. To start the server, type `npm run dev` in to the command line and watch as Spruce sets up the application for you.

## Advanced Routing

The place that Spruce really shines is routing. Spruce was built to be able to modularise routing within express and allow easy handling of child routes. Lets take a look at what we can do:

```typescript
export const appModule: IModule = {
  imports: [],
  providers: [UserController, TodoController, SubtaskController],
  routes: [
    {
      url: '/users',
      router: UserRouter,
      children: [
        {
          url: '/:userId/todos',
          router: TodoRouter,
          children: [{ url: '/:todoId/subtasks', router: SubtaskRouter }]
        }
      ]
    }
  ]
};
```

What we've done here is allowed the user and todo routes to not only be accessible on their own, but also used as part of the URL for another resource.

The subtask resource will be accessible via `/users/{userId}/todos/{todoId}/subtasks`, and the values for each id will be stored in the `req.params` object for easy access.
