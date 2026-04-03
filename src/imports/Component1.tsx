import svgPaths from "./svg-2f5i9mgwjd";

export default function Component() {
  return (
    <div className="relative size-full" data-name="Component 1">
      <div className="absolute backdrop-blur-[5px] inset-0 rounded-[28px]" data-name="Btn1" style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }} />
      <div className="absolute aspect-[9/12.000117301940918] left-[33.33%] right-[33.33%] top-[13px]">
        <div className="absolute inset-[0_22.22%_58.33%_22.22%]" data-name="Vector">
          <div className="absolute inset-[-8.57%_-8.44%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3888 10.2499">
              <path d={svgPaths.p23740d80} id="Vector" stroke="var(--stroke-0, #CDFF71)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[54.17%_0_4.13%_0]" data-name="Vector_2">
          <div className="absolute inset-[-8.56%_-4.69%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4999 10.2587">
              <path d={svgPaths.p398fea00} id="Vector_2" stroke="var(--stroke-0, #CDFF71)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}