
'use client';

import { useEffect, useRef } from 'react';

export function AnimatedGridBackground() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Clear any existing spans to prevent duplication on re-render
    while (section.firstChild) {
      section.removeChild(section.firstChild);
    }
    
    // Create and append new spans for the animation
    const numberOfSpans = 300;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < numberOfSpans; i++) {
        const span = document.createElement('span');
        fragment.appendChild(span);
    }
    section.appendChild(fragment);

  }, []); // Re-run effect if the component re-mounts

  return <section id="background-section" ref={sectionRef}></section>;
}
