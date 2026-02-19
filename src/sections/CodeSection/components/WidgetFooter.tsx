export const WidgetFooter = () => {
  return (
    <div className="items-center box-border caret-transparent gap-x-2 flex flex-col shrink-0 justify-center gap-y-2 pb-4 px-6">
      <div className="sticky items-center box-border caret-transparent gap-x-2 flex flex-col gap-y-2 w-full z-10 bottom-4">
        <button
          type="button"
          className="relative text-sm font-medium items-center bg-[oklab(0.974298_0.0000246871_0_/_0.5)] caret-transparent gap-x-2 flex shrink-0 h-14 justify-between leading-5 gap-y-2 text-center text-nowrap w-full border border-[lab(90.952_0_-0.0000119209)] px-4 py-0 rounded-sm border-solid"
        >
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-17.svg"
            alt="Icon"
            className="absolute text-[oklab(0.145_-0.00000143796_0.00000340492_/_0.6)] box-border caret-transparent shrink-0 h-3 pointer-events-none text-nowrap w-3 right-4 top-2/4"
          />
          <span className="box-border caret-transparent block text-nowrap">
            Ask us a question
          </span>
        </button>
        <a
          href="https://cossistant.com/?ref=chatbox&domain=cossistant.com&name=Cossistant"
          className="text-[oklab(0.145_-0.00000143796_0.00000340492_/_0.8)] font-medium items-center box-border caret-transparent gap-x-1.5 flex gap-y-1.5 mt-4"
        >
          <span className="text-[oklch(0.443498_0.0000185904_none)] text-xs box-border caret-transparent block leading-4">
            We run on
          </span>
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-18.svg"
            alt="Icon"
            className="box-border caret-transparent h-3 w-5"
          />
        </a>
      </div>
      <div className="box-border caret-transparent"></div>
    </div>
  );
};
