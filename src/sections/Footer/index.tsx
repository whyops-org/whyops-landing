import { FooterBottom } from "@/sections/Footer/components/FooterBottom";
import { FooterContent } from "@/sections/Footer/components/FooterContent";
import { doh, useAsciiText } from "react-ascii-text";

export const Footer = () => {
  const asciiRef = useAsciiText({
    font: doh,
    text: "WHYOPS",
    isAnimated: false,
  });

  return (
    <footer className="box-border caret-transparent flex-col border-ds-border dark:border-ds-dark-border mt-16 border-t border-dashed md:mt-0 md:border-transparent">
      <FooterContent />
      <div className="items-center box-border caret-transparent flex flex-col justify-between border-ds-border dark:border-ds-dark-border border-t border-dashed md:items-start">
        <FooterBottom />
        <div className="items-center box-border caret-transparent gap-x-6 flex flex-col justify-between gap-y-6 w-full border-ds-border dark:border-ds-dark-border mx-auto pt-4 px-4 border-l border-r border-dashed md:items-start md:gap-x-0 md:flex-row md:gap-y-0">
          <div className="box-border caret-transparent w-full opacity-40">
            <div className="w-full overflow-hidden">
              <pre
                ref={asciiRef as React.RefObject<HTMLPreElement>}
                className="w-full max-w-full text-center"
                style={{
                  display: "block",
                  width: "100%",
                  whiteSpace: "pre",
                  fontSize: "clamp(10px, 1.8vw, 20px)",
                  lineHeight: "1",
                  margin: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
