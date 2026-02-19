import { motion } from 'framer-motion';

export const FloatingButton = () => {
  return (
    <div className="relative box-border caret-transparent">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        className="fixed text-[lab(98.26_0_0)] items-center bg-[lab(7.78201_-0.0000149012_0)] dark:bg-[lab(95_0_0)] caret-transparent flex h-14 justify-center text-center w-14 z-[9999] p-0 rounded-[3.35544e+07px] right-4 bottom-4 shadow-lg transition-shadow hover:shadow-xl"
      >
        <div className="items-center box-border caret-transparent flex justify-center">
          <div className="relative box-border caret-transparent h-fit w-fit">
            <img
              src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-22.svg"
              alt="Chat"
              className="text-[lab(7.78201_-0.0000149012_0)] box-border caret-transparent h-[30px] w-[30px]"
            />
          </div>
        </div>
      </motion.button>
    </div>
  );
};
