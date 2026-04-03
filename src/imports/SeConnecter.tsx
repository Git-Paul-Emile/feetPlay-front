import svgPaths from "./svg-j2ci8clz7t";
import imgCardImg from "figma:asset/bfa6be3c8aeb7f6fbc82814faf0255da53e42d8a.png";
import imgCardImg1 from "figma:asset/441c73cde7747c7424dd532b5b0bf39c965feea3.png";
import imgCardImg2 from "figma:asset/eeb54bfeb7f715a11c3f77fa7d5f1a847fc8360e.png";
import imgCardImg3 from "figma:asset/879e9dd2c894a941eb3593ea43d7255c4e45bef8.png";
import imgCardImg4 from "figma:asset/47894590a720b34953c1f32b52b442f91508500b.png";

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[80px]">
      <div className="bg-[rgba(29,29,29,0.5)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[56px] shrink-0" data-name="Tag">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99feff] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Comedy
        </p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[calc(100%+928px)] top-[907px]">
      <div className="absolute flex inset-[907px_-1237px_338px_calc(100%+928px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[309px]">
          <div className="relative size-full" data-name="card-img">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[105%] left-[-0.65%] max-w-none top-[-2.5%] w-[101.61%]" src={imgCardImg} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[907px_-1237px_338px_calc(100%+928px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[309px]">
          <div className="bg-gradient-to-b from-[15.778%] from-[rgba(29,29,29,0)] size-full to-[rgba(29,29,29,0.78)]" data-name="overlay" />
        </div>
      </div>
      <div className="absolute h-[76px] left-[calc(100%+976.84px)] top-[2552px] w-[208.326px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[20px] text-white top-0 w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Thunder Force
        </p>
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[15px] text-white top-[40px] w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          20 April
        </p>
        <Frame1 />
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[calc(100%+928px)] top-[907px]">
      <Group6 />
      <div className="absolute flex inset-[907px_-1237px_338px_calc(100%+928px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[309px]">
          <div className="relative size-full" data-name="card-img">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[102.89%] left-[0.05%] max-w-none top-[-2.89%] w-[99.89%]" src={imgCardImg1} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[907px_-1237px_337px_calc(100%+928px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[176px] w-[309px]">
          <div className="bg-gradient-to-b from-[15.778%] from-[rgba(29,29,29,0)] size-full to-[rgba(29,29,29,0.78)]" data-name="overlay" />
        </div>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[calc(100%+928px)] top-[907px]">
      <Group7 />
      <div className="absolute h-[34.5px] left-[calc(100%+1198px)] top-[2233px] w-[25px]">
        <div className="absolute inset-[-2.9%_-4%_-8.05%_-4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 38.2768">
            <path d={svgPaths.p2809ef80} id="Vector 14" stroke="var(--stroke-0, #CC3333)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[80px]">
      <div className="bg-[rgba(29,29,29,0.5)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[56px] shrink-0" data-name="Tag">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99feff] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Comedy
        </p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[calc(100%+928px)] top-[907px]">
      <Group8 />
      <div className="absolute h-[92px] left-[calc(100%+968px)] top-[2552px] w-[209px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[20px] text-white top-0 w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Tom & Jerry`}</p>
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[15px] text-white top-[40px] w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          20 April
        </p>
        <Frame2 />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[80px]">
      <div className="bg-[rgba(29,29,29,0.5)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[56px] shrink-0" data-name="Tag">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99feff] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Family
        </p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[907px_-1572px_338px_calc(100%+1262px)]">
      <div className="absolute flex inset-[907px_-1572px_338px_calc(100%+1262px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[310px]">
          <div className="bg-gradient-to-b from-[15.778%] from-[rgba(29,29,29,0)] size-full to-[rgba(29,29,29,0.78)]" data-name="overlay" />
        </div>
      </div>
      <div className="absolute flex inset-[907px_-1572px_338px_calc(100%+1262px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[310px]">
          <div className="relative size-full" data-name="card-img">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[108.44%] left-[-1.9%] max-w-none top-[-5.78%] w-[105.1%]" src={imgCardImg3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[80px]">
      <div className="bg-[rgba(29,29,29,0.5)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[56px] shrink-0" data-name="Tag">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99feff] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Fantasy
        </p>
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[calc(100%+1262px)] top-[907px]">
      <div className="absolute flex inset-[907px_-1571px_338px_calc(100%+1262px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[309px]">
          <div className="relative size-full" data-name="card-img">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[106.36%] left-[-1.21%] max-w-none top-[-5.11%] w-[103.26%]" src={imgCardImg2} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[907px_-1572px_338px_calc(100%+1262px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[310px]">
          <div className="bg-gradient-to-b from-[15.778%] from-[rgba(29,29,29,0)] size-full to-[rgba(29,29,29,0.78)]" data-name="overlay" />
        </div>
      </div>
      <div className="absolute h-[76px] left-[calc(100%+1308px)] top-[2512px] w-[209px]">
        <div className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[20px] text-white top-0 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="mb-0">Peter Rabbit 2: The</p>
          <p>Runaway</p>
        </div>
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[15px] text-white top-[40px] w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          20 April
        </p>
        <Frame3 />
      </div>
      <Group5 />
      <div className="absolute flex inset-[907px_-1572px_338px_calc(100%+1262px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[310px]">
          <div className="bg-gradient-to-b from-[15.778%] from-[rgba(29,29,29,0)] size-full to-[rgba(29,29,29,0.78)]" data-name="overlay" />
        </div>
      </div>
      <div className="absolute h-[76px] left-[calc(100%+1296px)] top-[2512px] w-[209px]">
        <div className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[20px] text-white top-0 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="mb-0">Zack Snyder’s Justice</p>
          <p>{`League `}</p>
        </div>
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[15px] text-white top-[40px] w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          20 April
        </p>
        <Frame4 />
      </div>
      <div className="absolute h-[34.5px] left-[calc(100%+1532px)] top-[2233px] w-[25px]">
        <div className="absolute inset-[-2.9%_-4%_-8.05%_-4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 38.2768">
            <path d={svgPaths.p2809ef80} id="Vector 14" stroke="var(--stroke-0, #CC3333)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[80px]">
      <div className="bg-[rgba(29,29,29,0.5)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[56px] shrink-0" data-name="Tag">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99feff] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Fantasy
        </p>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[calc(100%+1597px)] top-[907px]">
      <div className="absolute flex inset-[907px_-1906px_338px_calc(100%+1597px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[309px]">
          <div className="relative size-full" data-name="card-img">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[107.56%] left-[-2.37%] max-w-none top-[-1.11%] w-[104.42%]" src={imgCardImg4} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[907px_-1906px_338px_calc(100%+1597px)] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[175px] w-[309px]">
          <div className="bg-gradient-to-b from-[15.778%] from-[rgba(29,29,29,0)] size-full to-[rgba(29,29,29,0.78)]" data-name="overlay" />
        </div>
      </div>
      <div className="absolute h-[76px] left-[calc(100%+1643px)] top-[2552px] w-[209px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[20px] text-white top-0 w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Mortal Kombat
        </p>
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[40px] left-0 text-[15px] text-white top-[40px] w-[209px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          20 April
        </p>
        <Frame5 />
      </div>
      <div className="absolute h-[31.5px] left-[calc(100%+1860px)] top-[2233px] w-[25px]">
        <div className="absolute inset-[-3.17%_-4%_-8.23%_-4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 35.0923">
            <path d={svgPaths.p153ad700} id="Vector 10" stroke="var(--stroke-0, #CC3333)" strokeWidth="2" />
          </svg>
        </div>
      </div>
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
    <div className="absolute content-stretch flex h-[90px] items-center justify-between left-[-10px] px-[75px] py-[24px] top-[24px] w-[1512px]" data-name="Navbar">
      <div className="h-[39px] relative shrink-0 w-[156px]" data-name="logo">
        <Group />
        <Group1 />
      </div>
      <Frame />
      <Icone />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents left-[-10px] top-0">
      <div className="absolute backdrop-blur-[21px] inset-[0_-1.19%_89.67%_-0.66%] opacity-80 rounded-[20px]" style={{ backgroundImage: "linear-gradient(167.249deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 110.84%)" }}>
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.7)] border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      </div>
      <Navbar />
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

