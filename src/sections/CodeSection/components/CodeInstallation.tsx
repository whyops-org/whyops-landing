import { animations, borders, colors, typography } from '@/design-system';
import { content } from '@/design-system/content';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export const CodeInstallation = () => {
  const [activeTab, setActiveTab] = useState('pnpm');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content.code.installCommands[activeTab as keyof typeof content.code.installCommands]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative box-border caret-transparent overflow-auto">
      <div className="box-border caret-transparent gap-x-0 flex flex-col gap-y-0">
        <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2 px-3 py-1">
          <div
            role="tablist"
            className={`text-ds-text-code dark:text-ds-dark-textSecondary items-center box-border caret-transparent flex h-9 justify-center w-fit`}
          >
            {Object.keys(content.code.installCommands).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium items-center caret-transparent gap-x-1.5 flex basis-[0%] grow h-7 justify-center leading-5 gap-y-1.5 text-center text-nowrap border pt-0.5 pb-1 px-2 ${borders.radius.sm} ${borders.style.solid} ${animations.transitions.all} ${
                  activeTab === tab
                    ? `text-primary dark:text-ds-dark-textPrimary bg-ds-background dark:bg-ds-dark-backgroundElevated shadow-none border-ds-border-tertiary dark:border-ds-dark-borderSecondary`
                    : `text-ds-textQuaternary dark:text-ds-dark-textTertiary bg-transparent border-transparent hover:text-primary dark:hover:text-ds-dark-textPrimary`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="box-border caret-transparent overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animations.duration.fast }}
            role="tabpanel"
            className="box-border caret-transparent basis-[0%] grow px-4 py-3.5"
          >
            <pre className={`box-border caret-transparent font-${typography.fontFamily.mono}`}>
              <code className={`relative text-primary dark:text-ds-dark-textSecondary text-sm box-border caret-transparent leading-[14px] text-nowrap`}>
                {content.code.installCommands[activeTab as keyof typeof content.code.installCommands]}
              </code>
            </pre>
          </motion.div>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className={`absolute text-sm font-medium items-center bg-transparent caret-transparent gap-x-2 flex shrink-0 h-7 justify-center leading-5 opacity-70 gap-y-2 text-center text-nowrap w-7 z-10 border p-0 ${borders.radius.sm} ${borders.style.solid} border-transparent right-2 top-2 ${animations.transitions.all} hover:opacity-100 text-ds-textTertiary dark:text-ds-dark-textSecondary`}
      >
        <span className="absolute box-border caret-transparent block h-px text-nowrap w-px overflow-hidden -m-px">
          Copy
        </span>
        {copied ? (
          <Check className="h-4 w-4 text-status-success" />
        ) : (
          <Copy className={`h-4 w-4 text-ds-textTertiary dark:text-ds-dark-textSecondary`} />
        )}
      </button>
    </div>
  );
};
