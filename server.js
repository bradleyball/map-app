const { ApolloServer } = require("apollo-server");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const mongoose = require("mongoose");
const { findOrCreateUser } = require("./controllers/userController");
require("dotenv").config();

mongoose
  .connect(`${process.env.DB_CONFIG}`, {
    useNewUrlParser: true
  })
  .then(() => console.log("db connected"))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.err(`Unable to authenticate user with token ${authToken}`);
    }
    return { currentUser };
  }
});

server.listen().then(({ url }) => {
  console.log(`server is listening on ${url}`);
});
