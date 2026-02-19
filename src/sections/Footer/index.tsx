import { FooterContent } from "@/sections/Footer/components/FooterContent";
import { FooterBottom } from "@/sections/Footer/components/FooterBottom";

export const Footer = () => {
  return (
    <footer className="box-border caret-transparent flex-col border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] mt-16 border-t border-dashed md:mt-0 md:border-transparent">
      <FooterContent />
      <div className="items-center box-border caret-transparent flex flex-col justify-between border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] border-t border-dashed md:items-start">
        <FooterBottom />
          <div className="items-center box-border caret-transparent gap-x-6 flex flex-col justify-between max-w-[1400px] gap-y-6 w-full border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] mx-auto pt-4 pb-20 px-4 border-l border-r border-dashed md:items-start md:gap-x-0 md:flex-row md:gap-y-0">
          <div className="box-border caret-transparent h-full opacity-40 w-full">
            <div className="relative box-border caret-transparent h-[52px] w-[339px] overflow-hidden md:h-48 md:w-[1244px]">
              <div className="box-border caret-transparent h-full w-full">
                <div className="absolute text-black box-border caret-transparent pointer-events-none left-0 top-0">
                  <table className="text-[11.1111px] caret-transparent tracking-[-1px] leading-[11.1111px] text-left text-nowrap border-collapse font-courier_new"></table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
