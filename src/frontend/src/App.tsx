import BottomNav from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import AIScreen from "@/screens/AIScreen";
import EditorScreen from "@/screens/EditorScreen";
import HomeScreen from "@/screens/HomeScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import TemplatesScreen from "@/screens/TemplatesScreen";
import { useState } from "react";

export type Screen = "home" | "editor" | "templates" | "ai" | "profile";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen onNavigate={setScreen} />;
      case "editor":
        return <EditorScreen onBack={() => setScreen("home")} />;
      case "templates":
        return <TemplatesScreen onNavigate={setScreen} />;
      case "ai":
        return <AIScreen />;
      case "profile":
        return <ProfileScreen />;
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full h-screen overflow-hidden"
      style={{ background: "#000" }}
    >
      <div
        className="relative flex flex-col w-full h-full overflow-hidden"
        style={{
          maxWidth: screen === "editor" ? "100%" : 430,
          background: "#000",
        }}
      >
        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          <div key={screen} className="screen-enter w-full h-full">
            {renderScreen()}
          </div>
        </div>
        {/* Bottom Nav (hidden on editor) */}
        {screen !== "editor" && (
          <BottomNav active={screen} onNavigate={setScreen} />
        )}
      </div>
      <Toaster />
    </div>
  );
}
