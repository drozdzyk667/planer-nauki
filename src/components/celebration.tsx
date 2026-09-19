"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { PartyPopper, RotateCw, X } from "lucide-react";
import { useLocale } from "./providers";

const particles = Array.from({ length: 72 }, (_, i) => {
  const angle = ((i % 24) / 24) * Math.PI * 2;
  const distance = 130 + ((i * 47) % 190);
  return {
    "--burst-x": `${25 + Math.floor(i / 24) * 25}%`,
    "--burst-y": `${30 + (i % 3) * 8}%`,
    "--travel-x": `${Math.cos(angle) * distance}px`,
    "--travel-y": `${Math.sin(angle) * distance - 80}px`,
    "--spin": `${(i % 2 ? 1 : -1) * (180 + i * 17)}deg`,
    "--delay": `${Math.floor(i / 24) * 0.25}s`,
    "--particle-color": ["#ffda57", "#b399ff", "#51d6be", "#ff8db3"][i % 4],
  } as CSSProperties;
});

/** Short transform-only bursts: no canvas loop, no dependency, no flashing. */
export function Celebration() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 3600);
    return () => clearTimeout(timer);
  }, [run]);
  return (
    <>
      {active && !reduced && (
        <div className="celebration-particles" aria-hidden="true" key={run}>
          {particles.map((style, i) => (
            <i
              key={i}
              style={style}
              className={i % 5 === 0 ? "particle-star" : ""}
            />
          ))}
          <span className="celebration-halo" />
        </div>
      )}
      <div className="celebration-note">
        <PartyPopper size={22} aria-hidden="true" />
        <strong>{t.celebrate}</strong>
        {!reduced && (
          <button
            className="celebration-replay"
            onClick={() => {
              setRun((r) => r + 1);
              setActive(true);
            }}
          >
            <RotateCw size={16} />
            {t.replayCelebration}
          </button>
        )}
        {!reduced && active && (
          <button
            className="icon-button celebration-stop"
            aria-label={t.stopCelebration}
            onClick={() => setActive(false)}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </>
  );
}
