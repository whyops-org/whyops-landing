import { commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const NavbarActions = () => {
  return (
    <div className="items-center box-border caret-transparent gap-x-4 flex justify-end gap-y-4 w-60">
      <a href="#early-access" className="box-border caret-transparent block">
        <button className={commonClasses.buttonPrimary}>
          {content.cta.primary}
        </button>
      </a>
    </div>
  );
};
