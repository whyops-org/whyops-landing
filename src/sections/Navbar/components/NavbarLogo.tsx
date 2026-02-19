import { brand } from '@/lib/env';

export const NavbarLogo = () => {
  return (
    <div className="box-border caret-transparent w-60">
      <a href="/" className="items-center box-border caret-transparent flex gap-x-2">
        <img 
          src={brand.logo.src} 
          alt={brand.logo.alt}
          className="h-8 w-8"
        />
        <span className="text-ds-textPrimary dark:text-ds-dark-textPrimary text-xl font-semibold">
          {brand.name}
        </span>
      </a>
    </div>
  );
};
