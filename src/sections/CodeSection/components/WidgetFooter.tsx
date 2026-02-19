import { brand } from '@/lib/env';

export const WidgetFooter = () => {
  return (
    <div className="items-center box-border caret-transparent gap-x-2 flex flex-col shrink-0 justify-center gap-y-2 pb-4 px-6">
      <div className="sticky items-center box-border caret-transparent gap-x-2 flex flex-col gap-y-2 w-full z-10 bottom-4">
        <button
          type="button"
          className="relative text-sm font-medium items-center bg-ds-background-secondary/50 caret-transparent gap-x-2 flex shrink-0 h-14 justify-between leading-5 gap-y-2 text-center text-nowrap w-full border border-ds-border-tertiary px-4 py-0 rounded-sm border-solid"
        >
          <img
            src="/assets/chevron-down.svg"
            alt="Icon"
            className="absolute text-ds-text-disabled box-border caret-transparent shrink-0 h-3 pointer-events-none text-nowrap w-3 right-4 top-2/4"
          />
          <span className="box-border caret-transparent block text-nowrap">
            Ask us a question
          </span>
        </button>
        <a
          href={`${brand.url}/?ref=chatbox&domain=${brand.url.replace('https://', '')}&name=${brand.name}`}
          className="text-ds-text dark:text-ds-dark-textSecondary font-medium items-center box-border caret-transparent gap-x-1.5 flex gap-y-1.5 mt-4"
        >
          <span className="text-ds-textMuted text-xs box-border caret-transparent block leading-4">
            We run on
          </span>
          <img
            src={brand.logo.src}
            alt={brand.logo.alt}
            className="box-border caret-transparent h-3 w-5"
          />
        </a>
      </div>
      <div className="box-border caret-transparent"></div>
    </div>
  );
};
