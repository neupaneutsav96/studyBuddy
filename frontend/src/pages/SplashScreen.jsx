import LogoMain from "@/assets/logo-full.svg";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setProgress((prevProgress) => prevProgress+(100/6), 500));
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <img src={LogoMain} className="h-80 w-80" />
      <Progress className="w-1/2 my-20" value={progress} />
    </div>
  );
}

export default SplashScreen;
