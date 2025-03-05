import { useState } from "react";
import { FactDisplay } from "@/components/FactDisplay";
import { SearchBox } from "@/components/SearchBox";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const defaultFacts = [
  "The Great Wall of China is not visible from space with the naked eye.",
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
  "A day on Venus is longer than its year. It takes Venus 243 Earth days to rotate on its axis but only 225 Earth days to orbit the Sun.",
];

export default function Home() {
  const [facts, setFacts] = useState(defaultFacts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { toast } = useToast();

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

  const handleFavorite = (fact: string) => {
    const isFavorite = favorites.includes(fact);
    if (isFavorite) {
      setFavorites(favorites.filter((f) => f !== fact));
      toast({
        title: "Removed from favorites",
        description: "The fact has been removed from your favorites",
      });
    } else {
      setFavorites([...favorites, fact]);
      toast({
        title: "Added to favorites",
        description: "The fact has been added to your favorites",
      });
    }
  };

  const currentFact = searchResult || facts[currentIndex];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" fill="currentColor" />
            Favorites ({favorites.length})
          </Button>
          <ThemeToggle />
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-center">Random Facts</h1>

          {showFavorites && favorites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Favorite Facts</h2>
              {favorites.map((fact, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p>{fact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <SearchBox onSearch={handleSearch} />

          <FactDisplay
            fact={currentFact}
            onNext={handleNext}
            onPrev={handlePrev}
            isPaused={!!searchResult}
            onFavorite={handleFavorite}
            isFavorited={favorites.includes(currentFact)}
          />
        </div>
      </div>
    </div>
  );
}