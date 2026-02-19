import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';
import { useState } from 'react';

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
      <div className="relative box-border caret-transparent min-h-[400px] md:min-h-[700px] h-full w-full">
        <div className="absolute box-border caret-transparent z-0 inset-0">
          <picture className="absolute box-border h-full w-full caret-transparent block inset-0">
            <img
              alt="WhyOps Background"
              sizes="100vw"
              src="/assets/widget-bg-1.jpg"
              className="aspect-[auto_1920_/_1080] box-border caret-transparent grayscale-[0.5] h-full max-w-full object-cover object-[50%_0%] w-full md:object-[50%_50%]"
            />
          </picture>
          
        </div>
        
      </div>
    </motion.div>
  );
};
