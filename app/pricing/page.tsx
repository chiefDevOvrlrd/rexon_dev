"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Footer from "@/components/footer/Footer";
import AskAlfredButton from "@/components/ui/AskAlfredButton";
import { useChat } from "@/components/context/ChatContext";
import {
  NGN_PER_USD,
  PRICE,
  channelOptions,
  pricingFaqs,
  pricingPlans,
  quote,
  type ChannelId,
} from "@/lib/content";

type Currency = "NGN" | "USD";

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
} as const;

function money(ngn: number, currency: Currency) {
  if (currency === "NGN") return `₦${ngn.toLocaleString("en-NG")}`;
  // round to the nearest $5 so the dollar view reads as a clean anchor price
  const usd = Math.max(5, Math.round(ngn / NGN_PER_USD / 5) * 5);
  return `$${usd.toLocaleString("en-US")}`;
}

export default function Pricing() {
  const { askAlfred } = useChat();
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [selected, setSelected] = useState<ChannelId[]>(["whatsapp"]);
  const [inventory, setInventory] = useState(false);

  const toggle = (id: ChannelId) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]));

  const built = useMemo(() => quote(selected, inventory), [selected, inventory]);

  const buildMessage = () => {
    if (built.channels.length === 0 && !inventory) {
      return "Hi Alfred, I'd like a quote for an AI agent for my business. Can you help me work out what I need?";
    }
    const parts: string[] = built.channels.map((c) => c.label);
    if (inventory) parts.push("Google Sheets inventory");
    return `Hi Alfred, I put together an AI agent on the pricing page: ${parts.join(", ")}. It came to about ${money(
      built.setup,
      "NGN"
    )} setup. Can you confirm the price and tell me what happens next?`;
  };

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <motion.div
          className={styles.header__text}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.eyebrow}>Pricing</span>
          <h1>Simple pricing for agents that pay for themselves.</h1>
          <p>
            Pay once to set up, then a small monthly fee to keep your agent running. One customer service rep costs far
            more each month than an agent that never sleeps, never forgets and replies in seconds.
          </p>
          <div className={styles.currency} role="group" aria-label="Currency">
            {(["NGN", "USD"] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                className={currency === c ? styles.currency_active : ""}
                aria-pressed={currency === c}
                onClick={() => setCurrency(c)}
              >
                {c === "NGN" ? "₦ Naira" : "$ USD"}
              </button>
            ))}
          </div>
        </motion.div>
        <motion.div
          className={styles.header__art}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image src="/banknote-animate.svg" alt="Pricing illustration" fill priority sizes="(max-width: 900px) 70vw, 35vw" />
        </motion.div>
      </header>

      {/* PLANS */}
      <section className={styles.block}>
        <motion.h2 {...fadeUp}>Popular setups</motion.h2>
        <div className={styles.plans}>
          {pricingPlans.map((plan, i) => {
            const q = quote(plan.channels, plan.inventory);
            return (
              <motion.article
                key={plan.name}
                className={`${styles.plan} ${plan.popular ? styles.plan_popular : ""}`}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {plan.popular && <span className={styles.badge}>Most popular</span>}
                <h3>{plan.name}</h3>
                <p className={styles.plan__blurb}>{plan.blurb}</p>
                <div className={styles.price}>
                  <strong>{money(q.setup, currency)}</strong>
                  <span>one-time setup</span>
                </div>
                <div className={styles.monthly}>
                  + from {money(q.monthly, currency)}/month
                </div>
                <ul>
                  {plan.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <AskAlfredButton
                  message={`Hi Alfred, I'm interested in the ${plan.name} from the pricing page. Can you tell me more and confirm what it would cost for my business?`}
                  label={`Ask Alfred about ${plan.name}`}
                  variant={plan.popular ? "solid" : "ghost"}
                />
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* BUILDER */}
      <section className={styles.block}>
        <motion.div className={styles.builder} {...fadeUp}>
          <div className={styles.builder__form}>
            <span className={styles.eyebrow}>Build your own</span>
            <h2>Pick what you need, see the price.</h2>
            <p>Each channel is priced separately. Add a Google Sheets inventory if you sell products from a stock list.</p>

            <fieldset>
              <legend>Channels</legend>
              <div className={styles.options}>
                {channelOptions.map((c) => (
                  <label key={c.id} className={selected.includes(c.id) ? styles.option_on : ""}>
                    <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                    <span>{c.label}</span>
                    <em>{money(c.price, currency)}</em>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Add-ons</legend>
              <div className={styles.options}>
                <label className={inventory ? styles.option_on : ""}>
                  <input type="checkbox" checked={inventory} onChange={() => setInventory((v) => !v)} />
                  <span>Google Sheets inventory</span>
                  <em>{money(PRICE.sheetsInventory, currency)}</em>
                </label>
              </div>
            </fieldset>
          </div>

          <aside className={styles.builder__total} aria-live="polite">
            <span>Your estimate</span>
            <strong>{money(built.setup, currency)}</strong>
            <small>one-time setup</small>
            <div className={styles.builder__monthly}>
              + from {money(built.monthly, currency)}/month to keep it running
            </div>
            <button type="button" onClick={() => askAlfred(buildMessage())}>
              Send this to Alfred
            </button>
            <p>Alfred confirms the final price and flags your request to the team.</p>
          </aside>
        </motion.div>
        {currency === "USD" && (
          <p className={styles.fxnote}>
            Dollar prices are approximate, rounded from the naira price at about ₦{NGN_PER_USD.toLocaleString()} per $1.
          </p>
        )}
      </section>

      {/* CUSTOM */}
      <section className={styles.block}>
        <motion.div className={styles.custom} {...fadeUp}>
          <div>
            <span className={styles.eyebrow}>Custom builds</span>
            <h2>Websites, mobile apps and custom software</h2>
            <p>
              Anything beyond an agent is scoped individually, based on features, design depth, timeline and tech.
              Custom builds start from <strong>{money(PRICE.customFrom, currency)}</strong>. We work fixed-price, hourly
              or on a monthly retainer, whichever fits your project.
            </p>
            <AskAlfredButton
              message="Hi Alfred, I'd like a quote for a custom build (website, app or software). Can I tell you what I need?"
              label="Get a custom quote"
              variant="solid"
            />
          </div>
          <div className={styles.custom__art}>
            <Image src="/invoice-animate.svg" alt="Custom quote illustration" fill sizes="(max-width: 900px) 70vw, 30vw" />
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className={styles.block}>
        <motion.h2 {...fadeUp}>Pricing questions</motion.h2>
        <div className={styles.faqs}>
          {pricingFaqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
