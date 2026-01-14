import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import Provider from "./providers";

function App() {
  return (
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
