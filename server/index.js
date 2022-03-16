const { GraphQLServer, PubSub } = require("graphql-yoga");

//create new instance
const pubsub = new PubSub();

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    text: String!
  }
  type Query {
    messages: [Message!]
  }
  type Mutation {
    postMessage(user: String!, text: String!): ID!
  }
  type Subscription {
    messages: [Message!]
  }
`;



const messages = []; //store messages
const messageNew = [];

//to push new users to the messageNew array
const onMessagesUpdates = (fn) => messageNew.push(fn);

const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, { user, text }) => {
            const id = messages.length;
            messages.push({ id, user, text });
            messageNew.forEach((fn) => fn());
            return id;
        },
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                //create random number as the channel to publish messages to
                const channel = Math.random().toString(36).slice(2, 15);

                //push the user to the subscriber array with onMessagesUpdates function and publish updated messages array to the channel as the callback
                onMessagesUpdates(() => pubsub.publish(channel, { messages }));

                //show messages in real-time
                setTimeout(() => pubsub.publish(channel, { messages }), 0);
                return pubsub.asyncIterator(channel);
            },
        },
    },
}



const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
    console.log(`Server on http://localhost:${port}/`);
});
