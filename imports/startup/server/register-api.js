import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { WebApp } from 'meteor/webapp'
import { getUser } from 'meteor/apollo'
import express from 'express';
import http from 'http';

import merge from 'lodash/merge';

import UserSchema from '../api/user/User.graphql';
import UserResolvers from '../api/user/resolvers.js';

import PageSchema from '../api/page/Page.graphql';
import PageResolvers from '../api/page/resolvers.js';

import StructureSchema from '../api/structure/Structure.graphql';
import StructureResolvers from '../api/structure/resolvers.js';

import LayoutSchema from '../api/layout/Layout.graphql';
import LayoutResolvers from '../api/layout/resolvers.js';

// #0618

const typeDefs = [
    UserSchema,
    PageSchema,
    StructureSchema,
    LayoutSchema
];
const resolvers = merge(
    UserResolvers,
    PageResolvers,
    StructureResolvers,
    LayoutResolvers
);  

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
        const token = req.headers["meteor-login-token"] || '';
        const user = await getUser(token);
        return { user };
    }
});
await server.start().then(() => {
    server.applyMiddleware({
        app: WebApp.connectHandlers,
        cors: true,
    });
});
server.applyMiddleware({ app });
await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
server.applyMiddleware({
    app: WebApp.connectHandlers,
    path: '/graphql',
    cors: corsOptions
})
WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
    return next();
});
WebApp.connectHandlers.use('/graphql', (req, res) => {
    if (req.method === 'GET') {
        res.end()
    }
})