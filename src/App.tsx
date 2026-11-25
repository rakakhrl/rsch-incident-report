import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Loader, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { queryClient } from "./config/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./config/routes";
import { generateColors } from "@mantine/colors-generator";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <MantineProvider
          theme={{
            colors: {
              darkGreen: generateColors("#025735"),
              lightGreen: generateColors("#8CC43D"),
            },
            primaryColor: "green",
          }}
        >
          <ModalsProvider>
            <Notifications position="top-center" />
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<Loader />}>
                <AppRoutes />
              </Suspense>
            </QueryClientProvider>
          </ModalsProvider>
        </MantineProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
