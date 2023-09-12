import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import * as seed from "./seed.js";

app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    resave: false,
    saveUninitialized: false,
  })
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

//middleware #7 logging requests  This applies to the entire application so no path is supplied as the first param
app.use((req, res, next) => {
  if (!req.session.user) {
    console.log(
      new Date().toUTCString() +
        ": " +
        req.method +
        " " +
        req.path +
        " : (Non-Authenticated User)"
    );
  } else {
    console.log(
      new Date().toUTCString() +
        ": " +
        req.method +
        " " +
        req.path +
        " : (Authenticated User)"
    );
  }
  next();
});

//Middleware #6
app.use("/logout", async (req, res, next) => {
  //This middleware will only be used for the GET /logout
  if (req.method === "GET") {
    if (!req.session.user) {
      //If a user is not logged in, you will redirect to the GET /login route
      return res.redirect("/login");
    } else {
      //if the user is logged in, the middleware will "fall through" to the next route calling the next() callback.
      next();
    }
  } else {
    //If req.method is not GET
    next();
  }
});

//middleware #5
app.use("/admin", async (req, res, next) => {
  //This middleware will only be used for the GET /admin
  if (req.method === "GET") {
    if (!req.session.user) {
      //If a user is not logged in, you will redirect to the GET /login route.
      return res.redirect("/login");
    } else {
      if (req.session.user.role !== "admin") {
        /*If a user is logged in, but they are not an admin user, you will redirect to /error and render a HTML error page saying that the user does not have permission to view the page, and the page must issue an HTTP status code of 403.
         */
        return res.redirect("/error");
      } else {
        //If the user is logged in AND the user has a role of admin, the middleware will "fall through" to the next route calling the next() callback.
        next();
      }
    }
  } else {
    //If req.method is not GET
    next();
  }
});


app.use("/profile", async (req, res, next) => {
  //This middleware will only be used for the GET /profile route
  if (req.method === "GET") {
    if (!req.session.user) {
      //If a user is not logged in, you will redirect to the GET /login route
      return res.redirect("/login");
    } else {
      /* If the user is logged in, the middleware will "fall through" to the next route calling the next() callback.
      Users with both roles admin or user should be able to access the /protected route, so you simply need to make sure they are authenticated in this middleware.
    */
      next();
    }
  } else {
    //If req.method is not GET
    next();
  }
});

//middleware #4
app.use("/protected", async (req, res, next) => {
  //This middleware will only be used for the GET /protected route
  if (req.method === "GET") {
    if (!req.session.user) {
      //If a user is not logged in, you will redirect to the GET /login route
      return res.redirect("/login");
    } else {
      /* If the user is logged in, the middleware will "fall through" to the next route calling the next() callback.
      Users with both roles admin or user should be able to access the /protected route, so you simply need to make sure they are authenticated in this middleware.
    */
      next();
    }
  } else {
    //If req.method is not GET
    next();
  }
});

//middleware #3
app.use("/register", async (req, res, next) => {
  //This middleware will only be used for the GET /register route
  if (req.method === "GET") {
    if (!req.session.user) {
      //If the user is NOT authenticated, you will allow them to get through to the GET /register route.
      next();
    } else {
      if (req.session.user.role === "admin") {
        //If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route
        return res.redirect("/admin");
      } else {
        //if the user is authenticated AND they have a role of user, you will redirect them to the /protected route
        return res.redirect("/protected");
      }
    }
  } else {
    //If req.method is not GET
    next();
  }
});

//middleware #2
app.use("/login", async (req, res, next) => {
  //This middleware will only be used for the GET /login route
  if (req.method === "GET") {
    if (!req.session.user) {
      //If the user is NOT authenticated, you will allow them to get through to the GET /login route.
      next();
    } else {
      if (req.session.user.role === "admin") {
        //If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route
        return res.redirect("/admin");
      } else {
        //If the user is authenticated AND they have a role of user, you will redirect them to the /protected route
        return res.redirect("/protected");
      }
    }
  } else {
    //If req.method is not GET
    next();
  }
});

//Middleware #1
// app.use("/", async (req, res, next) => {
//   //This middleware will apply to the root route /
//   //check to make sure the path is exactly "/" because this middleware will hit for anything like /admin, /register
//   // if (req.path === '/') {
//   //   if (!req.session.user) {
//   //     //If the user is NOT authenticated, you will redirect them to the GET /login route.
//   //     return res.redirect('/login');
//   //   } else {
//   //     if (req.session.user.role === 'admin') {
//   //       //If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route
//   //       return res.redirect('/admin');
//   //     } else {
//   //       //if the user is authenticated AND they have a role of user, you will redirect them to the /protected route
//   //       return res.redirect('/protected');
//   //     }
//   //   }
//   // } else {
//   //   //if the path is anything but /
//   //   next();
//   // }

//   return res.sendFile(path.join(__dirname, "../static", "homepage.html"));
// });

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
  },
  partialsDir: ["views/partials/"],
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  // let the next middleware run:
  next();
};

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

// Seed function for creating charities
await seed.createCharities();

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
