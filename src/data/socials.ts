import type { IconType } from "react-icons";
import { FaDiscord, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  ariaLabel: string;
};

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/vibeslayer", icon: FaGithub, ariaLabel: "Open vibeslayer on GitHub" },
  { label: "Discord", href: "https://discord.gg/replace-me", icon: FaDiscord, ariaLabel: "Open vibeslayer Discord" },
  { label: "Instagram", href: "https://instagram.com/vibeslayer", icon: FaInstagram, ariaLabel: "Open vibeslayer on Instagram" },
  { label: "X", href: "https://x.com/vibeslayer", icon: FaXTwitter, ariaLabel: "Open vibeslayer on X" },
  { label: "YouTube", href: "https://youtube.com/@vibeslayer", icon: FaYoutube, ariaLabel: "Open vibeslayer on YouTube" },
  { label: "Email", href: "mailto:hello@vibeslayer.dev", icon: MdEmail, ariaLabel: "Email vibeslayer" },
];
