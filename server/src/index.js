const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const connect = require("./utils/db");
const auth = require("./utils/auth");
const typeDefs = require("./types/typeDefs");
const resolvers = require("./resolvers/index");
require("dotenv").config(); // Load environment variables from .env file

const port = process.env.PORT || 5555;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", ""); // Remove "Bearer " prefix
  
    let user = null;
    if (token) {
      try {
        user = auth.verifyToken(token); // Verify the token
      } catch (err) {
        console.error("Token verification failed:", err.message);
      }
    }
  
    return { user };
  },
  formatError: (err) => {
    console.error(err);
    return err;
  }
});



async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  connect().then(() => {
    // console.log(`${port} connected to Database `);
  });
  

  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    // console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  
  });
}

startServer();



