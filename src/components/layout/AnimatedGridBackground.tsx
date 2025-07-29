
'use client';

import { useEffect, useRef } from 'react';

export function AnimatedGridBackground() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (section && section.children.length === 0) {
      // Ensure we don't add spans multiple times on re-renders
      for (let i = 0; i < 300; i++) {
        const span = document.createElement('span');
        section.appendChild(span);
      }
    }
  }, []);

  return <section id="background-section" ref={sectionRef}></section>;
}
