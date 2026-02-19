import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { colors, typography, animations, borders } from '@/design-system';
import { content } from '@/design-system/content';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animations.duration.fast }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={animations.easing.spring}
            className={`fixed right-0 top-0 bottom-0 w-[280px] bg-[${colors.background.DEFAULT}] dark:bg-[${colors.dark.background.secondary}] border-l border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}] z-50 shadow-xl`}
          >
            <div className="flex flex-col h-full">
              <div className={`flex items-center justify-between p-4 border-b border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}]`}>
                <span className={`text-[${colors.primary.DEFAULT}] dark:text-[${colors.dark.text.primary}] text-xl font-${typography.fontFamily.display}`}>
                  Menu
                </span>
                <button
                  onClick={onClose}
                  className={`p-2 hover:bg-[${colors.background.tertiary}] ${borders.radius.sm} ${animations.transitions.colors}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col p-4 gap-2">
                {content.navigation.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`text-sm font-medium py-3 px-4 hover:bg-[${colors.background.tertiary}] dark:hover:bg-[${colors.dark.background.hover}] ${borders.radius.sm} ${animations.transitions.colors} text-[${colors.text.primary}] dark:text-[${colors.dark.text.secondary}]`}
                  >
                    {link.text}
                  </a>
                ))}
                <div className={`border-t border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}] my-2`}></div>
                <a
                  href="#early-access"
                  onClick={onClose}
                  className={`text-sm font-medium bg-[${colors.primary.DEFAULT}] dark:bg-[${colors.dark.text.primary}] text-[${colors.primary.foreground}] dark:text-[${colors.primary.DEFAULT}] py-3 px-4 ${borders.radius.sm} ${animations.hover.opacityHigh} ${animations.transitions.all} text-center`}
                >
                  {content.cta.primary}
                </a>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
