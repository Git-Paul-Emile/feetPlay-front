import svgPaths from "./svg-d4vxbhp00m";
import imgPhoto21 from "figma:asset/b082d3d913addcb568fb5df4e66d35d6ffa20c2f.png";
import imgImg from "figma:asset/bee3bed7c94db9670639d35f9e74847d66693142.png";

function ArrowForward() {
  return (
    <div className="absolute inset-[32.35%_32.35%_32.35%_32.36%]" data-name="arrow-forward">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7647 13.7647">
        <g id="arrow-forward">
          <path d={svgPaths.p3bc3d780} fill="var(--fill-0, white)" id="Rectangle 16" opacity="0" />
          <path d={svgPaths.p18cd5e00} fill="var(--fill-0, white)" id="Path 256" />
        </g>
      </svg>
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute contents inset-[32.35%_32.35%_32.35%_32.36%]" data-name="Layer 2">
      <ArrowForward />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-0">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 39">
        <path d={svgPaths.p1e810100} fill="var(--fill-0, #C0E67B)" id="Ellipse 2" />
      </svg>
      <Layer />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[550px] py-[48px] top-[984px] w-[380px]" data-name="Button">
      <div className="h-[66px] relative shadow-[0px_4px_4px_0px_rgba(22,190,161,0.25)] shrink-0 w-[344px]" data-name="scroll_btn">
        <div className="absolute bg-[rgba(146,128,253,0.8)] inset-[0_0_0.72%_0] rounded-[14px]" />
        <div className="absolute bg-[#cdff71] inset-[0_80.52%_0_0] rounded-[14px]" />
        <div className="absolute inset-[19.7%_84.88%_21.21%_3.78%]" data-name="suite">
          <Group5 />
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

function Delete1RemoveAddButtonButtonsDeleteCrossXMathematicsMultiplyMath() {
  return (
    <div className="absolute inset-[16.67%]" data-name="delete-1--remove-add-button-buttons-delete-cross-x-mathematics-multiply-math">
      <div className="absolute inset-[-6.82%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
          <g id="delete-1--remove-add-button-buttons-delete-cross-x-mathematics-multiply-math">
            <path d="M15.6667 1L1 15.6667" id="Vector" stroke="var(--stroke-0, #D9D9D9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M1 1L15.6667 15.6667" id="Vector_2" stroke="var(--stroke-0, #D9D9D9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[1582.47px] top-[209.62px]">
      <div className="absolute backdrop-blur-[5px] content-stretch flex items-center justify-center left-[1582.47px] p-[8px] rounded-[28px] size-[60.125px] top-[209.62px]" data-name="CLOSE-2" style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}>
        <div className="overflow-clip relative shrink-0 size-[22px]" data-name="delete-1--remove-add-button-buttons-delete-cross-x-mathematics-multiply-math">
          <Delete1RemoveAddButtonButtonsDeleteCrossXMathematicsMultiplyMath />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute backdrop-blur-[50px] bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col h-[651px] items-center left-[189px] px-[20px] py-[24px] rounded-[12px] top-[320px] w-[491px]" data-name="Container">
      <div className="h-[605px] relative rounded-[8px] shrink-0 w-[444px]" data-name="img">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImg} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute contents left-[-37px] top-[148px]" data-name="Header">
      <div className="absolute h-[1057px] left-[-37px] top-[148px] w-[1725px]" data-name="photo2 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-0.72%] max-w-none top-0 w-[101.36%]" src={imgPhoto21} />
        </div>
      </div>
      <div className="absolute bg-black h-[1057px] left-[-37px] opacity-70 top-[148px] w-[1725px]" />
      <Button />
      <Group12 />
      <Container />
    </div>
  );
}

