import { InboxInterface } from "@/sections/Hero/components/InboxInterface";

interface BrowserMockupProps {
  imageUrl?: string;
}

export const BrowserMockup = ({ imageUrl }: BrowserMockupProps) => {
  return (
    <div className="shadow-ds-shadow-lg box-border caret-transparent h-full max-h-full w-auto border border-ds-border/50 overflow-hidden rounded-md border-solid bg-ds-background">
      <InboxInterface imageUrl={imageUrl} />
    </div>
  );
};
