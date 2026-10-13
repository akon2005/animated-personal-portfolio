import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import ErrorBoundary from "./components/utils/ErrorBoundary";
import ThemePanel from "./components/ThemePanel";

const App = () => {
  return (
    <>
      <ThemeProvider>
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
        {/* Sits outside the scroll wrappers so GSAP transforms cannot clip it. */}
        <ThemePanel />
      </ThemeProvider>
    </>
  );
};

export default App;
