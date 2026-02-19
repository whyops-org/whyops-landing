export const IntegrationBanner = () => {
  return (
    <div className="items-center box-border caret-transparent gap-x-10 flex flex-col-reverse justify-center gap-y-10 w-full mt-10 px-6 md:flex-row md:justify-between md:mt-auto md:px-4">
      <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
        <p className="text-[oklab(0.145_-0.00000143796_0.00000340492_/_0.6)] text-xs box-border caret-transparent leading-4 font-geist_mono">
          Works well with
        </p>
        <a
          href="https://react.dev/"
          className="box-border caret-transparent block"
        >
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-9.svg"
            alt="Icon"
            className="box-border caret-transparent h-4 w-4"
          />
        </a>
        <a
          href="https://nextjs.org/"
          className="box-border caret-transparent block"
        >
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-10.svg"
            alt="Icon"
            className="box-border caret-transparent h-4 w-4"
          />
        </a>
        <a
          href="https://tailwindcss.com/"
          className="box-border caret-transparent block"
        >
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-11.svg"
            alt="Icon"
            className="box-border caret-transparent h-4 w-4"
          />
        </a>
        <a
          href="https://ui.shadcn.com/"
          className="box-border caret-transparent block"
        >
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-12.svg"
            alt="Icon"
            className="box-border caret-transparent h-4 w-4"
          />
        </a>
      </div>
      <div className="box-border caret-transparent gap-x-2 hidden min-h-0 min-w-0 gap-y-2 w-max md:flex md:min-h-[auto] md:min-w-[auto]">
        <button
          type="button"
          className="text-sm font-medium items-center bg-[lab(96.52_-0.0000298023_0.0000119209)] caret-transparent gap-x-1.5 inline-flex shrink-0 h-8 justify-center leading-5 min-h-0 min-w-0 gap-y-1.5 text-center text-nowrap border border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] px-3 py-0 rounded-sm border-dashed md:flex md:min-h-[auto] md:min-w-[auto]"
        >
          Support inbox
        </button>
        <button
          type="button"
          className="text-[lab(7.78201_-0.0000149012_0)] text-sm font-medium items-center bg-[lab(95.36_0_0)] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,oklab(0.205_-0.00000207871_0.00000478327_/_0.2)_0px_0px_0px_2px,rgba(0,0,0,0)_0px_0px_0px_0px] caret-transparent gap-x-1.5 inline-flex shrink-0 h-8 justify-center leading-5 min-h-0 min-w-0 gap-y-1.5 text-center text-nowrap border px-3 py-0 rounded-sm border-solid border-transparent md:flex md:min-h-[auto] md:min-w-[auto]"
        >
          Real-time conversation
        </button>
        <button
          type="button"
          className="text-[lab(7.78201_-0.0000149012_0)] text-sm font-medium items-center bg-[lab(95.36_0_0)] caret-transparent gap-x-2 inline-flex shrink-0 h-8 justify-center leading-5 min-h-0 min-w-0 gap-y-2 text-center text-nowrap w-8 border p-0 rounded-sm border-solid border-transparent md:flex md:min-h-[auto] md:min-w-[auto]"
        >
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-13.svg"
            alt="Icon"
            className="text-[oklab(0.205_-0.00000207871_0.00000478327_/_0.6)] box-border caret-transparent shrink-0 h-4 pointer-events-none text-nowrap w-4"
          />
        </button>
      </div>
    </div>
  );
};
