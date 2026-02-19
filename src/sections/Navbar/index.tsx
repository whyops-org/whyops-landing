import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { NavbarLogo } from "@/sections/Navbar/components/NavbarLogo";
import { DesktopNavLinks } from "@/sections/Navbar/components/DesktopNavLinks";
import { NavbarActions } from "@/sections/Navbar/components/NavbarActions";
import { MobileMenu } from "@/sections/Navbar/components/MobileMenu";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed backdrop-blur-xl bg-[oklab(0.989998_-0.00000971556_0.0000231266_/_0.5)] dark:bg-[oklab(0.1_0_0_/_0.5)] box-border caret-transparent z-50 border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] border-b border-l border-r border-dashed top-0 inset-x-0"
      >
        <div className="box-border caret-transparent max-w-[1400px] w-full border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] mx-auto border-l border-r border-dashed">
          <div className="items-center box-border caret-transparent flex justify-between max-w-screen-2xl w-full mx-auto p-4">
            <NavbarLogo />
            <DesktopNavLinks />
            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <NavbarActions />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-[lab(95.36_0_0)] rounded-sm transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
