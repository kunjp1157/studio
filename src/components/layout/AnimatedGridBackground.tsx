
'use client';

import { useEffect, useRef } from 'react';

export function AnimatedGridBackground() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (section && section.children.length === 0) {
      for (let i = 0; i < 300; i++) {
        const span = document.createElement('span');
        section.appendChild(span);
      }
    }
  }, []);

  return <div ref={sectionRef} className="auth-grid-bg" />;
}
