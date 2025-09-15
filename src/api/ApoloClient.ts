import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const api = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_TOKEN;

const client = new ApolloClient({
  link: new HttpLink({
    uri: api,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
