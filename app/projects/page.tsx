"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { motion } from "motion/react";
import Footer from "@/components/footer/Footer";
import AskAlfredButton from "@/components/ui/AskAlfredButton";
import ProjectCard from "@/components/project-card/ProjectCard";
import { useChat } from "@/components/context/ChatContext";
import { products, projects } from "@/lib/content";

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
} as const;

export default function Projects() {
  const { openChat } = useChat();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={styles.header__text}
        >
          <span className={styles.eyebrow}>Our work</span>
          <h1>Agents, platforms and sites we&apos;ve shipped.</h1>
          <p>
            Every card has a direct line to Alfred. Tap one and he&apos;ll start a conversation about that exact product,
            so you get answers in seconds instead of waiting on an email.
          </p>
        </motion.div>
        <motion.div
          className={styles.header__art}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image src="/example-animate.svg" alt="Rexon projects" fill priority sizes="(max-width: 900px) 70vw, 35vw" />
        </motion.div>
      </header>

      <section className={styles.block}>
        <motion.h2 {...fadeUp}>AI agents &amp; products</motion.h2>
        <div className={styles.agents}>
          {products.map((p, i) => (
            <motion.article
              key={p.id}
              className={styles.agent}
              {...fadeUp}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <div className={styles.agent__art}>
                <Image src={p.illustration} alt="" fill sizes="(max-width: 900px) 60vw, 25vw" />
              </div>
              <span className={styles.kind}>{p.kind}</span>
              <h3>{p.name}</h3>
              <h4>{p.tagline}</h4>
              <p>{p.description}</p>
              <div className={styles.chips}>
                {p.channels.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              <AskAlfredButton message={p.ask} label={`Ask Alfred about ${p.name}`} variant="solid" />
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <motion.h2 {...fadeUp}>Websites &amp; platforms</motion.h2>
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      <motion.section className={styles.cta} {...fadeUp}>
        <h2>Don&apos;t see your industry?</h2>
        <p>We build custom. Tell Alfred what your business does and what you&apos;d like automated.</p>
        <button onClick={openChat}>Talk to Alfred</button>
      </motion.section>

      <Footer />
    </main>
  );
}
