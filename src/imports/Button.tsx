import svgPaths from "./svg-pirafvy7od";

export default function Button({ className }: { className?: string }) {
  return (
    <div className={className || "content-stretch flex flex-col items-center justify-center py-[48px] relative w-[380px]"} data-name="Button">
      <div className="h-[66px] relative shadow-[0px_4px_4px_0px_rgba(22,190,161,0.25)] shrink-0 w-[344px]" data-name="scroll_btn">
        <div className="absolute bg-[rgba(146,128,253,0.8)] inset-[0_0_0.72%_0] rounded-[14px]" />
        <div className="absolute bg-[#cdff71] inset-[0_80.52%_0_0] rounded-[14px]" />
        <div className="absolute inset-[19.7%_84.88%_21.21%_3.78%]" data-name="suite">
          <div className="absolute contents inset-0">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 39">
              <path d={svgPaths.p1e810100} fill="var(--fill-0, #C0E67B)" id="Ellipse 2" />
            </svg>
            <div className="absolute contents inset-[32.35%_32.35%_32.35%_32.36%]" data-name="Layer 2">
              <div className="absolute inset-[32.35%_32.35%_32.35%_32.36%]" data-name="arrow-forward">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7647 13.7647">
                  <g id="arrow-forward">
                    <path d={svgPaths.p3bc3d780} fill="var(--fill-0, white)" id="Rectangle 16" opacity="0" />
                    <path d={svgPaths.p18cd5e00} fill="var(--fill-0, white)" id="Path 256" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute font-['Mulish:Bold',sans-serif] font-bold inset-[36.36%_29.94%_34.85%_29.94%] leading-[normal] text-[15px] text-white whitespace-nowrap">{`Voir le direct en streaming `}</p>
        <div className="absolute inset-[31.82%_3.49%_30.3%_89.53%]" data-name="Iconset/chevrons-right">
          <div className="absolute inset-[23.76%_19.08%_23.77%_23.75%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.3856 14.4998">
              <path d={svgPaths.p362601c0} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}