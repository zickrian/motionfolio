import { lazy, memo, Suspense, useEffect, useState } from "react";
import { Terminal } from "lucide-react";

const ChatWidget = lazy(() => import("./ChatWidget"));

const ChatLauncher = memo(function ChatLauncher() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => {
    setIsLoaded(true);
    setIsOpen(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsLoaded(true);
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (isLoaded) {
    return (
      <Suspense
        fallback={
          <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end pointer-events-auto font-mono text-sm">
            <button
              className="group flex items-center justify-center w-11 h-11 md:w-14 md:h-14 bg-black border border-neutral-800 text-lime-400 shadow-lg hover:bg-neutral-900 transition-all rounded-full"
              aria-label="Loading terminal"
            >
              <Terminal size={20} className="animate-pulse" />
            </button>
          </div>
        }
      >
        <ChatWidget isOpen={isOpen} onOpenChange={setIsOpen} />
      </Suspense>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end pointer-events-auto font-mono text-sm">
      <button
        onClick={openChat}
        className="group flex items-center justify-center w-11 h-11 md:w-14 md:h-14 bg-black border border-neutral-800 text-lime-400 shadow-lg hover:bg-neutral-900 transition-all rounded-full"
        aria-label="Open terminal (Ctrl+K)"
      >
        <Terminal size={20} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
});

export default ChatLauncher;
