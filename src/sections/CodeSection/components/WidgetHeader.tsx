export const WidgetHeader = () => {
  return (
    <div className="absolute box-border caret-transparent h-[72px] z-10 top-0 inset-x-0">
      <div className="absolute items-center box-border caret-transparent gap-x-3 flex justify-between gap-y-3 z-10 px-4 inset-0">
        <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3"></div>
        <button
          type="button"
          className="text-sm font-medium items-center bg-transparent caret-transparent gap-x-2 flex shrink-0 h-6 justify-center leading-5 gap-y-2 text-center text-nowrap w-6 border p-0 rounded-sm border-solid border-transparent"
        >
          <img
            src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-16.svg"
            alt="Icon"
            className="box-border caret-transparent shrink-0 h-4 pointer-events-none text-nowrap w-4"
          />
        </button>
      </div>
    </div>
  );
};
