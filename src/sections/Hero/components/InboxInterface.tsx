export const InboxInterface = () => {
  return (
    <div className="bg-ds-background box-border caret-transparent flex flex-col h-[720px] min-h-[720px] w-full overflow-hidden md:h-full md:min-h-0">
      <div className="items-center box-border caret-transparent gap-x-2 flex justify-between min-h-0 min-w-0 gap-y-2 border-ds-border px-4 py-1 border-b border-solid md:min-h-[auto] md:min-w-[auto]">
        <div className="box-border caret-transparent gap-x-2 flex min-h-0 min-w-0 gap-y-2 w-20 md:min-h-[auto] md:min-w-[auto]">
          <div className="bg-status-error box-border caret-transparent h-2 min-h-0 min-w-0 w-2 rounded-full md:min-h-[auto] md:min-w-[auto]"></div>
          <div className="bg-status-warning box-border caret-transparent h-2 min-h-0 min-w-0 w-2 rounded-full md:min-h-[auto] md:min-w-[auto]"></div>
          <div className="bg-status-info box-border caret-transparent h-2 min-h-0 min-w-0 w-2 rounded-full md:min-h-[auto] md:min-w-[auto]"></div>
        </div>
        <div className="items-center bg-ds-background box-border caret-transparent gap-x-2 flex basis-[0%] grow justify-center min-h-0 min-w-0 gap-y-2 ml-4 px-3 py-1.5 md:min-h-[auto] md:min-w-[auto]">
          <span className="text-ds-textTertiary text-xs bg-ds-backgroundTertiary box-border caret-transparent block leading-4 min-h-0 min-w-0 px-2 py-1 rounded-md md:min-h-[auto] md:min-w-[auto]">
            https://cossistant.com/shadcn/inbox
          </span>
        </div>
        <div className="box-border caret-transparent min-h-0 min-w-0 w-20 md:min-h-[auto] md:min-w-[auto]"></div>
      </div>
      <div className="bg-ds-background box-border caret-transparent basis-[0%] grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
        <div className="box-border caret-transparent h-[684px] w-full md:h-[800px]">
          <div className="relative bg-ds-backgroundSecondary box-border caret-transparent flex flex-col h-full w-full overflow-hidden">
            <header className="items-center box-border caret-transparent gap-x-4 flex h-16 justify-between min-h-16 min-w-0 pointer-events-none gap-y-4 w-full pl-[26px] pr-3 md:min-w-[auto]">
              <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow min-h-0 min-w-0 gap-y-3 md:min-h-[auto] md:min-w-[auto]">
                <a
                  href="/"
                  className="box-border caret-transparent block min-h-0 min-w-0 mr-2 md:min-h-[auto] md:min-w-[auto]"
                >
                  <img
                    src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-4.svg"
                    alt="Icon"
                    className="text-primary box-border caret-transparent h-[22px] w-[22px]"
                  />
                </a>
                <a
                  href="/agent"
                  className="relative text-ds-textSecondary text-sm items-center box-border caret-transparent gap-x-2 flex leading-5 min-h-0 min-w-0 gap-y-2 p-1 rounded-sm md:min-h-[auto] md:min-w-[auto] md:px-2"
                >
                  <span className="box-border caret-transparent hidden basis-[0%] grow min-h-0 min-w-0 text-ellipsis text-nowrap overflow-hidden md:block md:min-h-[auto] md:min-w-[auto]">
                    <span className="items-center box-border caret-transparent gap-x-1.5 flex gap-y-1.5 text-nowrap">
                      Agent
                      <span className="text-white text-[10px] font-medium bg-semantic-orange box-border caret-transparent block leading-[10px] min-h-0 min-w-0 text-nowrap px-1.5 py-0.5 rounded-sm md:min-h-[auto] md:min-w-[auto]">
                        AI
                      </span>
                    </span>
                  </span>
                </a>
              </div>
              <div className="items-center box-border caret-transparent gap-x-3 flex min-h-0 min-w-0 gap-y-3 mr-2 md:min-h-[auto] md:min-w-[auto]">
                <a
                  href="/contacts"
                  className="relative text-ds-textSecondary text-sm items-center box-border caret-transparent gap-x-2 flex leading-5 min-h-0 min-w-0 gap-y-2 p-1 rounded-sm md:min-h-[auto] md:min-w-[auto] md:px-2"
                >
                  <span className="box-border caret-transparent hidden basis-[0%] grow min-h-0 min-w-0 text-ellipsis text-nowrap overflow-hidden md:block md:min-h-[auto] md:min-w-[auto]">
                    Contacts
                  </span>
                </a>
                <div className="relative text-ds-textSecondary text-sm items-center box-border caret-transparent gap-x-2 flex leading-5 min-h-0 min-w-0 gap-y-2 px-2 py-1 rounded-sm md:min-h-[auto] md:min-w-[auto]">
                  <img
                    src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-5.svg"
                    alt="Icon"
                    className="box-border caret-transparent h-4 w-4"
                  />
                  <span className="font-medium box-border caret-transparent block min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                    Need help?
                  </span>
                </div>
              </div>
            </header>
            <div className="box-border caret-transparent flex basis-[0%] grow h-[612px] min-w-0 w-full pb-2 px-2 md:h-[736px] md:min-w-[auto]">
              <section className="bg-ds-background box-border caret-transparent flex basis-[0%] grow h-full max-h-full min-w-0 border border-ds-border overflow-clip rounded-sm border-solid md:min-w-[auto]">
                <aside className="static box-content caret-black block min-h-0 min-w-0 pointer-events-auto w-auto border-r-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-1 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-72 md:border-ds-border md:border-r md:border-solid">
                  <div className="static box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:gap-x-1 md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-1 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:p-2 md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="box-content caret-black gap-x-[normal] block basis-auto flex-row grow-0 max-h-none min-h-0 min-w-0 gap-y-[normal] md:aspect-auto md:box-border md:caret-transparent md:gap-x-1 md:flex md:basis-[0%] md:flex-col md:grow md:max-h-full md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-1 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      <a
                        href="/"
                        className="static text-black text-base items-normal bg-transparent box-content caret-black gap-x-[normal] inline h-auto leading-[normal] min-h-0 min-w-0 gap-y-[normal] p-0 rounded-none md:relative md:text-ds-textPrimary md:text-sm md:items-center md:aspect-auto md:bg-ds-backgroundSecondary md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:h-10 md:leading-5 md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-2.5 md:px-3 md:py-1 md:rounded-sm"
                      >
                        <span className="box-content caret-black inline basis-auto grow-0 min-h-0 min-w-0 text-clip text-wrap md:aspect-auto md:box-border md:caret-transparent md:block md:basis-[0%] md:grow md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:text-ellipsis md:text-nowrap md:overflow-hidden">
                          Inbox
                        </span>
                        <span className="text-black text-base box-content caret-black inline leading-[normal] min-h-0 min-w-0 pr-0 md:text-ds-textQuaternary md:text-xs md:block md:leading-4 md:pr-1">
                          10
                        </span>
                      </a>
                      <a
                        href="/resolved"
                        className="static text-black text-base items-normal box-content caret-black gap-x-[normal] inline h-auto leading-[normal] min-h-0 min-w-0 gap-y-[normal] p-0 rounded-none md:relative md:text-ds-textSecondary md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:h-10 md:leading-5 md:min-h-[auto] md:min-w-[auto] md:px-3 md:py-1 md:rounded-sm"
                      >
                        <span className="box-content caret-black inline basis-auto grow-0 min-h-0 min-w-0 text-clip text-wrap md:aspect-auto md:box-border md:caret-transparent md:block md:basis-[0%] md:grow md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                          Resolved
                        </span>
                      </a>
                      <a
                        href="/spam"
                        className="static text-black text-base items-normal box-content caret-black gap-x-[normal] inline h-auto leading-[normal] min-h-0 min-w-0 gap-y-[normal] p-0 rounded-none md:relative md:text-ds-textSecondary md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:h-10 md:leading-5 md:min-h-[auto] md:min-w-[auto] md:px-3 md:py-1 md:rounded-sm"
                      >
                        <span className="box-content caret-black inline basis-auto grow-0 min-h-0 min-w-0 text-clip text-wrap md:aspect-auto md:box-border md:caret-transparent md:block md:basis-[0%] md:grow md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                          Spam
                        </span>
                      </a>
                      <a
                        href="/archived"
                        className="static text-black text-base items-normal box-content caret-black gap-x-[normal] inline h-auto leading-[normal] min-h-0 min-w-0 gap-y-[normal] p-0 rounded-none md:relative md:text-ds-textSecondary md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:h-10 md:leading-5 md:min-h-[auto] md:min-w-[auto] md:px-3 md:py-1 md:rounded-sm"
                      >
                        <span className="box-content caret-black inline basis-auto grow-0 min-h-0 min-w-0 text-clip text-wrap md:aspect-auto md:box-border md:caret-transparent md:block md:basis-[0%] md:grow md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                          Archived
                        </span>
                      </a>
                    </div>
                    <a
                      href="/docs"
                      className="static text-black text-base items-normal box-content caret-black gap-x-[normal] inline h-auto leading-[normal] min-h-0 min-w-0 gap-y-[normal] p-0 rounded-none md:relative md:text-ds-textSecondary md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:h-10 md:leading-5 md:min-h-[auto] md:min-w-[auto] md:px-3 md:py-1 md:rounded-sm"
                    >
                      <span className="box-content caret-black inline basis-auto grow-0 min-h-0 min-w-0 text-clip text-wrap md:aspect-auto md:box-border md:caret-transparent md:block md:basis-[0%] md:grow md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                        Docs
                      </span>
                    </a>
                    <a
                      href="/settings"
                      className="static text-black text-base items-normal box-content caret-black gap-x-[normal] inline h-auto leading-[normal] min-h-0 min-w-0 gap-y-[normal] p-0 rounded-none md:relative md:text-ds-textSecondary md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:h-10 md:leading-5 md:min-h-[auto] md:min-w-[auto] md:px-3 md:py-1 md:rounded-sm"
                    >
                      <span className="box-content caret-black inline basis-auto grow-0 min-h-0 min-w-0 text-clip text-wrap md:aspect-auto md:box-border md:caret-transparent md:block md:basis-[0%] md:grow md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                        Settings
                      </span>
                    </a>
                    <div
                      role="none"
                      className="bg-transparent box-content caret-black shrink h-auto min-h-0 min-w-0 opacity-100 w-auto md:aspect-auto md:bg-ds-borderTertiary md:box-border md:caret-transparent md:shrink-0 md:h-px md:min-h-[auto] md:min-w-[auto] md:opacity-30 md:w-full"
                    ></div>
                    <button
                      type="button"
                      className="text-black text-[13.3333px] items-normal bg-zinc-100 caret-black gap-x-[normal] inline-block leading-[normal] min-h-0 min-w-0 gap-y-[normal] text-center px-1.5 py-px rounded-none md:text-ds-textSecondary md:text-sm md:items-center md:aspect-auto md:bg-transparent md:caret-transparent md:gap-x-2.5 md:flex md:leading-5 md:min-h-[auto] md:min-w-[auto] md:px-3 md:py-2.5 md:rounded-sm"
                    >
                      <div className="box-content caret-black block basis-auto grow-0 leading-[normal] min-h-0 min-w-0 md:aspect-auto md:box-border md:caret-transparent md:grid md:basis-[0%] md:grow md:leading-[17.5px] md:min-h-[auto] md:min-w-[auto]">
                        <div className="bg-transparent box-content caret-black h-auto min-h-0 min-w-0 w-auto rounded-none md:aspect-auto md:bg-ds-backgroundTertiary md:box-border md:caret-transparent md:h-4 md:min-h-[auto] md:min-w-[auto] md:w-24 md:rounded-sm"></div>
                      </div>
                      <div className="bg-transparent box-content caret-black h-auto min-h-0 min-w-0 w-auto rounded-none md:aspect-auto md:bg-ds-backgroundTertiary md:box-border md:caret-transparent md:h-5 md:min-h-[auto] md:min-w-5 md:w-5 md:rounded-sm"></div>
                    </button>
                  </div>
                </aside>
                <div className="static box-content caret-black block basis-auto flex-row grow-0 h-auto min-h-0 min-w-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:h-full md:min-h-[auto] md:min-w-[auto] md:overflow-hidden">
                  <div className="static items-normal bg-transparent box-content caret-black gap-x-[normal] block h-auto justify-normal gap-y-[normal] w-auto z-auto px-0 top-auto inset-x-auto md:absolute md:items-center md:aspect-auto md:bg-ds-background md:box-border md:caret-transparent md:gap-x-4 md:flex md:h-14 md:justify-between md:gap-y-4 md:w-full md:z-10 md:px-4 md:top-0">
                    <div className="items-normal box-content caret-black gap-x-[normal] block min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2 md:flex md:min-h-[auto] md:min-w-[auto]">
                      <h3 className="text-black text-[18.72px] font-bold box-content caret-black leading-[normal] min-h-0 min-w-0 normal-case md:text-ds-textPrimary md:text-sm md:font-medium md:leading-5">
                        Inbox
                      </h3>
                    </div>
                  </div>
                  <div className="static box-content caret-black block basis-auto flex-row grow-0 h-auto min-h-0 min-w-0 overflow-x-visible overflow-y-visible p-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:h-full md:min-h-[auto] md:min-w-[auto] md:overflow-y-scroll md:pt-14 md:pb-4 md:px-4">
                    <div className="box-content caret-black h-auto min-h-0 min-w-0 overflow-x-visible overflow-y-visible md:aspect-auto md:box-border md:caret-transparent md:h-full md:min-h-[auto] md:min-w-[auto] md:overflow-y-scroll md:pb-10">
                      <div className="box-content caret-black pb-0 md:aspect-auto md:box-border md:caret-transparent md:pb-10">
                        <div className="box-content caret-black md:aspect-auto md:box-border md:caret-transparent">
                          <div className="box-content caret-black gap-x-[normal] block gap-y-[normal] md:aspect-auto md:box-border md:caret-transparent md:gap-x-2 md:flex md:gap-y-2 md:overflow-auto">
                            <div className="box-content caret-black block basis-auto flex-row grow-0 h-auto justify-normal min-h-0 min-w-0 md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:h-[42px] md:justify-between md:min-h-[auto] md:min-w-[150px]">
                              <p className="text-black text-base box-content caret-black leading-[normal] min-h-0 min-w-0 md:text-ds-textTertiary md:text-xs md:leading-4">
                                Median response time
                              </p>
                              <div className="items-baseline box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2 md:flex md:gap-x-1">
                                <span className="text-black font-normal box-content caret-black inline min-h-0 min-w-0 md:text-ds-textPrimary md:font-semibold md:block">
                                  5m 20s
                                </span>
                                <span className="text-black text-base font-normal box-content caret-black inline leading-[normal] min-h-0 min-w-0 md:text-semantic-positive md:text-xs md:font-medium md:block md:leading-4">
                                  -22%
                                </span>
                              </div>
                            </div>
                            <div className="box-content caret-black block basis-auto flex-row grow-0 h-auto justify-normal min-h-0 min-w-0 md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:h-[42px] md:justify-between md:min-h-[auto] md:min-w-[150px]">
                              <p className="text-black text-base box-content caret-black leading-[normal] min-h-0 min-w-0 md:text-ds-textTertiary md:text-xs md:leading-4">
                                Median time to resolution
                              </p>
                              <div className="items-baseline box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2 md:flex md:gap-x-1">
                                <span className="text-black font-normal box-content caret-black inline min-h-0 min-w-0 md:text-ds-textPrimary md:font-semibold md:block">
                                  1h 30m
                                </span>
                                <span className="text-black text-base font-normal box-content caret-black inline leading-[normal] min-h-0 min-w-0 md:text-semantic-positive md:text-xs md:font-medium md:block md:leading-4">
                                  -11%
                                </span>
                              </div>
                            </div>
                            <div className="box-content caret-black block basis-auto flex-row grow-0 h-auto justify-normal min-h-0 min-w-0 md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:h-[42px] md:justify-between md:min-h-[auto] md:min-w-[150px]">
                              <p className="text-black text-base box-content caret-black leading-[normal] min-h-0 min-w-0 md:text-ds-textTertiary md:text-xs md:leading-4">
                                % handled by AI
                              </p>
                              <div className="items-baseline box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2 md:flex md:gap-x-1">
                                <span className="text-black font-normal box-content caret-black inline min-h-0 min-w-0 md:text-ds-textPrimary md:font-semibold md:block">
                                  62%
                                </span>
                                <span className="text-black text-base font-normal box-content caret-black inline leading-[normal] min-h-0 min-w-0 md:text-semantic-positive md:text-xs md:font-medium md:block md:leading-4">
                                  +13%
                                </span>
                              </div>
                            </div>
                            <div className="box-content caret-black block basis-auto flex-row grow-0 h-auto justify-normal min-h-0 min-w-0 md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:h-[42px] md:justify-between md:min-h-[auto] md:min-w-[150px]">
                              <p className="text-black text-base box-content caret-black leading-[normal] min-h-0 min-w-0 md:text-ds-textTertiary md:text-xs md:leading-4">
                                Satisfaction index
                              </p>
                              <div className="items-baseline box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2 md:flex md:gap-x-1">
                                <span className="text-black font-normal box-content caret-black inline min-h-0 min-w-0 md:text-ds-textPrimary md:font-semibold md:block">
                                  86
                                </span>
                                <span className="text-black text-base box-content caret-black inline leading-[normal] min-h-0 min-w-0 md:text-ds-textQuaternary md:text-xs md:block md:leading-4">
                                  /100
                                </span>
                                <span className="text-black text-base font-normal box-content caret-black inline leading-[normal] min-h-0 min-w-0 md:text-semantic-positive md:text-xs md:font-medium md:block md:leading-4">
                                  +5%
                                </span>
                              </div>
                            </div>
                            <div className="box-content caret-black block basis-auto flex-row grow-0 h-auto justify-normal min-h-0 min-w-0 md:aspect-auto md:box-border md:caret-transparent md:flex md:basis-[0%] md:flex-col md:grow md:h-[42px] md:justify-between md:min-h-[auto] md:min-w-[150px]">
                              <p className="text-black text-base box-content caret-black leading-[normal] min-h-0 min-w-0 md:text-ds-textTertiary md:text-xs md:leading-4">
                                Unique visitors
                              </p>
                              <div className="items-baseline box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-2 md:flex md:gap-x-1">
                                <span className="text-black font-normal box-content caret-black inline min-h-0 min-w-0 md:text-ds-textPrimary md:font-semibold md:block">
                                  1,280
                                </span>
                                <span className="text-black text-base font-normal box-content caret-black inline leading-[normal] min-h-0 min-w-0 md:text-semantic-positive md:text-xs md:font-medium md:block md:leading-4">
                                  +13%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-content caret-black md:aspect-auto md:box-border md:caret-transparent">
                        <div className="static text-base items-normal box-content caret-black gap-x-[normal] block leading-[normal] gap-y-[normal] rounded-none md:relative md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:leading-5 md:gap-y-3 md:p-2 md:rounded-sm">
                          <div className="static box-content caret-black min-h-0 min-w-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto]">
                            <span className="static shadow-none box-content caret-black inline shrink h-auto w-auto rounded-none md:relative md:shadow-none md:box-border md:caret-transparent md:flex md:shrink-0 md:h-8 md:w-8 md:overflow-hidden md:rounded-sm">
                              <span className="items-center box-content caret-black inline h-auto justify-normal min-h-0 min-w-0 pointer-events-auto w-auto md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:pointer-events-none md:w-full">
                                <div className="static text-black items-normal bg-transparent box-content caret-black block h-auto justify-normal min-h-0 min-w-0 w-auto md:relative md:items-center md:aspect-auto md:bg-purple-500/20 md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:w-full md:overflow-hidden">
                                  <div className="static bg-none box-content caret-black z-auto inset-auto md:absolute md:aspect-auto md:bg-gradient-to-br md:from-white/15 md:to-transparent md:box-border md:caret-transparent md:z-[1] md:inset-0"></div>
                                  <div className="static items-center box-content caret-black block flex-row justify-normal transform-none z-auto inset-auto md:absolute md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:z-[2] md:inset-0">
                                    <img
                                      src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-6.svg"
                                      alt="Icon"
                                      className="box-content caret-black w-auto md:aspect-auto md:box-border md:caret-transparent md:w-3/5"
                                    />
                                    <span className="text-base box-content caret-black inline leading-[normal] min-h-0 min-w-0 mt-0 md:text-[8.32px] md:block md:leading-[8.32px] md:mt-[8%]">
                                      P
                                    </span>
                                  </div>
                                </div>
                              </span>
                            </span>
                            <div className="static bg-transparent shadow-none box-content caret-black h-auto w-auto rounded-none right-auto bottom-auto md:absolute md:aspect-auto md:bg-emerald-500 md:box-border md:caret-transparent md:h-[5px] md:w-[5px] md:rounded-full md:-right-1 md:bottom-0.5"></div>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4 md:pr-6">
                            <p className="box-content caret-black shrink max-w-none min-h-0 min-w-0 text-clip normal-case text-wrap md:shrink-0 md:max-w-[140px] md:min-h-[auto] md:min-w-[140px] md:text-ellipsis md:capitalize md:text-nowrap md:overflow-hidden">
                              Pieter Levels
                            </p>
                            <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] pr-0 md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4">
                              <span className="text-black items-center box-content caret-black gap-x-[normal] inline basis-auto grow-0 min-h-0 gap-y-[normal] text-clip text-wrap md:text-ds-textPrimary md:items-center md:aspect-auto md:gap-x-2 md:flex md:basis-[0%] md:grow md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                <span className="box-content caret-black inline min-h-0 min-w-0 text-clip text-wrap md:block md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                  Can I upgrade to the annual plan and get the discount applied retroactively?
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:min-h-[auto] md:min-w-[auto]">
                            <div className="items-center box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-1 md:flex md:justify-end md:min-h-[auto] md:min-w-[102px]">
                              <span className="text-black text-base box-content caret-black inline shrink leading-[normal] min-h-0 min-w-0 pr-0 md:text-ds-textQuaternary md:text-xs md:block md:shrink-0 md:leading-4 md:pr-2">
                                6:23 AM
                              </span>
                              <span className="bg-transparent box-content caret-black inline h-auto min-h-0 min-w-0 w-auto rounded-none md:aspect-auto md:bg-semantic-orange md:box-border md:caret-transparent md:block md:h-1.5 md:min-h-[auto] md:min-w-[auto] md:w-1.5 md:rounded-full"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-content caret-black md:aspect-auto md:box-border md:caret-transparent">
                        <div className="static text-base items-normal box-content caret-black gap-x-[normal] block leading-[normal] gap-y-[normal] rounded-none md:relative md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:leading-5 md:gap-y-3 md:p-2 md:rounded-sm">
                          <div className="static box-content caret-black min-h-0 min-w-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto]">
                            <span className="static shadow-none box-content caret-black inline shrink h-auto w-auto rounded-none md:relative md:shadow-none md:box-border md:caret-transparent md:flex md:shrink-0 md:h-8 md:w-8 md:overflow-hidden md:rounded-sm">
                              <span className="items-center box-content caret-black inline h-auto justify-normal min-h-0 min-w-0 pointer-events-auto w-auto md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:pointer-events-none md:w-full">
                                <div className="static text-black items-normal bg-transparent box-content caret-black block h-auto justify-normal min-h-0 min-w-0 w-auto md:relative md:items-center md:aspect-auto md:bg-pink-500/20 md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:w-full md:overflow-hidden">
                                  <div className="static bg-none box-content caret-black z-auto inset-auto md:absolute md:aspect-auto md:bg-gradient-to-br md:from-white/15 md:to-transparent md:box-border md:caret-transparent md:z-[1] md:inset-0"></div>
                                  <div className="static items-center box-content caret-black block flex-row justify-normal transform-none z-auto inset-auto md:absolute md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:z-[2] md:inset-0">
                                    <img
                                      src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-6.svg"
                                      alt="Icon"
                                      className="box-content caret-black w-auto md:aspect-auto md:box-border md:caret-transparent md:w-3/5"
                                    />
                                    <span className="text-base box-content caret-black inline leading-[normal] min-h-0 min-w-0 mt-0 md:text-[8.32px] md:block md:leading-[8.32px] md:mt-[8%]">
                                      N
                                    </span>
                                  </div>
                                </div>
                              </span>
                            </span>
                            <div className="static bg-transparent shadow-none box-content caret-black h-auto w-auto rounded-none right-auto bottom-auto md:absolute md:aspect-auto md:bg-emerald-500 md:box-border md:caret-transparent md:h-[5px] md:w-[5px] md:rounded-full md:-right-1 md:bottom-0.5"></div>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4 md:pr-6">
                            <p className="box-content caret-black shrink max-w-none min-h-0 min-w-0 text-clip normal-case text-wrap md:shrink-0 md:max-w-[140px] md:min-h-[auto] md:min-w-[140px] md:text-ellipsis md:capitalize md:text-nowrap md:overflow-hidden">
                              Nico Jeannen
                            </p>
                            <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] pr-0 md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4">
                              <span className="text-black items-center box-content caret-black gap-x-[normal] inline basis-auto grow-0 min-h-0 gap-y-[normal] text-clip text-wrap md:text-ds-textPrimary md:items-center md:aspect-auto md:gap-x-2 md:flex md:basis-[0%] md:grow md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                <span className="box-content caret-black inline min-h-0 min-w-0 text-clip text-wrap md:block md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                  I just paid for the annual plan but still see the free tier in my dashboard. Help!
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:min-h-[auto] md:min-w-[auto]">
                            <span className="text-black text-base font-normal box-content caret-black inline shrink leading-[normal] min-h-0 min-w-0 md:text-semantic-orange md:text-xs md:font-medium md:block md:shrink-0 md:leading-3">
                              12h waiting
                            </span>
                            <div className="items-center box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-1 md:flex md:justify-end md:min-h-[auto] md:min-w-[102px]">
                              <span className="text-black text-base box-content caret-black inline shrink leading-[normal] min-h-0 min-w-0 pr-0 md:text-ds-textQuaternary md:text-xs md:block md:shrink-0 md:leading-4 md:pr-2">
                                9:23 PM
                              </span>
                              <span className="bg-transparent box-content caret-black inline h-auto min-h-0 min-w-0 w-auto rounded-none md:aspect-auto md:bg-semantic-orange md:box-border md:caret-transparent md:block md:h-1.5 md:min-h-[auto] md:min-w-[auto] md:w-1.5 md:rounded-full"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-content caret-black md:aspect-auto md:box-border md:caret-transparent">
                        <div className="static text-base items-normal box-content caret-black gap-x-[normal] block leading-[normal] gap-y-[normal] rounded-none md:relative md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:leading-5 md:gap-y-3 md:p-2 md:rounded-sm">
                          <div className="static box-content caret-black min-h-0 min-w-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto]">
                            <span className="static shadow-none box-content caret-black inline shrink h-auto w-auto rounded-none md:relative md:shadow-none md:box-border md:caret-transparent md:flex md:shrink-0 md:h-8 md:w-8 md:overflow-hidden md:rounded-sm">
                              <span className="items-center box-content caret-black inline h-auto justify-normal min-h-0 min-w-0 pointer-events-auto w-auto md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:pointer-events-none md:w-full">
                                <div className="static text-black items-normal bg-transparent box-content caret-black block h-auto justify-normal min-h-0 min-w-0 w-auto md:relative md:items-center md:aspect-auto md:bg-purple-500/20 md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:w-full md:overflow-hidden">
                                  <div className="static bg-none box-content caret-black z-auto inset-auto md:absolute md:aspect-auto md:bg-gradient-to-br md:from-white/15 md:to-transparent md:box-border md:caret-transparent md:z-[1] md:inset-0"></div>
                                  <div className="static items-center box-content caret-black block flex-row justify-normal transform-none z-auto inset-auto md:absolute md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:z-[2] md:inset-0">
                                    <img
                                      src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-7.svg"
                                      alt="Icon"
                                      className="box-content caret-black w-auto md:aspect-auto md:box-border md:caret-transparent md:w-3/5"
                                    />
                                    <span className="text-base box-content caret-black inline leading-[normal] min-h-0 min-w-0 mt-0 md:text-[8.32px] md:block md:leading-[8.32px] md:mt-[8%]">
                                      D
                                    </span>
                                  </div>
                                </div>
                              </span>
                            </span>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4 md:pr-6">
                            <p className="box-content caret-black shrink max-w-none min-h-0 min-w-0 text-clip normal-case text-wrap md:shrink-0 md:max-w-[140px] md:min-h-[auto] md:min-w-[140px] md:text-ellipsis md:capitalize md:text-nowrap md:overflow-hidden">
                              Danny Postma
                            </p>
                            <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] pr-0 md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4">
                              <span className="text-black items-center box-content caret-black gap-x-[normal] inline basis-auto grow-0 min-h-0 gap-y-[normal] text-clip text-wrap md:text-ds-textCode md:items-center md:aspect-auto md:gap-x-2 md:flex md:basis-[0%] md:grow md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                <span className="box-content caret-black inline min-h-0 min-w-0 text-clip text-wrap md:block md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                  We&apos;re adding dark mode support in the next release! I&apos;ll update you when it&apos;s ready.
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:min-h-[auto] md:min-w-[auto]">
                            <div className="items-center box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-1 md:flex md:justify-end md:min-h-[auto] md:min-w-[102px]">
                              <span className="text-black text-base box-content caret-black inline shrink leading-[normal] min-h-0 min-w-0 pr-0 md:text-ds-textQuaternary md:text-xs md:block md:shrink-0 md:leading-4 md:pr-2">
                                1d
                              </span>
                              <span className="bg-transparent box-content caret-black inline h-auto min-h-0 min-w-0 opacity-100 w-auto rounded-none md:aspect-auto md:bg-semantic-orange md:box-border md:caret-transparent md:block md:h-1.5 md:min-h-[auto] md:min-w-[auto] md:opacity-0 md:w-1.5 md:rounded-full"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-content caret-black md:aspect-auto md:box-border md:caret-transparent">
                        <div className="static text-base items-normal box-content caret-black gap-x-[normal] block leading-[normal] gap-y-[normal] rounded-none md:relative md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:leading-5 md:gap-y-3 md:p-2 md:rounded-sm">
                          <div className="static box-content caret-black min-h-0 min-w-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto]">
                            <span className="static shadow-none box-content caret-black inline shrink h-auto w-auto rounded-none md:relative md:shadow-none md:box-border md:caret-transparent md:flex md:shrink-0 md:h-8 md:w-8 md:overflow-hidden md:rounded-sm">
                              <span className="items-center box-content caret-black inline h-auto justify-normal min-h-0 min-w-0 pointer-events-auto w-auto md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:pointer-events-none md:w-full">
                                <div className="static text-black items-normal bg-transparent box-content caret-black block h-auto justify-normal min-h-0 min-w-0 w-auto md:relative md:items-center md:aspect-auto md:bg-yellow-500/20 md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:w-full md:overflow-hidden">
                                  <div className="static bg-none box-content caret-black z-auto inset-auto md:absolute md:aspect-auto md:bg-gradient-to-br md:from-white/15 md:to-transparent md:box-border md:caret-transparent md:z-[1] md:inset-0"></div>
                                  <div className="static items-center box-content caret-black block flex-row justify-normal transform-none z-auto inset-auto md:absolute md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:z-[2] md:inset-0">
                                    <img
                                      src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-8.svg"
                                      alt="Icon"
                                      className="box-content caret-black w-auto md:aspect-auto md:box-border md:caret-transparent md:w-3/5"
                                    />
                                    <span className="text-base box-content caret-black inline leading-[normal] min-h-0 min-w-0 mt-0 md:text-[8.32px] md:block md:leading-[8.32px] md:mt-[8%]">
                                      T
                                    </span>
                                  </div>
                                </div>
                              </span>
                            </span>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4 md:pr-6">
                            <p className="box-content caret-black shrink max-w-none min-h-0 min-w-0 text-clip normal-case text-wrap md:shrink-0 md:max-w-[140px] md:min-h-[auto] md:min-w-[140px] md:text-ellipsis md:capitalize md:text-nowrap md:overflow-hidden">
                              Tony Dinh
                            </p>
                            <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] pr-0 md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4">
                              <span className="text-black items-center box-content caret-black gap-x-[normal] inline basis-auto grow-0 min-h-0 gap-y-[normal] text-clip text-wrap md:text-ds-textPrimary md:items-center md:aspect-auto md:gap-x-2 md:flex md:basis-[0%] md:grow md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                <span className="box-content caret-black inline min-h-0 min-w-0 text-clip text-wrap md:block md:min-h-[auto] md:min-w-[auto] md:text-ellipsis md:text-nowrap md:overflow-hidden">
                                  Perfect! Exactly what I needed. Thanks!
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:min-h-[auto] md:min-w-[auto]">
                            <span className="text-black text-base font-normal box-content caret-black inline shrink leading-[normal] min-h-0 min-w-0 md:text-semantic-orange md:text-xs md:font-medium md:block md:shrink-0 md:leading-3">
                              2d waiting
                            </span>
                            <div className="items-center box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-1 md:flex md:justify-end md:min-h-[auto] md:min-w-[102px]">
                              <span className="text-black text-base box-content caret-black inline shrink leading-[normal] min-h-0 min-w-0 pr-0 md:text-ds-textQuaternary md:text-xs md:block md:shrink-0 md:leading-4 md:pr-2">
                                2d
                              </span>
                              <span className="bg-transparent box-content caret-black inline h-auto min-h-0 min-w-0 w-auto rounded-none md:aspect-auto md:bg-semantic-orange md:box-border md:caret-transparent md:block md:h-1.5 md:min-h-[auto] md:min-w-[auto] md:w-1.5 md:rounded-full"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-content caret-black md:aspect-auto md:box-border md:caret-transparent">
                        <div className="static text-base items-normal box-content caret-black gap-x-[normal] block leading-[normal] gap-y-[normal] rounded-none md:relative md:text-sm md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-3 md:flex md:leading-5 md:gap-y-3 md:p-2 md:rounded-sm">
                          <div className="static box-content caret-black min-h-0 min-w-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto]">
                            <span className="static shadow-none box-content caret-black inline shrink h-auto w-auto rounded-none md:relative md:shadow-none md:box-border md:caret-transparent md:flex md:shrink-0 md:h-8 md:w-8 md:overflow-hidden md:rounded-sm">
                              <span className="items-center box-content caret-black inline h-auto justify-normal min-h-0 min-w-0 pointer-events-auto w-auto md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:pointer-events-none md:w-full">
                                <div className="static text-black items-normal bg-transparent box-content caret-black block h-auto justify-normal min-h-0 min-w-0 w-auto md:relative md:items-center md:aspect-auto md:bg-yellow-500/20 md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:min-h-[auto] md:min-w-[auto] md:w-full md:overflow-hidden">
                                  <div className="static bg-none box-content caret-black z-auto inset-auto md:absolute md:aspect-auto md:bg-gradient-to-br md:from-white/15 md:to-transparent md:box-border md:caret-transparent md:z-[1] md:inset-0"></div>
                                  <div className="static items-center box-content caret-black block flex-row justify-normal transform-none z-auto inset-auto md:absolute md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:z-[2] md:inset-0">
                                    <img
                                      src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-8.svg"
                                      alt="Icon"
                                      className="box-content caret-black w-auto md:aspect-auto md:box-border md:caret-transparent md:w-3/5"
                                    />
                                    <span className="text-base box-content caret-black inline leading-[normal] min-h-0 min-w-0 mt-0 md:text-[8.32px] md:block md:leading-[8.32px] md:mt-[8%]">
                                      D
                                    </span>
                                  </div>
                                </div>
                              </span>
                            </span>
                          </div>
                          <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4 md:pr-6">
                            <p className="box-content caret-black shrink max-w-none min-h-0 min-w-0 text-clip normal-case text-wrap md:shrink-0 md:max-w-[140px] md:min-h-[auto] md:min-w-[140px] md:text-ellipsis md:capitalize md:text-nowrap md:overflow-hidden">
                              Damon Chen
                            </p>
                            <div className="items-center box-content caret-black gap-x-[normal] block basis-auto grow-0 min-h-0 gap-y-[normal] pr-0 md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-4 md:flex md:basis-[0%] md:grow md:min-h-[auto] md:gap-y-4">
                              <span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