function Frame6() {
  return (
    <div className="absolute bg-[#161212] h-[184px] left-[-3px] overflow-clip top-[1236px] w-[1518px]">
      <FooterBar />
    </div>
  );
}

function ProgressionBar() {
  return (
    <div className="-translate-x-1/2 absolute h-0 left-1/2 top-[90px] w-[300px]" data-name="Progression bar">
      <div className="absolute inset-[-6px_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 300 6">
          <g id="Progression bar">
            <line id="progress bar" stroke="var(--stroke-0, #F4F6F4)" strokeLinecap="round" strokeWidth="6" x1="3" x2="297" y1="3" y2="3" />
            <line id="progression" stroke="var(--stroke-0, #C0A9ED)" strokeLinecap="round" strokeWidth="6" x1="3" x2="97" y1="3" y2="3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MailSendEnvelopeEnvelopeEmailMessageUnopenedSealedClose() {
  return (
    <div className="absolute inset-[12.5%_3.57%]" data-name="mail-send-envelope--envelope-email-message-unopened-sealed-close">
      <div className="absolute inset-[-4.17%_-3.37%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.7859 19.5">
          <g id="mail-send-envelope--envelope-email-message-unopened-sealed-close">
            <path d={svgPaths.p21630c80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2287f3e0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function PadlockSquare1CombinationComboLockLockedPadlockSecureSecurityShieldKeyhole() {
  return (
    <div className="absolute inset-[3.57%_14.29%]" data-name="padlock-square-1--combination-combo-lock-locked-padlock-secure-security-shield-keyhole">
      <div className="absolute inset-[-3.37%_-4.37%_-3.37%_-4.38%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.6429 23.7857">
          <g id="padlock-square-1--combination-combo-lock-locked-padlock-secure-security-shield-keyhole">
            <path d={svgPaths.p3addb900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3c3e9c80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pfbf3c00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Visibility() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="visibility">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="visibility">
          <mask height="24" id="mask0_8_4716" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
            <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
          </mask>
          <g mask="url(#mask0_8_4716)">
            <path d={svgPaths.p36ad4180} fill="var(--fill-0, #898787)" id="visibility_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[18px] leading-[normal] not-italic relative shrink-0 text-[#adb3bc] text-[12px] text-center tracking-[-0.48px] w-[152px]">{`Vous n’avez pas compte ? `}</p>
      <div className="h-[22px] relative shrink-0 w-[62px]" data-name="link-login">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold inset-[0_0_18.18%_0] leading-[normal] not-italic text-[12px] text-[red] tracking-[-0.48px]">S’inscrire</p>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-end justify-center relative shrink-0 w-full" data-name="List">
      <button className="cursor-pointer h-[62px] relative rounded-[43px] shrink-0 w-full" data-name="Mail">
        <div aria-hidden="true" className="absolute border border-[#cdff71] border-solid inset-0 pointer-events-none rounded-[43px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[10px] items-center px-[20px] py-[33px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="mail-send-envelope--envelope-email-message-unopened-sealed-close">
              <MailSendEnvelopeEnvelopeEmailMessageUnopenedSealedClose />
            </div>
            <div className="flex h-[34px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "90", "--transform-inner-height": "16" } as React.CSSProperties}>
              <div className="flex-none rotate-90">
                <div className="h-0 relative w-[34px]">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 1">
                      <line id="Line 5" stroke="var(--stroke-0, #C0A9ED)" strokeOpacity="0.5" x2="34" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[normal] not-italic relative shrink-0 text-[#adb3bc] text-[18px] text-left tracking-[-0.72px] w-[220px]">Adresse E-mail</p>
          </div>
        </div>
      </button>
      <div className="h-[62px] relative rounded-[43px] shrink-0 w-[390px]" data-name="Mdp">
        <div aria-hidden="true" className="absolute border border-[#cdff71] border-solid inset-0 pointer-events-none rounded-[43px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[10px] items-center px-[20px] py-[33px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="padlock-square-1--combination-combo-lock-locked-padlock-secure-security-shield-keyhole">
              <PadlockSquare1CombinationComboLockLockedPadlockSecureSecurityShieldKeyhole />
            </div>
            <div className="flex h-[34px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
              <div className="flex-none rotate-90">
                <div className="h-0 relative w-[34px]">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 1">
                      <line id="Line 5" stroke="var(--stroke-0, #C0A9ED)" strokeOpacity="0.5" x2="34" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[normal] not-italic relative shrink-0 text-[#adb3bc] text-[18px] tracking-[-0.72px] w-[273px]">Mot de passe</p>
            <Visibility />
          </div>
        </div>
      </div>
      <Frame7 />
    </div>
  );
}

function Inscription() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[20px] top-[182px] w-[390px]" data-name="Inscription">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[22.933px] not-italic relative shrink-0 text-[20px] text-white tracking-[-0.6px] w-full">Entre tes identifiants de connexion</p>
      <List />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents left-[20px] top-[182px]">
      <Inscription />
    </div>
  );
}

function Button() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center justify-center left-1/2 py-[48px] top-[424px] w-[430px]" data-name="Button">
      <div className="bg-[#cdff71] content-stretch flex items-center justify-center px-[10px] py-[20px] relative rounded-[43px] shrink-0 w-[390px]" data-name="se connecter">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] text-black text-center tracking-[-0.72px] whitespace-nowrap">Se connecter</p>
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[normal] not-italic place-items-start relative shrink-0 text-[20px]">
      <p className="col-1 font-['Inter:Extra_Bold',sans-serif] font-extrabold ml-[79px] mt-0 relative row-1 text-[rgba(255,255,255,0.5)] whitespace-nowrap">Ou</p>
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium ml-0 mt-[49px] relative row-1 text-white w-[187px]">{`Se connecter avec `}</p>
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute inset-1/4" data-name="Logo">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="Logo">
          <path d={svgPaths.p3dd3e100} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[17.5%_19.15%_17.5%_17.15%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.48 26">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p11edb380} fill="var(--fill-0, #4285F4)" fillRule="evenodd" id="Shape" />
          <path clipRule="evenodd" d={svgPaths.p1355f600} fill="var(--fill-0, #34A853)" fillRule="evenodd" id="Shape_2" />
          <path clipRule="evenodd" d={svgPaths.p391add00} fill="var(--fill-0, #FBBC05)" fillRule="evenodd" id="Shape_3" />
          <path clipRule="evenodd" d={svgPaths.p3a217e00} fill="var(--fill-0, #EA4335)" fillRule="evenodd" id="Shape_4" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#0f1419] col-1 ml-[128px] mt-0 relative rounded-[156249.844px] row-1 size-[42px]" data-name="TwitterX">
        <Logo />
      </div>
      <div className="bg-[#1877f2] col-1 ml-0 mt-px overflow-clip relative rounded-[400px] row-1 size-[40px]" data-name="Facebook">
        <div className="absolute inset-[19.53%_27.73%_0_29.49%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1094 32.1875">
            <path d={svgPaths.p18fd5af0} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="bg-white col-1 ml-[64px] mt-px overflow-clip relative rounded-[400px] row-1 size-[40px]" data-name="Google">
        <Group2 />
      </div>
    </div>
  );
}

function List1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[24px] items-center left-1/2 top-[582px] w-[170px]" data-name="List">
      <Group13 />
      <Group12 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[0_0_0_73.81%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52.9071 51">
        <g id="Group">
          <path d={svgPaths.p33497460} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p3902e700} fill="var(--fill-0, #811AEC)" id="Vector_2" />
          <path d={svgPaths.pc740a00} fill="var(--fill-0, #F1C519)" id="Vector_3" />
          <path d={svgPaths.p16135700} fill="var(--fill-0, #E43962)" id="Vector_4" />
          <path d={svgPaths.pf246570} fill="var(--fill-0, #16BDA0)" id="Vector_5" />
          <path d={svgPaths.p14efc100} fill="var(--fill-0, #811AEC)" id="Vector_6" />
          <path d={svgPaths.pd5a5e80} fill="var(--fill-0, #F1C519)" id="Vector_7" />
          <path d={svgPaths.p281e7500} fill="var(--fill-0, #E43962)" id="Vector_8" />
          <path d={svgPaths.p33073080} fill="var(--fill-0, #16BDA0)" id="Vector_9" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[8.01%_28.1%_8.01%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 145.24 42.8321">
        <g id="Group">
          <path d={svgPaths.pe866b00} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p32e8b280} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p2e82e380} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p14b6cc00} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p3460f980} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
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

function Group16() {
  return (
    <div className="absolute contents left-[calc(91.67%-7px)] top-[195px]">
      <div className="absolute backdrop-blur-[5px] content-stretch flex items-center justify-center left-[calc(91.67%-7px)] p-[8px] rounded-[28px] size-[48px] top-[195px]" data-name="CLOSE-2" style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}>
        <div className="overflow-clip relative shrink-0 size-[22px]" data-name="delete-1--remove-add-button-buttons-delete-cross-x-mathematics-multiply-math">
          <Delete1RemoveAddButtonButtonsDeleteCrossXMathematicsMultiplyMath />
        </div>
      </div>
    </div>
  );
}

