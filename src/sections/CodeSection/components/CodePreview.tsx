import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SupportWidget } from "@/sections/CodeSection/components/SupportWidget";

export const CodePreview = () => {
  const { ref, isVisible } = useScrollReveal(0.2);
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="box-border caret-transparent h-full min-h-[450px] w-full p-4 md:min-h-[730px]"
    >
      <div className="relative box-border caret-transparent h-full w-full">
        <div className="absolute box-border caret-transparent z-0 inset-0">
          <picture className="absolute box-border caret-transparent block inset-0">
            <img
              alt="Cossistant Background"
              sizes="100vw"
              src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/19.jpg"
              className="aspect-[auto_1920_/_1080] box-border caret-transparent grayscale-[0.5] h-full max-w-full object-cover object-[50%_0%] w-full md:object-[50%_50%]"
            />
          </picture>
          <div className="absolute box-border caret-transparent h-full w-full overflow-hidden inset-0">
            <img
              alt="Cossistant Background"
              sizes="100vw"
              src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/22.jpg"
              className="absolute text-transparent box-border h-full max-w-full object-cover w-full inset-0"
            />
            <div className="absolute items-center box-border caret-transparent flex justify-center mix-blend-multiply opacity-25 pointer-events-none inset-0">
              <img
                src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/image-2.png"
                className="aspect-[auto_1168_/_1388] box-border caret-transparent h-[694px] max-w-full w-[584px]"
              />
            </div>
          </div>
        </div>
        <div className="items-center box-border caret-transparent flex h-full justify-center w-full">
          <div className="relative items-end box-border caret-transparent gap-x-4 flex flex-col gap-y-4 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative bg-[lab(98.84_0.0000298023_-0.0000119209)] box-border caret-transparent flex flex-col h-[550px] w-[360px] border border-[lab(90.952_0_-0.0000119209)] overflow-hidden rounded-lg border-solid"
            >
              <SupportWidget />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="relative text-[lab(98.26_0_0)] items-center bg-[lab(2.75381_0_0)] box-border caret-transparent flex h-12 justify-center opacity-50 w-12 rounded-[3.35544e+07px] transition-all hover:opacity-70 cursor-pointer"
            >
              <div className="items-center box-border caret-transparent flex justify-center">
                <img
                  src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-19.svg"
                  alt="Icon"
                  className="box-border caret-transparent shrink-0 h-5 w-5"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
