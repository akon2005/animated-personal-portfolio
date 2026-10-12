import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import ErrorBoundary from "./components/utils/ErrorBoundary";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            {/* No WebGL or a broken model must not take the page with it. */}
            <ErrorBoundary label="3D character">
              <Suspense>
                <CharacterModel />
              </Suspense>
            </ErrorBoundary>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