export default function SeConnecter() {
  return (
    <div className="bg-black relative size-full" data-name="Se connecter">
      <Group9 />
      <Group10 />
      <Group11 />
      <div className="absolute h-[34.5px] left-[calc(100%+864px)] top-[2233px] w-[25px]">
        <div className="absolute inset-[-2.9%_-4%_-8.05%_-4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 38.2768">
            <path d={svgPaths.p2809ef80} id="Vector 14" stroke="var(--stroke-0, #CC3333)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Group15 />
      <Frame6 />
      <div className="absolute bg-[#f3f2f8] h-[763px] left-[calc(33.33%+98px)] overflow-clip top-[410px] w-[430px]" data-name="login">
        <div className="absolute bg-black h-[932px] left-0 overflow-clip top-0 w-[430px]" data-name="Signup screens">
          <ProgressionBar />
        </div>
        <div className="-translate-x-1/2 absolute bottom-[87.88%] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-1/2 not-italic text-[36px] text-center text-white top-[5.79%] tracking-[-2.16px] w-[430px]">
          <p className="leading-[41px]">Se connecter</p>
        </div>
        <Group14 />
        <Button />
        <List1 />
      </div>
      <div className="absolute h-[51px] left-[calc(41.67%+86px)] top-[297px] w-[202px]" data-name="logo">
        <Group3 />
        <Group4 />
      </div>
      <Group16 />
    </div>
  );
}