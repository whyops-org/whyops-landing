import { CodeContent } from "@/sections/CodeSection/components/CodeContent";
import { CodePreview } from "@/sections/CodeSection/components/CodePreview";
import { useState } from 'react';

export const CodeSection = () => {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="items-center box-border caret-transparent gap-x-0 md:gap-x-10 flex basis-[0%] flex-col-reverse grow gap-y-0 w-full md:flex-row">
      <CodeContent />
      <div className="box-border caret-transparent basis-[0%] grow h-full w-full">
        <div className="relative box-border caret-transparent gap-x-2 flex flex-col h-full gap-y-2 w-full">
          <div className="relative border border-primary/10 bg-ds-background dark:bg-ds-dark-backgroundSecondary box-border caret-transparent max-w-full w-full p-[3px] rounded-sm">
            <CodePreview />
          </div>
        </div>
      </div>
    </div>
  );
};
