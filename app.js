const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT256;

    // this.paths = '/cosas';

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/api", require("./routes/routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Corriendose en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
