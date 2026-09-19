import { useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SourcePreview from "@/components/SourcePreview";
import ChatInterface from "@/components/ChatInterface";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import SplashScreen from "@/pages/SplashScreen";
import { socket } from "./socket";

function App() {
  const [connected, setConnected] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [sources, setSources] = useState();
  const { toast } = useToast();
  const onConnect = useCallback(() => {
    setConnected(true);
    toast({
      title: "Connected",
      description: "Socket connected to server",
    });
  }, [toast]);
  const onDisconnect = useCallback(() => {
    toast({
      variant: "destructive",
      title: "Disconnected",
      description: "Socket Disconnected from server",
    });
  }, [toast]);

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [onConnect, onDisconnect]);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplashScreen(false), 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {showSplashScreen ? (
        <SplashScreen />
      ) : (
        <div className="w-screen h-screen">
          <Toaster />
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25}>
              <SourcePreview sources={sources} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <ChatInterface setSources={setSources} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
