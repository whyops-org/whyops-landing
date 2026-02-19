interface InboxInterfaceProps {
  imageUrl?: string;
}

export const InboxInterface = ({ imageUrl }: InboxInterfaceProps) => {
  return (
    <div className="bg-ds-background box-border caret-transparent flex flex-col h-full w-auto min-w-[320px] overflow-hidden md:min-w-[560px] lg:min-w-[720px] xl:min-w-[900px]">
      <div className="items-center box-border h-8 bg-ds-background dark:dark:bg-ds-dark-backgroundTertiary caret-transparent gap-x-2 flex justify-between min-h-0 min-w-0 gap-y-2 border-primary/30 px-4  border-b border-solid md:min-h-[auto] md:min-w-[auto]">
        <div className="box-border caret-transparent gap-x-2 flex min-h-0 min-w-0 gap-y-2 w-20 md:min-h-[auto] md:min-w-[auto]">
          <div className="bg-status-error box-border caret-transparent h-2 min-h-0 min-w-0 w-2 rounded-full md:min-h-[auto] md:min-w-[auto]"></div>
          <div className="bg-status-warning box-border caret-transparent h-2 min-h-0 min-w-0 w-2 rounded-full md:min-h-[auto] md:min-w-[auto]"></div>
          <div className="bg-status-info box-border caret-transparent h-2 min-h-0 min-w-0 w-2 rounded-full md:min-h-[auto] md:min-w-[auto]"></div>
        </div>
        <div className="items-center bg-ds-background dark:dark:bg-ds-dark-backgroundTertiary box-border caret-transparent gap-x-2 flex basis-[0%] grow justify-center min-h-0 min-w-0 gap-y-2 ml-4 px-3 py-1.5 md:min-h-[auto] md:min-w-[auto]">
          <span className="text-ds-textTertiary dark:text-ds-dark-textTertiary text-xs bg-ds-backgroundTertiary dark:bg-ds-dark-backgroundTertiary box-border caret-transparent block leading-4 min-h-0 min-w-0 px-2 py-1 rounded-md md:min-h-[auto] md:min-w-[auto]">
            https://app.whyops.com
          </span>
        </div>
        <div className="box-border caret-transparent min-h-0 min-w-0 w-20 md:min-h-[auto] md:min-w-[auto]"></div>
      </div>
      <div className="bg-ds-background box-border caret-transparent basis-[0%] grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
        <div className="box-border caret-transparent h-full w-full">
          <div className="relative bg-ds-backgroundSecondary box-border caret-transparent flex flex-col h-full w-full overflow-hidden min-h-[320px] md:min-h-[420px]">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Inbox preview" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
