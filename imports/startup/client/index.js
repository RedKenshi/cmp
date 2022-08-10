import React from 'react';
import { Meteor } from 'meteor/meteor';
import { MeteorAccountsLink } from 'meteor/apollo'
import { render } from 'react-dom';
import { ApolloClient, ApolloLink, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter } from 'react-router-dom';
import { createUploadLink } from 'apollo-upload-client'

import { UserProvider } from '../../contexts/UserContext';
import { App } from '../../ui/App';

const client = new ApolloClient({
  link: ApolloLink.from([
    new MeteorAccountsLink({ headerName: 'meteor-login-token' }),
    new createUploadLink({
      uri: '/graphql'
    })
  ]),
  cache: new InMemoryCache()
})

const ApolloApp = () => (
  <ApolloProvider client={client}>
      <BrowserRouter>
          <UserProvider client={client}>
              <App/>
          </UserProvider>
      </BrowserRouter>
  </ApolloProvider>
)

Meteor.startup(()=>{
    render(<ApolloApp />, document.getElementById("app"));
});