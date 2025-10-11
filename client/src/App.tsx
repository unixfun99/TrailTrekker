import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Home from "@/pages/Home";
import AddHike from "@/pages/AddHike";
import MapPage from "@/pages/MapPage";
import SharedHikes from "@/pages/SharedHikes";
import Profile from "@/pages/Profile";
import BottomNav from "@/components/BottomNav";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setLocation(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setLocation]);

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/add" component={AddHike} />
        <Route path="/map" component={MapPage} />
        <Route path="/shared" component={SharedHikes} />
        <Route path="/profile" component={Profile} />
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
