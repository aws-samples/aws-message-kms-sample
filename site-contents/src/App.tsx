import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/router";
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;
