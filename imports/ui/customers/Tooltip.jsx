// Tooltip.jsx
import React, { useState, useEffect } from "react";

const Tooltip = ({ children, content, position = "top" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  // 모바일은 타이머 설정
  useEffect(() => {
    let timer;
    if (showTooltip && window.innerWidth <= 768) {
      timer = setTimeout(() => {
        setShowTooltip(false);
      }, 1000);
    }
    return () => timer && clearTimeout(timer);
  }, [showTooltip]);

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative group"
        onMouseEnter={() => window.innerWidth > 768 && setShowTooltip(true)}
        onMouseLeave={() => window.innerWidth > 768 && setShowTooltip(false)}
        onClick={() => window.innerWidth <= 768 && setShowTooltip(!showTooltip)}
      >
        <div className="cursor-pointer">{children}</div>
        <div
          className={`
          absolute z-10 
          inline-block 
          bg-[#04A6B2] 
          shadow-sm 
          text-white 
          text-xs md:text-sm 
          rounded-lg 
          left-0
          bottom-[calc(100%+8px)]
          w-max
          py-1.5 px-2 md:py-2 md:px-3
          whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            showTooltip
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible translate-y-1"
          }
        `}
        >
          {content}
          <div
            className={`
            absolute 
            bottom-[-6px]
            left-[10px]
            border-solid 
            border-x-transparent 
            border-t-[#04A6B2]
            border-x-[6px] 
            border-t-[6px] 
            border-b-0
          `}
          />
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