function FooterBar() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[89px] items-center justify-center leading-[1.4] left-1/2 not-italic p-[60px] text-[24px] text-white top-[15px] w-[1518px]" data-name="Footer bar">
      <p className="opacity-60 relative shrink-0 w-[58px]">GCU</p>
      <p className="opacity-60 relative shrink-0 w-[314px]">Politique de confidentialites</p>
      <p className="opacity-60 relative shrink-0 w-[235px]">{`Termes & Conditions`}</p>
      <p className="opacity-60 relative shrink-0 w-[169px]">Besoin d’aide ?</p>
      <p className="opacity-60 relative shrink-0 w-[191px]">Nous connaitre</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute bg-[#161212] h-[184px] left-[-28px] overflow-clip top-[1204px] w-[1518px]">
      <FooterBar />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0_0_0_73.81%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.859 39">
        <g id="Group">
          <path d={svgPaths.p142ece80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p28ea7700} fill="var(--fill-0, #811AEC)" id="Vector_2" />
          <path d={svgPaths.p34f09600} fill="var(--fill-0, #F1C519)" id="Vector_3" />
          <path d={svgPaths.p261cd780} fill="var(--fill-0, #E43962)" id="Vector_4" />
          <path d={svgPaths.p3768dd00} fill="var(--fill-0, #16BDA0)" id="Vector_5" />
          <path d={svgPaths.p5a83700} fill="var(--fill-0, #811AEC)" id="Vector_6" />
          <path d={svgPaths.p1116dfc0} fill="var(--fill-0, #F1C519)" id="Vector_7" />
          <path d={svgPaths.p3f6ce800} fill="var(--fill-0, #E43962)" id="Vector_8" />
          <path d={svgPaths.p206aab00} fill="var(--fill-0, #16BDA0)" id="Vector_9" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.01%_28.1%_8.01%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112.165 32.754">
        <g id="Group">
          <path d={svgPaths.p2d591880} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p3aaf32c0} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p87ab6f0} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p20a2e100} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p66cf900} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Navlink() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="navlink">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[28px] text-white whitespace-nowrap">Acceuil</p>
    </div>
  );
}

function Navlink1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="navlink">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[28px] text-white whitespace-nowrap">En Live</p>
    </div>
  );
}

function NavlinkDropdown() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="navlink_dropdown">
      <Navlink1 />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon pack">
        <div className="absolute inset-[32.98%_20.83%_37.14%_20.83%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0016 7.17314">
            <path d={svgPaths.p1cb8b070} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Navlink2() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0" data-name="navlink">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[28px] text-white whitespace-nowrap">Replay</p>
    </div>
  );
}

function NavlinkDropdown1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="navlink_dropdown">
      <Navlink2 />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon pack">
        <div className="absolute inset-[32.98%_20.83%_37.14%_20.83%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0016 7.17314">
            <path d={svgPaths.p1cb8b070} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Navlink3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="navlink">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[28px] text-white whitespace-nowrap">Chaines</p>
    </div>
  );
}

function Navlink4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="navlink">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[28px] text-white whitespace-nowrap">Agenda</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[28px] items-center relative shrink-0">
      <Navlink />
      <NavlinkDropdown />
      <NavlinkDropdown1 />
      <Navlink3 />
      <Navlink4 />
    </div>
  );
}

