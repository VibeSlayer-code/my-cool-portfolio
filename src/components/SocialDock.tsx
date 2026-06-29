import { socials } from "../data/socials";

export default function SocialDock() {
  return (
    <nav aria-label="Social links" className="mt-9">
      <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {socials.map((social) => {
          const Icon = social.icon;
          const isMail = social.href.startsWith("mailto:");
          return (
            <li key={social.label} className="group relative">
              <a
                href={social.href}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noreferrer"}
                aria-label={social.ariaLabel}
                className="social-button grid h-11 w-11 place-items-center rounded-xl"
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
              <span
                role="tooltip"
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-200 opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
              >
                {social.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
