export const WidgetContent = () => {
  return (
    <div className="relative box-border caret-transparent flex basis-[0%] flex-col grow pt-10 px-6">
      <div className="box-border caret-transparent gap-x-2 flex flex-col gap-y-2">
        <div className="box-border caret-transparent gap-x-2 flex blur-0 flex-col gap-y-2">
          <div className="items-center box-border caret-transparent grid grid-cols-[repeat(1,32px)]">
            <div className="relative items-center box-border caret-transparent grid h-11 justify-items-center w-11">
              <div className="relative box-border caret-transparent h-full w-full">
                <div className="items-center bg-[oklch(0.958598_0.0000242897_none)] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,oklab(0.921998_-0.00000908971_0.0000215769_/_0.3)_0px_0px_0px_1px,rgba(0,0,0,0)_0px_0px_0px_0px] box-border caret-transparent flex h-full justify-center w-full overflow-clip rounded-sm">
                  <img
                    alt="Anthony Riera"
                    src="https://github.com/rieranthony.png"
                    className="box-border caret-transparent max-w-full"
                  />
                </div>
                <span className="absolute bg-[lab(69.2659_-47.9201_46.2781)] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,lab(98.84_0.0000298023_-0.0000119209)_0px_0px_0px_2px,rgba(0,0,0,0)_0px_0px_0px_0px] box-border caret-transparent block h-1.5 w-1.5 z-10 rounded-[3.35544e+07px] -right-0.5 -bottom-0.5"></span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-medium box-border caret-transparent leading-9 max-w-xs font-geist">
            Morning Marc, how can we help?
          </h2>
        </div>
      </div>
    </div>
  );
};
