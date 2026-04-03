import svgPaths from "./svg-s9aj5k89tw";
import imgRectangle42 from "figma:asset/31a63f55d67c21dfc7dd601b567f5841965a32bb.png";

function LocationPin3NavigationMapMapsPinGpsLocation1() {
  return (
    <div className="relative shrink-0 size-[22.286px]" data-name="location-pin-3--navigation-map-maps-pin-gps-location">
      <div className="absolute inset-[-2.24%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.2857 23.2857">
          <g id="location-pin-3--navigation-map-maps-pin-gps-location">
            <path d={svgPaths.pe9c7970} id="Vector" stroke="var(--stroke-0, #16BDA0)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p1638e680} id="Vector_2" stroke="var(--stroke-0, #16BDA0)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p2d392000} id="Vector_3" stroke="var(--stroke-0, #16BDA0)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex items-center left-[0.86px] top-[0.86px]">
      <LocationPin3NavigationMapMapsPinGpsLocation1 />
    </div>
  );
}

function LocationPin3NavigationMapMapsPinGpsLocation() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="location-pin-3--navigation-map-maps-pin-gps-location">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#16bea1] text-[20px] tracking-[-0.8px] whitespace-nowrap">{`Accor arena paris `}</p>
    </div>
  );
}

function Lieu() {
  return (
    <div className="content-stretch flex gap-[17px] items-center relative shrink-0" data-name="LIEU">
      <LocationPin3NavigationMapMapsPinGpsLocation />
      <Frame1 />
    </div>
  );
}

function TitreAnnonce() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] inset-[19.08%_42.21%_19.08%_3.84%] items-start" data-name="TITRE ANNONCE">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[114px] justify-center leading-[0] not-italic relative shrink-0 text-[0px] text-[60px] text-white tracking-[-1.3px] w-full whitespace-pre-wrap">
        <p className="font-['Inter:Medium',sans-serif] font-medium mb-0">
          <span className="leading-[65px]">{`Disponible `}</span>
          <span className="leading-[65px] tracking-[-1.2px]">{`en `}</span>
        </p>
        <p>
          <span className="font-['Inter:Bold',sans-serif] font-bold leading-[65px] tracking-[-1.2px]">Replay</span>
          <span className="font-['Inter:Black',sans-serif] font-black leading-[65px] tracking-[-1.2px]">{` `}</span>
          <span className="font-['Inter:Medium',sans-serif] font-medium leading-[65px]">{`actuellement ! `}</span>
        </p>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[36px] leading-[normal] not-italic relative shrink-0 text-[30px] text-white tracking-[-1.2px] w-full">CONCERT LOREM IPSUM | SAM 19.09.25 |</p>
      <Lieu />
    </div>
  );
}

function Play() {
  return (
    <div className="absolute bg-white content-stretch flex inset-[0_20.59%_0_0] items-center justify-center px-[13px] py-[14px]" data-name="play">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.005] not-italic relative shrink-0 text-[15px] text-black text-center whitespace-nowrap">Voir la vidéo</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] inset-[28.9%_-0.93%_28.9%_99.07%] items-start">
      <div className="h-[26px] relative shrink-0 w-full" data-name="TOGGLE_CARRE">
        <div className="absolute bg-[#292929] inset-0">
          <div aria-hidden="true" className="absolute border border-[#de0035] border-solid inset-[-1px] pointer-events-none" />
        </div>
      </div>
      <div className="h-[26px] relative shrink-0 w-full" data-name="TOGGLE_CARRE">
        <div className="absolute bg-[#292929] inset-0" />
      </div>
      <div className="h-[26px] relative shrink-0 w-full" data-name="TOGGLE_CARRE">
        <div className="absolute bg-[#292929] inset-0" />
      </div>
      <div className="h-[26px] relative shrink-0 w-full" data-name="TOGGLE_CARRE">
        <div className="absolute bg-[#292929] inset-0" />
      </div>
    </div>
  );
}

export default function AnnonceSlider() {
  return (
    <div className="relative size-full" data-name="annonce slider">
      <div className="absolute inset-[0_2.7%_0_0] rounded-[30px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[30px] size-full" src={imgRectangle42} />
      </div>
      <div className="absolute bg-gradient-to-r from-[#03033b] from-[20.325%] inset-[0_30.6%_0_0] mix-blend-multiply opacity-72 rounded-[30px] to-[70.461%] to-[rgba(0,0,0,0)] via-[#16bda0] via-[45.393%]" data-name="filter" />
      <TitreAnnonce />
      <div className="absolute inset-[68.5%_7.84%_19.08%_81.14%]" data-name="play_btn">
        <div className="absolute inset-[25.58%_0_31.29%_89.74%]" data-name="play">
          <div className="-translate-y-1/2 absolute aspect-[44/43] bg-[#de0035] left-[-100.65%] right-[-76.13%] top-[calc(50%+1.23px)]" />
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.8974 18.5441">
            <path d={svgPaths.p3b3b0570} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
        <Play />
      </div>
      <Frame2 />
    </div>
  );
}