import { colors, typography, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const FooterBrand = () => {
  return (
    <div className="box-border caret-transparent col-end-[span_1] col-start-[span_1] md:col-end-[span_2] md:col-start-[span_2]">
      <div className="items-center box-border caret-transparent flex mb-4">
        <span className={`text-[${colors.primary.DEFAULT}] dark:text-[${colors.dark.text.primary}] text-2xl items-center box-border caret-transparent gap-x-2 flex gap-y-1 font-${typography.fontFamily.display}`}>
          {content.site.name}
        </span>
      </div>
      <p className={`${commonClasses.muted} text-sm box-border caret-transparent leading-5 max-w-md mb-6`}>
        {content.footer.description}
      </p>
    </div>
  );
};
