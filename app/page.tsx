"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Footer from "@/components/footer/Footer";
import AskAlfredButton from "@/components/ui/AskAlfredButton";
import ProjectCard from "@/components/project-card/ProjectCard";
import { useChat } from "@/components/context/ChatContext";
import {
  heroStats,
  services,
  products,
  projects,
  process,
  faqs,
} from "@/lib/content";

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1 },
  }),
};

const inView = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
  variants: reveal,
} as const;

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <motion.div className={styles.sectionHead} {...inView}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}

export default function Home() {
  const { openChat } = useChat();

  return (
    <main className={styles.home}>
      {/* HERO */}
      <section className={styles.hero}>
        <motion.div
          className={styles.hero__text}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className={styles.pill}>
            <i /> AI agents &amp; software for growing businesses
          </span>
          <h1>
            We build AI agents that run your customer chats, and the software around them.
          </h1>
          <p className={styles.lead}>
            Rexon Dev designs custom WhatsApp, Telegram and website agents that reply instantly, take orders and
            follow up, plus the web and mobile products your business runs on. <strong>Dream is free.</strong>{" "}
            We&apos;re here to build it.
          </p>
          <div className={styles.hero__actions}>
            <button className={styles.primary} onClick={openChat}>
              Talk to Alfred
            </button>
            <a className={styles.secondary} href="#agents">
              See our AI agents
            </a>
          </div>
          <ul className={styles.stats}>
            {heroStats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          className={styles.hero__image}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <Image src="/hero.svg" alt="Rexon builders at work" fill priority unoptimized />
        </motion.div>
      </section>

      {/* CHANNEL STRIP */}
      <div className={styles.strip} aria-label="Platforms we build for">
        <div className={styles.strip__track}>
          {[0, 1].map((n) => (
            <div key={n} className={styles.strip__row} aria-hidden={n === 1}>
              {["WhatsApp", "Telegram", "Instagram", "Your website", "Google Sheets", "Supabase", "Next.js", "React Native", "Flutter"].map(
                (t) => (
                  <span key={t}>{t}</span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI AGENTS */}
      <section id="agents" className={styles.section}>
        <SectionHead
          eyebrow="AI agents"
          title="Meet the agents we've already built"
          text="Real products running real conversations. Tap any of them and Alfred will walk you through how it could work for your business."
        />
        <div className={styles.products}>
          {products.map((p, i) => (
            <motion.article
              key={p.id}
              className={`${styles.product} ${i % 2 ? styles.product_flip : ""}`}
              {...inView}
            >
              <div className={styles.product__art}>
                <Image src={p.illustration} alt={`${p.name} illustration`} fill sizes="(max-width: 900px) 80vw, 40vw" />
              </div>
              <div className={styles.product__body}>
                <span className={styles.kind}>{p.kind}</span>
                <h3>{p.name}</h3>
                <h4>{p.tagline}</h4>
                <p>{p.description}</p>
                <ul className={styles.outcomes}>
                  {p.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <div className={styles.channels}>
                  {p.channels.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <AskAlfredButton message={p.ask} label={`Ask Alfred about ${p.name}`} variant="solid" />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className={styles.section}>
        <SectionHead
          eyebrow="What we do"
          title="Everything your business needs to run smarter"
          text="AI automation is our edge. The same team also designs and builds the web and mobile products around it."
        />
        <div className={styles.services}>
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              className={`${styles.service} ${s.featured ? styles.service_featured : ""}`}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              custom={i % 3}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className={styles.service__art}>
                <Image src={s.image} alt="" fill sizes="(max-width: 900px) 60vw, 25vw" />
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section className={styles.section}>
        <SectionHead
          eyebrow="Selected work"
          title="Don't just take our word for it"
          text="A few of the sites and platforms we've shipped. Like one? Ask Alfred and he'll tell you how we'd build yours."
        />
        <div className={styles.work}>
          {projects.slice(0, 3).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
        <motion.div className={styles.center} {...inView}>
          <Link href="/projects" className={styles.secondary}>
            See all projects
          </Link>
        </motion.div>
      </section>

      {/* PROCESS */}
      <section className={styles.section}>
        <div className={styles.processWrap}>
          <div>
            <SectionHead
              eyebrow="How it works"
              title="From first message to live agent"
              text="No jargon, no long waiting. You'll see a working version before you commit to launch."
            />
            <ol className={styles.process}>
              {process.map((s, i) => (
                <motion.li key={s.step} variants={reveal} initial="hidden" whileInView="visible" custom={i} viewport={{ once: true, amount: 0.3 }}>
                  <span>{s.step}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
          <motion.div className={styles.processWrap__art} {...inView}>
            <Image src="/consulting-animate.svg" alt="A consultation with the Rexon team" fill sizes="(max-width: 900px) 80vw, 40vw" />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <SectionHead eyebrow="Good to know" title="Questions we hear a lot" />
        <div className={styles.faqs}>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <motion.div className={styles.cta__text} {...inView}>
          <h2>You can dream, but don&apos;t neglect the execution.</h2>
          <p>
            Whether you&apos;re a startup making your mark or an established business ready to automate, tell Alfred what&apos;s
            slowing you down. He&apos;ll loop in the team.
          </p>
          <div className={styles.hero__actions}>
            <button className={styles.primary_dark} onClick={openChat}>
              Start your dream
            </button>
            <Link className={styles.secondary_dark} href="/pricing">
              View pricing
            </Link>
          </div>
        </motion.div>
        <div className={styles.cta__art}>
          <Image src="/dreamer-animate.svg" alt="Dreaming big" fill sizes="(max-width: 900px) 70vw, 30vw" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
