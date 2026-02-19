import { useState } from 'react';
import { CodeContent } from "@/sections/CodeSection/components/CodeContent";
import { CodePreview } from "@/sections/CodeSection/components/CodePreview";

export const CodeSection = () => {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="items-center box-border caret-transparent gap-x-0 flex basis-[0%] flex-col-reverse grow gap-y-0 w-full md:flex-row">
      <CodeContent />
      <div className="box-border caret-transparent basis-[0%] grow h-full w-full">
        <div className="relative box-border caret-transparent gap-x-2 flex flex-col h-full gap-y-2 w-full">
          <div className="relative box-border caret-transparent gap-x-2 flex flex-col gap-y-2 pl-6">
            <div
              role="tablist"
              className="text-[lab(48.496_0_0)] dark:text-[lab(90_0_0)] items-center box-border caret-transparent grid grid-cols-[repeat(2,minmax(0px,1fr))] h-9 justify-center w-fit p-[3px]"
            >
              <button
                type="button"
                role="tab"
                onClick={() => setActiveTab('preview')}
                className={`text-sm font-medium items-center caret-transparent gap-x-1.5 flex basis-[0%] grow h-[calc(100%_-_1px)] justify-center leading-5 gap-y-1.5 text-center text-nowrap px-2 py-1 transition-all ${
                  activeTab === 'preview'
                    ? 'text-[lab(7.78201_-0.0000149012_0)] dark:text-[lab(95_0_0)] bg-[lab(98.84_0.0000298023_-0.0000119209)] dark:bg-[lab(15_0_0)]'
                    : 'text-[oklab(0.205_-0.00000207871_0.00000478327_/_0.5)] dark:text-[oklab(0.6_0_0_/_0.6)] bg-transparent hover:text-[lab(7.78201_-0.0000149012_0)] dark:hover:text-[lab(95_0_0)]'
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                role="tab"
                onClick={() => setActiveTab('code')}
                className={`text-sm font-medium items-center caret-transparent gap-x-1.5 flex basis-[0%] grow h-[calc(100%_-_1px)] justify-center leading-5 gap-y-1.5 text-center text-nowrap px-2 py-1 transition-all ${
                  activeTab === 'code'
                    ? 'text-[lab(7.78201_-0.0000149012_0)] dark:text-[lab(95_0_0)] bg-[lab(98.84_0.0000298023_-0.0000119209)] dark:bg-[lab(15_0_0)]'
                    : 'text-[oklab(0.205_-0.00000207871_0.00000478327_/_0.5)] dark:text-[oklab(0.6_0_0_/_0.6)] bg-transparent hover:text-[lab(7.78201_-0.0000149012_0)] dark:hover:text-[lab(95_0_0)]'
                }`}
              >
                Code
              </button>
            </div>
          </div>
          <div className="relative bg-[lab(98.84_0.0000298023_-0.0000119209)] dark:bg-[lab(10_0_0)] box-border caret-transparent max-w-full w-full p-[3px] rounded-sm">
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden pointer-events-none w-px left-0 -inset-y-10 md:block"></div>
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden pointer-events-none w-px z-[-1] left-4 -inset-y-6 md:block"></div>
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden pointer-events-none w-px -right-px -inset-y-10 md:block"></div>
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden pointer-events-none w-px z-[-1] right-4 -inset-y-6 md:block"></div>
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden h-px pointer-events-none top-0 -inset-x-6 md:block"></div>
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden h-px pointer-events-none z-[-1] top-4 -inset-x-6 md:block"></div>
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden h-px pointer-events-none bottom-0 -inset-x-6 md:block"></div>
            <div className="absolute bg-[oklab(0.205_-0.00000207871_0.00000478327_/_0.2)] dark:bg-[oklab(0.8_0_0_/_0.2)] box-border caret-transparent hidden h-px pointer-events-none z-[-1] bottom-4 -inset-x-6 md:block"></div>
            <CodePreview />
          </div>
        </div>
      </div>
    </div>
  );
};
