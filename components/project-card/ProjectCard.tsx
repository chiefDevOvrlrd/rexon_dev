'use client';

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import styles from "./project-card.module.scss";
import AskAlfredButton from "@/components/ui/AskAlfredButton";
import type { Project } from "@/lib/content";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.media}>
        <Image
          src={project.thumbnail}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          className={styles.thumb}
        />
        {project.teaser && hovered && (
          <video className={styles.video} autoPlay loop muted playsInline preload="metadata">
            <source src={project.teaser} type="video/mp4" />
          </video>
        )}
        <span className={styles.tag}>{project.tag}</span>
      </div>
      <div className={styles.body}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <AskAlfredButton message={project.ask} label="Ask Alfred about this" />
      </div>
    </motion.article>
  );
}
