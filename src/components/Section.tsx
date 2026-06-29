import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

const placeholderItems = [
  {
    title: "Lorem ipsum",
    body: "Dolor sit amet, consectetur adipiscing elit. Integer vitae orci at arcu finibus gravida.",
  },
  {
    title: "Consectetur",
    body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  },
  {
    title: "Adipiscing elit",
    body: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export default function Section({ title, description, children }: SectionProps) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-5 py-20 sm:px-6 sm:py-28">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-zinc-400">
        {description ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."}
      </p>

      <div className="mt-8">{children ?? <PlaceholderGrid />}</div>
    </section>
  );
}

function PlaceholderGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {placeholderItems.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
        >
          <h3 className="font-display text-base font-semibold text-zinc-100">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
