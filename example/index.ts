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

app.listen(8080, () => {
  console.log("Server started");
});
