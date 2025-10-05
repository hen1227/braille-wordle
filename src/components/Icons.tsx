// src/components/Icons.tsx
import React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export const HomeIcon = (props: Props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-house-icon lucide-house" {...props}>
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
        <path
            d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
);

export const ArrowLeftIcon = (props: Props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
        <path fill="var(--text)" d="M14.5 5.5 8 12l6.5 6.5 1.5-1.5L11 12l5-5-1.5-1.5z"/>
    </svg>
);

export const ArrowRightIcon = (props: Props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
        <path fill="var(--text)" d="M9.5 18.5 16 12 9.5 5.5 8 7l5 5-5 5 1.5 1.5z"/>
    </svg>
);

export const StatsIcon = (props: Props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
        <path fill="var(--text)" d="M4 20h16v-2H4v2zm2-4h3V8H6v8zm5 0h3V4h-3v12zm5 0h3v-6h-3v6z"/>
    </svg>
);

export const SunIcon = (props: Props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-sun-icon lucide-sun" {...props}>
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
);

export const MoonIcon = (props: Props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-moon-icon lucide-moon" {...props}>
        <path
            d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
    </svg>
);

export const GithubIcon = (props: Props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-github-icon lucide-github" {...props}>
        <path
            d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
        <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
);
