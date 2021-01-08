import { Definition } from "../../src";

const definition = Definition(
  {
    routes: {
      "/": {
        on: {
          GET: "getAll",
          DELETE: "deleteAll",
        },
        services: {
          getAll: {
            invoke: {
              src: "getAll",
              onDone: "returnAll",
            },
          },
          deleteAll: {
            invoke: {
              src: "deleteAll",
              onDone: "redirectHome",
            },
          },
        },
      },
      "/create": {
        on: {
          POST: "create",
          GET: {
            action: "create",
          },
        },
        services: {
          create: {
            invoke: {
              src: "create",
              onDone: "redirectHome",
            },
          },
        },
      },
      "/:id": {
        on: {
          GET: "get",
          PUT: "update",
          DELETE: "delete",
        },
        services: {
          get: {
            invoke: {
              src: "get",
              onDone: "returnOne",
            },
          },
          update: {
            invoke: {
              src: "update",
              onDone: "redirectHome",
            },
          },
          delete: {
            invoke: {
              src: "delete",
              onDone: "redirectHome",
            },
          },
        },
      },
    },
  },
  {
    actions: {
      create: (_, { response }) => {
        response.render("blog/create");
      },
      returnAll: (_, { response, data }) => {
        response.render("blog/index", { data });
      },
      returnOne: (_, { response, data }) => {
        response.render("blog/post", { data });
      },
      redirectHome: (_, { response }) => {
        response.redirect("/");
      },
    },
  }
);

export default definition;
