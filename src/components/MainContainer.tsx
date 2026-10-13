import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Education from "./Education";
import Career from "./Career";
import Training from "./Training";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import MarqueeBand from "./MarqueeBand";
import Navbar from "./Navbar";
import ScrollProgress from "./ScrollProgress";
import SocialIcons from "./SocialIcons";
import StatsStrip from "./StatsStrip";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import ErrorBoundary from "./utils/ErrorBoundary";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Education />
            <Career />
            <Training />
            <StatsStrip />
            <MarqueeBand />
            <Work />
            {isDesktopView && (
              <ErrorBoundary label="Tech stack scene">
                <Suspense fallback={<div>Loading....</div>}>
                  <TechStack />
                </Suspense>
              </ErrorBoundary>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