function TriangleFlagNavigationMapMapsFlagGpsLocationDestinationGoal() {
  return (
    <div className="absolute inset-[3.57%_17.86%]" data-name="triangle-flag--navigation-map-maps-flag-gps-location-destination-goal">
      <div className="absolute inset-[-2.24%_-3.24%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.4287 23.2858">
          <g id="triangle-flag--navigation-map-maps-flag-gps-location-destination-goal">
            <path d="M0.50011 0.50011V22.7858" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.pd909fc0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icone() {
  return (
    <div className="content-stretch flex gap-[19px] items-center relative shrink-0" data-name="icone">
      <div className="relative shrink-0 size-[48px]" data-name="Component 1">
        <div className="absolute backdrop-blur-[5px] inset-0 rounded-[28px]" data-name="Btn1" style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }} />
        <div className="absolute aspect-[9/12.000117301940918] left-[33.33%] right-[33.33%] top-[13px]">
          <div className="absolute inset-[0_22.22%_58.33%_22.22%]" data-name="Vector">
            <div className="absolute inset-[-8.57%_-8.44%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3888 10.2499">
                <path d={svgPaths.p23740d80} id="Vector" stroke="var(--stroke-0, #00DE6B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[54.17%_0_4.13%_0]" data-name="Vector_2">
            <div className="absolute inset-[-8.56%_-4.69%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4999 10.2587">
                <path d={svgPaths.p398fea00} id="Vector_2" stroke="var(--stroke-0, #00DE6B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 size-[48px]" data-name="btn2">
        <div className="absolute backdrop-blur-[5px] inset-0 rounded-[28px]" data-name="Btn1" style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }} />
        <div className="absolute aspect-[14/14] left-1/4 overflow-clip right-1/4 top-[12px]" data-name="triangle-flag--navigation-map-maps-flag-gps-location-destination-goal">
          <TriangleFlagNavigationMapMapsFlagGpsLocationDestinationGoal />
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute content-stretch flex h-[90px] items-center justify-between left-[-37px] px-[75px] py-[24px] top-[24px] w-[1512px]" data-name="Navbar">
      <div className="h-[39px] relative shrink-0 w-[156px]" data-name="logo">
        <Group />
        <Group1 />
      </div>
      <Frame />
      <Icone />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[-37px] top-0">
      <div className="absolute backdrop-blur-[21px] inset-[0_-4.38%_87.15%_-2.57%] opacity-80 rounded-[20px]" style={{ backgroundImage: "linear-gradient(164.621deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 110.84%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.7)] border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      </div>
      <Navbar />
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <p className="col-1 font-['Poppins:SemiBold',sans-serif] h-[24.863px] leading-[normal] ml-[9px] mt-[2.07px] not-italic relative row-1 text-[16px] text-white w-[108px]">Supernatural</p>
      <div className="bg-[rgba(217,217,217,0)] border border-solid border-white col-1 h-[27.97px] ml-0 mt-0 row-1 w-[126px]" />
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <p className="col-1 font-['Poppins:SemiBold',sans-serif] h-[24.863px] leading-[normal] ml-[9px] mt-[2.07px] not-italic relative row-1 text-[16px] text-white w-[53px]">Action</p>
      <div className="bg-[rgba(217,217,217,0)] border border-solid border-white col-1 h-[27.97px] ml-0 mt-0 row-1 w-[70px]" />
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <p className="col-1 font-['Poppins:SemiBold',sans-serif] h-[24.863px] leading-[normal] ml-[9px] mt-[2.07px] not-italic relative row-1 text-[16px] text-white w-[79px]">Romance</p>
      <div className="bg-[rgba(217,217,217,0)] border border-solid border-white col-1 h-[27.97px] ml-0 mt-0 row-1 w-[94px]" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="col-1 content-stretch flex gap-[24px] items-center ml-[5px] mt-[58px] relative row-1">
      <Group2 />
      <Group3 />
      <Group4 />
    </div>
  );
}

function SlliderDesc() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Sllider-Desc">
      <p className="col-1 font-['DM_Sans:Bold',sans-serif] font-bold h-[38px] leading-[1.25] ml-0 mt-0 relative row-1 text-[#fcc434] text-[38px] w-[539px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Dadju- concert Montreal
      </p>
      <Frame4 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="h-[23px] relative shrink-0 w-[19px]" data-name="Icon">
        <div className="absolute inset-[-2.17%_-2.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 24">
            <g id="Icon">
              <path d={svgPaths.p3b8f8100} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
              <path d={svgPaths.p3698bff0} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#dedede] text-[20px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[18px]">Salle Savorgnon Debrazza</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col h-[23px] items-start relative shrink-0 w-[324px]">
      <Frame2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[539px]">
      <SlliderDesc />
      <Frame1 />
    </div>
  );
}

function MovieOnTicket() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[539px]" data-name="Movie-on-ticket">
      <Frame5 />
    </div>
  );
}

