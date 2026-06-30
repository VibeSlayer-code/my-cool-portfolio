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
  { label: "GitHub", href: "https://github.com/VibeSlayer-code", icon: FaGithub, ariaLabel: "Open vibeslayer on GitHub" },
  { label: "Discord", href: "https://discord.gg/users/1330507577720574045", icon: FaDiscord, ariaLabel: "Open vibeslayer Discord" },
  { label: "YouTube", href: "https://youtube.com/@Realvibeslayer", icon: FaYoutube, ariaLabel: "Open vibeslayer on YouTube" },
  { label: "Email", href: "mailto:hello@vibeslayer.space", icon: MdEmail, ariaLabel: "Email vibeslayer" },
];
