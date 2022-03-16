import './App.css';
import { ApolloProvider } from '@apollo/client';
import { client, Chat } from './Chat'

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>GraphQL Chat App</h1>
        <Chat />
      </div>
    </ApolloProvider>
  );
}

export default App;

