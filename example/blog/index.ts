import { Request, Express } from "express";
import { createRouter } from "../../src";
import definition from "../shared/definition";

import {
  getAll,
  getOne,
  create,
  updateOne,
  deleteAll,
  deleteOne,
} from "../blog/services";

const getId = (req: Request) => req.params.id;

const config = definition.withConfig({
  services: {
    getAll,
    deleteAll,
    get: (_, { request }) => getOne(getId(request)),
    create: (_, { request: { body } }) => create(body.post),
    delete: (_, { request }) => deleteOne(getId(request)),
    update: (_, { request: { body, params } }) => {
      return updateOne(params.id, body.post);
    },
  },
});

const router = createRouter(config);

export const api = createRouter(
  config.withConfig({
    actions: {
      create: function api(_, { response }) {
        response.sendStatus(2000);
      },
      returnAll: function api(_, { response, data }) {
        response.json({ data });
      },
      returnOne: function api(_, { response, data }) {
        response.json({ data });
      },
      redirectHome: function api(_, { response }) {
        console.log("should be here");
        response.sendStatus(200);
      },
    },
  })
);

export default router;
