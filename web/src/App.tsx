import { AuthProvider } from "@redwoodjs/auth";
import { createClient } from "@supabase/supabase-js";

// import WebAuthnClient from "@redwoodjs/auth/webAuthn";

import { FatalErrorBoundary, RedwoodProvider } from "@redwoodjs/web";
import { RedwoodApolloProvider } from "@redwoodjs/web/apollo";

import FatalErrorPage from "src/pages/FatalErrorPage/FatalErrorPage";
import Routes from "src/Routes";

import "./scaffold.css";
import "./index.css";
import { supabase } from "@redwoodjs/auth/dist/authClients/supabase";

export const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  // {
  //   realtime: {
  //     params: {
  //       eventsPerSecond: 10,
  //     }
  //   }
  // }
);

// const channel = supabaseClient.channel('room1')

// channel.subscribe((status) => {
//   if (status === 'SUBSCRIBED') {
//     // now you can start broadcasting cursor positions
//     setInterval(() => {
//       channel.send({
//         type: 'broadcast',
//         event: 'cursor-pos',
//         payload: { x: Math.random(), y: Math.random() },
//       })
//       console.log(status)
//     }, 100)
//   }
// })

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider client={supabaseClient} type="supabase">
        {/* <AuthProvider type="dbAuth" client={WebAuthnClient}> */}
        <RedwoodApolloProvider>
          <Routes />
        </RedwoodApolloProvider>
        {/* </AuthProvider> */}
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
);

export default App;
