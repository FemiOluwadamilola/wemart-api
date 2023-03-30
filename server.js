// const cluster = require("cluster");
// const numCPUs = require("os").cpus().length;
const http = require("http");
const app = require("./src/app");

// if (cluster.isPrimary) {
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   const PORT = process.env.PORT || 5000;
//   const server = http.createServer(app);
//   server.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
// }

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