function Group9() {
  return (
    <div className="col-1 font-['Inter:Medium',sans-serif] font-medium grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[18px] ml-0 mt-0 not-italic place-items-start relative row-1">
      <p className="col-1 ml-0 mt-0 relative row-1 text-[15px] text-[rgba(255,255,255,0.6)] w-[64.67px]">Date</p>
      <p className="col-1 ml-0 mt-[26px] relative row-1 text-[20px] text-[rgba(255,255,255,0.85)] w-[129.34px]">20 Nov</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="col-1 font-['Inter:Medium',sans-serif] font-medium grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[18px] ml-[193.39px] mt-0 not-italic place-items-start relative row-1">
      <p className="col-1 ml-0 mt-0 relative row-1 text-[15px] text-[rgba(255,255,255,0.6)] w-[102.482px]">Heure</p>
      <p className="col-1 ml-[0.62px] mt-[26px] relative row-1 text-[20px] text-[rgba(255,255,255,0.85)] w-[101.047px]">15:05</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="col-1 font-['Inter:Medium',sans-serif] font-medium grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[18px] ml-[391.31px] mt-0 not-italic place-items-start relative row-1">
      <p className="col-1 ml-0 mt-0 relative row-1 text-[15px] text-[rgba(255,255,255,0.6)] w-[121.363px]">Référence</p>
      <p className="col-1 ml-0 mt-[26px] relative row-1 text-[20px] text-[rgba(255,255,255,0.85)] w-[170.693px]">F25L11-30</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
      <Group9 />
      <Group8 />
      <div className="col-1 flex h-[53px] items-center justify-center ml-[161.68px] mt-0 relative row-1 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[53px]">
            <div className="absolute inset-[-0.3px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53 0.3">
                <line id="Line 8" stroke="var(--stroke-0, white)" strokeWidth="0.3" x2="53" y1="0.15" y2="0.15" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Group7 />
      <div className="col-1 flex h-[53px] items-center justify-center ml-[327.39px] mt-0 relative row-1 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[53px]">
            <div className="absolute inset-[-0.3px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53 0.3">
                <line id="Line 9" stroke="var(--stroke-0, white)" strokeWidth="0.3" x2="53" y1="0.15" y2="0.15" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[22.933px] ml-0 mt-0 not-italic relative row-1 text-[#cdff71] text-[16px] tracking-[-0.48px] w-[562px]">Vos informations utilisateur</p>
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="div">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#95989d] text-[14px] tracking-[-0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`Nom & Prénom : `}</p>
    </div>
  );
}

function EmailSelector() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="Email-selector">
      <div aria-hidden="true" className="absolute border border-[#62656a] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Div />
        </div>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="div">
      <div className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#95989d] text-[14px] tracking-[-0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-0">Votre adresse Email :</p>
        <p>ph******102@gmail.com</p>
      </div>
    </div>
  );
}

function EmailSelector1() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="Email-selector">
      <div aria-hidden="true" className="absolute border border-[#62656a] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Div1 />
        </div>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="div">
      <div className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#95989d] text-[14px] tracking-[-0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-0">Votre numéro de telephone :</p>
        <p>+242 06 654 00 00 00</p>
      </div>
    </div>
  );
}

function TelephoneSelector() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="Téléphone-selector">
      <div aria-hidden="true" className="absolute border border-[#62656a] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Div2 />
        </div>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="div">
      <div className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#95989d] text-[14px] tracking-[-0.14px] whitespace-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-0">{`Ville: `}</p>
        <p>{`Brazzaville - Congo `}</p>
      </div>
    </div>
  );
}

function TelephoneSelector1() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="Téléphone-selector">
      <div aria-hidden="true" className="absolute border border-[#62656a] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Div3 />
        </div>
      </div>
    </div>
  );
}

function FieldsUser() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Fields - user">
      <Group6 />
      <EmailSelector />
      <EmailSelector1 />
      <TelephoneSelector />
      <TelephoneSelector1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="backdrop-blur-[50px] bg-[rgba(255,255,255,0.1)] h-[651px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[20px] py-[24px] relative size-full">
        <MovieOnTicket />
        <Group10 />
        <div className="h-0 relative shrink-0 w-full" data-name="Divider">
          <div className="absolute inset-[-0.5px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 562 0.5">
              <line id="Divider" stroke="var(--stroke-0, #95989D)" strokeWidth="0.5" x2="562" y1="0.25" y2="0.25" />
            </svg>
          </div>
        </div>
        <FieldsUser />
      </div>
    </div>
  );
}

function Summary() {
  return (
    <div className="content-stretch flex flex-col h-[682px] items-start pb-[12px] pl-[24px] pt-[31px] relative shrink-0 w-[626px]" data-name="Summary">
      <Container1 />
    </div>
  );
}

function MainFreeStreaming() {
  return (
    <div className="absolute content-stretch flex flex-col h-[694px] items-center left-[715px] py-[12px] top-[273px] w-[562px]" data-name="Main-free_streaming">
      <Summary />
    </div>
  );
}

export default function EventAchat() {
  return (
    <div className="bg-black relative size-full" data-name="EVENT-ACHAT">
      <Header />
      <Frame3 />
      <Group11 />
      <MainFreeStreaming />
    </div>
  );
}