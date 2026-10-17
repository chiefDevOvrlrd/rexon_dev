'use client';

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/loading-screen/LoadingScreen";
import NavBar from "@/components/nav-bar/NavBar";
import AlfredChat from "@/components/alfred/AlfredChat";
import { ChatProvider } from "@/components/context/ChatContext";

export default function ClientWrapper({children}: {children: React.ReactNode}) {
    const [animateUp, setAnimateUp] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setAnimateUp(true), 5800)
        return() => clearTimeout(timeout);
    }, [])

    // keep the page still while the splash covers it
    useEffect(() => {
        document.documentElement.style.overflow = animateUp ? '' : 'hidden';
        return () => { document.documentElement.style.overflow = ''; };
    }, [animateUp])

    return(
        <ChatProvider>
            <LoadingScreen animateUp={animateUp}/>
            {/*
              The page is rendered from the very first paint (so search engines and
              link previews get real HTML), with the splash laid over it. The key
              remounts it when the splash ends, so the page's entrance animations
              play fresh right after the splash, exactly as before.
            */}
            <div key={animateUp ? 'live' : 'splash-cover'}>
                {children}
            </div>
            {
                animateUp && (
                    <>
                    <NavBar />
                    <AlfredChat />
                    </>
                )
            }
        </ChatProvider>
    )
}
