import { motion } from "framer-motion";
import vibeslayerLogo from "../assets/vibeslayer.png";
import SocialDock from "./SocialDock";

export default function ProfileCard() {
  return (
    <motion.article
      className="relative w-full max-w-[640px] text-center"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-[560px] flex-col items-center">
        <img
          src={vibeslayerLogo}
          alt="vibeslayer"
          className="vibeslayer-logo mb-6 w-full max-w-[480px] select-none object-contain"
          draggable={false}
        />

        <p className="max-w-[460px] text-balance font-display text-lg font-medium leading-relaxed tracking-tight text-zinc-200 sm:text-xl">
          just keep getting money
        </p>

        <SocialDock />
      </div>
    </motion.article>
  );
}
