const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const http = require("http");
const app = require("./src/app");
const logger = require("./src/logger/index");

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`worker ${worker.process.pid} died`, {
      id: require("uuid").v4(),
    });
  });
} else {
  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
}

// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);
// server.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
