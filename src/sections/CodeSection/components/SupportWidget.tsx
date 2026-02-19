import { WidgetHeader } from "@/sections/CodeSection/components/WidgetHeader";
import { WidgetContent } from "@/sections/CodeSection/components/WidgetContent";
import { WidgetFooter } from "@/sections/CodeSection/components/WidgetFooter";

export const SupportWidget = () => {
  return (
    <div className="relative box-border caret-transparent flex flex-col h-full w-full">
      <WidgetHeader />
      <WidgetContent />
      <WidgetFooter />
    </div>
  );
};
