"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./request.module.scss"
import WhiteButton from "@/components/ui/WhiteButton";

interface QuoteFormData {
  name: string;
  email: string;
  message: string;
}

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: QuoteFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/request-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setStatus(result.message || "Message sent successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.requestForm}>
        <div className={styles.getStarted}>
          <Image src={"/example-animate.svg"} alt="" fill/>
        </div>
        <div className={styles.formContainer}>
          <h2>Ready to start your dream?</h2>
          <p>
            Awesome — so are we! <br />
            We’ll help turn your vision into something real — request a quote and we’ll get in touch soon!
          </p>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your name" required />
            <input type="email" name="email" placeholder="Your email" required />
            <textarea name="message" placeholder="Your message..." required />
            <WhiteButton text={loading ? "Sending..." : "Send Request"} type="submit" disabled={loading} />
            {status && <p>{status}</p>}
          </form>
        </div>
    </div>
  );
}
