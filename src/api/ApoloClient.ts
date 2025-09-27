import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import DebounceLink from "apollo-link-debounce";

const api = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_TOKEN;

const DEFAULT_DEBOUNCE_TIMEOUT = 300;

const debounceLink = new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT);

const httpLink = new HttpLink({
  uri: api,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const link = ApolloLink.from([debounceLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
