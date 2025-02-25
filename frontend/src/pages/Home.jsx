import React, { useEffect } from "react";
import Hero from "../components/Home/Hero";
import RecentlyAdded from "../components/Home/RecentlyAdded";

import '@fontsource/poppins'; // Default weight
import SplashScreen from "../components/Home/SplashScreen";


const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
     <SplashScreen />
      <Hero />
      <RecentlyAdded />
    </>
  );
};

export default Home;
