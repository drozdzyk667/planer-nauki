"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { useLocale } from "@/components/providers";

const STORAGE_KEY = "nuvecto-home-intro-v1";

export function HomeIntroAnimation() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    if (window.sessionStorage.getItem(STORAGE_KEY) === "seen") return;

    const showTimer = window.setTimeout(() => setVisible(true), 40);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      window.sessionStorage.setItem(STORAGE_KEY, "seen");
    }, 2350);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [reduceMotion]);

  const close = () => {
    setVisible(false);
    window.sessionStorage.setItem(STORAGE_KEY, "seen");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="home-intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
        >
          <motion.div
            className="home-intro-stage"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 1.025, y: -10 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <motion.span
              className="home-intro-eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <Sparkles size={14} />
              {locale === "en" ? "BUILD UNDERSTANDING" : "BUDUJ ZROZUMIENIE"}
            </motion.span>

            <div className="home-intro-orbit" aria-hidden="true">
              <motion.span
                className="home-intro-node node-js"
                initial={{ opacity: 0, scale: 0.6, x: 22 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 190 }}
              >
                JS
              </motion.span>
              <motion.span
                className="home-intro-node node-ts"
                initial={{ opacity: 0, scale: 0.6, x: -22 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.34, type: "spring", stiffness: 190 }}
              >
                TS
              </motion.span>
              <motion.span
                className="home-intro-node node-react"
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.48, type: "spring", stiffness: 190 }}
              >
                ⚛
              </motion.span>

              <motion.div
                className="home-intro-core"
                initial={{ opacity: 0, rotate: -12, scale: 0.72 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.65, ease: "easeOut" }}
              >
                <Code2 size={30} />
              </motion.div>
              <span className="home-intro-ring ring-a" />
              <span className="home-intro-ring ring-b" />
            </div>

            <motion.div
              className="home-intro-code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
            >
              <span>const</span> idea = <strong>&quot;understood&quot;</strong>;
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.76 }}
            >
              {locale === "en"
                ? "See it. Try it. Understand it."
                : "Zobacz. Spróbuj. Zrozum."}
            </motion.h2>

            <motion.div
              className="home-intro-progress"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.18, duration: 1.9, ease: "linear" }}
            />
          </motion.div>

          <button className="home-intro-skip" type="button" onClick={close}>
            {locale === "en" ? "Skip" : "Pomiń"}
            <ArrowRight size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
