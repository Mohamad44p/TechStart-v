import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface ProgramCardProps {
  id: string;
  backImage: string;
  programName: string;
  description: string;
}

const ProgramCard = ({
  id,
  backImage,
  programName,
  description,
}: ProgramCardProps) => {
  const { currentLang } = useLanguage();
  
  // Set apply link based on program ID
  const applyLink = id === 'cm7urp3n80015t718sk4lzm6r' 
    ? 'https://fs20.formsite.com/DAIForms/np9dh3xik0/login' 
    : 'https://fs20.formsite.com/DAIForms/smr0etmskv/login';

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-purple-100/20">
      <div className="relative w-full h-56">
        <Image
          src={backImage || "/placeholder.svg"}
          fill
          alt={programName}
          className="object-contain object-center hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      <CardContent className="px-5 pt-4 pb-2">
        <div className="w-16 h-1 bg-gradient-to-r from-[#1b316e] to-[#862996] mb-3 rounded-full"></div>
        <p className="text-base leading-relaxed min-h-[100px] line-clamp-6 text-gray-700 font-medium">
          {description || "Explore our comprehensive program designed to enhance your skills and open new opportunities in the tech industry."}
        </p>
      </CardContent>

      <CardFooter className="p-5 flex gap-3">
        <Link href={`/${currentLang}/programs/${id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full py-2.5 text-sm font-semibold text-[#1b316e] border-[#1b316e] hover:bg-[#1b316e] hover:text-white transition-all duration-300"
          >
            {currentLang === "ar" ? "اعرف المزيد" : "Learn More"}
          </Button>
        </Link>
        <Link href={applyLink}>
          <Button className="w-full py-2.5 text-sm font-semibold bg-gradient-to-r from-[#1b316e] to-[#862996] text-white hover:from-[#152554] hover:to-[#6b2178] transition-all duration-300">
            {currentLang === "ar" ? "قدم الآن" : "Apply Now"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
