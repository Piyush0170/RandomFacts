import { useState } from "react";
import { FactDisplay } from "@/components/FactDisplay";
import { SearchBox } from "@/components/SearchBox";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const defaultFacts = [
  "The Great Wall of China is not visible from space with the naked eye.",
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
  "A day on Venus is longer than its year. It takes Venus 243 Earth days to rotate on its axis but only 225 Earth days to orbit the Sun.",
];

export default function Home() {
  const [facts, setFacts] = useState(defaultFacts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % facts.length);
    setSearchResult(null);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
    setSearchResult(null);
  };

  const handleSearch = (result: string) => {
    setSearchResult(result);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-center">Random Facts</h1>
          
          <SearchBox onSearch={handleSearch} />
          
          <FactDisplay
            fact={searchResult || facts[currentIndex]}
            onNext={handleNext}
            onPrev={handlePrev}
            isPaused={!!searchResult}
          />
        </div>
      </div>
    </div>
  );
}
