import React, { useEffect, useState } from "react";

const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50"
           style={{
            background: "radial-gradient(farthest-corner, rgba(0,126,111,0.1) 10%, rgba(0,126,111,0.5) 100%), white"
          }}
        >
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="mr-10 w-60 h-60 animate-bounce"
                />
                <h1 className="text-2xl">Kitaab Ghar Loading ...</h1>
                
        </div>
       
      </>
    );
};

export default SplashScreen;