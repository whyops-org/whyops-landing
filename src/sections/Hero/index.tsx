import { HeroContent } from "@/sections/Hero/components/HeroContent";
import { HeroPreview } from "@/sections/Hero/components/HeroPreview";

export const Hero = () => {
  return (
    <div className="box-border caret-transparent gap-x-8 flex flex-col min-h-0 gap-y-8 pt-32 md:flex-row md:min-h-[1000px]">
      <div className="box-border caret-transparent gap-x-6 flex basis-[0%] flex-col grow gap-y-6">
        <HeroContent />
        <HeroPreview imagePath="/assets/HERO.webp"/>
      </div>
    </div>
  );
};
