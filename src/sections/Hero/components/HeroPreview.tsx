import { motion } from 'framer-motion';
import { BrowserMockup } from "@/sections/Hero/components/BrowserMockup";

export const HeroPreview = () => {
  return (
    <div className="relative items-center box-border caret-transparent hidden justify-center min-h-0 min-w-0 w-full border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] overflow-hidden border-b border-t border-dashed md:block md:min-h-[auto] md:min-w-[auto]">
      <div className="absolute box-border caret-transparent z-0 inset-0">
        <picture className="absolute box-border caret-transparent block inset-0">
          <img
            alt="Cossistant Background"
            sizes="100vw"
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/18.jpg"
            className="aspect-[auto_1920_/_1080] box-border caret-transparent grayscale-[0.5] h-full max-w-full object-cover object-[50%_0%] w-full md:object-[50%_50%]"
          />
        </picture>
        <div className="absolute box-border caret-transparent h-full w-full overflow-hidden inset-0">
          <img
            alt="Cossistant Background"
            sizes="100vw"
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/20.jpg"
            className="absolute text-transparent box-border h-full max-w-full object-cover w-full inset-0"
          />
          <div className="static [align-items:normal] box-content caret-black block justify-normal mix-blend-normal opacity-100 pointer-events-auto inset-auto md:absolute md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:justify-center md:mix-blend-multiply md:opacity-30 md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:inset-0">
            <img
              src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/image-1.png"
              className="box-content caret-black h-auto max-w-none min-h-0 min-w-0 w-auto md:aspect-[auto_2552_/_1694] md:box-border md:caret-transparent md:h-[847px] md:max-w-full md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[1276px] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            />
          </div>
        </div>
      </div>
      <div className="relative items-center box-border caret-transparent flex basis-[0%] grow justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrowserMockup />
        </motion.div>
      </div>
    </div>
  );
};
