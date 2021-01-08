// @ts-ignore
import path from "path";

// @ts-ignore
import express, { Request, Response, Router } from "express";

// @ts-ignore
import bodyParser from "body-parser";

import Blog, { api as BlogApi } from "./blog";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../../views"));
app.use(express.static(path.join(__dirname, "../../public")));

app.use("/api", BlogApi);
app.use(Blog);

const config = {
  routes: {
    "/": {
      on: {
        GET: "home",
      },
    },
    "/create": {
      on: {
        GET: (req: Request, res: Response) => {
          console.log(req.originalUrl);
          res.send("create");
        },
      },
    },
    "/:id": {
      on: {
        GET: ({ params, originalUrl }: Request, res: Response) => {
          console.log(originalUrl);
          res.send("item " + params.id);
        },
      },
    },
  },
  actions: {
    home: (req: Request, res: Response) => {
      console.log(req.originalUrl);
      res.send("home");
    },
  },
};

function create(config: any, mapping?: any) {
  const router = Router();
  const { actions, routes } = config;

  Object.keys(routes).forEach((path) => {
    const { on } = routes[path];
    const _path = mapping?.[path] ?? path;

    Object.keys(on).forEach(() => {
      router.all(_path, (req, res, next) => {
        const action = on[req.method];
        const _action = typeof action === "string" ? actions[action] : action;
        _action(req, res);
      });
    });
  });

  return router;
}

// const routerA = create(config);

// const routerB = create(config);

// app.use("/api", routerB);
// app.use(routerA);

app.listen(8080, () => {
  console.log("Server started");
});
