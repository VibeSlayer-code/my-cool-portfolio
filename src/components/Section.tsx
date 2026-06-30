import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};


export default function Section({ title, description, children }: SectionProps) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-5 py-20 sm:px-6 sm:py-28">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-prose text-base leading-relaxed text-zinc-300">
          {description}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

