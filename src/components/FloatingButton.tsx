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
        className="fixed text-primary-foreground items-center bg-primary dark:bg-ds-dark-text-primary caret-transparent flex h-14 justify-center text-center w-14 z-[9999] p-0 rounded-full right-4 bottom-4 shadow-lg transition-shadow hover:shadow-xl"
      >
        <div className="items-center box-border caret-transparent flex justify-center">
          <div className="relative box-border caret-transparent h-fit w-fit">
            <img
              src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-22.svg"
              alt="Chat"
              className="text-primary box-border caret-transparent h-[30px] w-[30px]"
            />
          </div>
        </div>
      </motion.button>
    </div>
  );
};
