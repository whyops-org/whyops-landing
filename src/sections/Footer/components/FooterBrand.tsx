import { brand } from '@/lib/env';
import { commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const FooterBrand = () => {
  return (
    <div className="box-border caret-transparent col-end-[span_1] col-start-[span_1] md:col-end-[span_2] md:col-start-[span_2]">
      <div className="items-center box-border caret-transparent flex gap-x-2 mb-4">
        <img 
          src={brand.logo.src} 
          alt={brand.logo.alt}
          className="h-8 w-8"
        />
        <span className="text-ds-textPrimary dark:text-ds-dark-text-primary text-xl font-semibold">
          {brand.name}
        </span>
      </div>
      <p className={`${commonClasses.muted} text-sm box-border caret-transparent leading-5 max-w-md mb-6`}>
        {content.footer.description}
      </p>
    </div>
  );
};
