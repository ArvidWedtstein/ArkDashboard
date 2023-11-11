import { FatalErrorBoundary, RedwoodProvider } from "@redwoodjs/web";
import { RedwoodApolloProvider } from "@redwoodjs/web/apollo";

import FatalErrorPage from "src/pages/FatalErrorPage";
import Routes from "src/Routes";

import { AuthProvider, useAuth } from "./auth";

import "./scaffold.css";
import "./index.css";
import { ModalProvider } from "./components/Util/Modal/Modal";
import { ThemeProvider } from "./components/Util/ThemeContext/ThemeContext";

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider useAuth={useAuth}>
          <ThemeProvider>
            <ModalProvider>
              <Routes />
            </ModalProvider>
          </ThemeProvider>
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
);

export default App;
