import { useState, useEffect } from "react";
import MagicBento from "./MagicBento/MagicBento";
import FadeContent from "../ui/FadeContent";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Stats fetch error:", error);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main
        className="flex justify-center items-center h-full w-full overflow-x-hidden"
        style={{ background: "#0a0a14" }}
      >
        <FadeContent
          blur={true}
          duration={700}
          easing="ease-out"
          initialOpacity={0}
        >
          <MagicBento
            stats={stats}
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={false}
            spotlightRadius={400}
            particleCount={12}
            glowColor="59, 130, 246"
            disableAnimations={false}
          />
        </FadeContent>
      </main>
    </>
  );
}
