import { useState } from "react";
import { FactDisplay } from "@/components/FactDisplay";
import { SearchBox } from "@/components/SearchBox";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface Fact {
  content: string;
  category: string;
}

const defaultFacts: Fact[] = [
  // Science
  { content: "The Great Wall of China is not visible from space with the naked eye.", category: "Science" },
  { content: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.", category: "Science" },
  { content: "A day on Venus is longer than its year. It takes Venus 243 Earth days to rotate on its axis but only 225 Earth days to orbit the Sun.", category: "Science" },

  // Sports
  { content: "The first Olympic Games were held in ancient Greece in 776 BC.", category: "Sports" },
  { content: "Basketball was invented by Dr. James Naismith in 1891.", category: "Sports" },
  { content: "The FIFA World Cup is the most-watched sporting event in the world.", category: "Sports" },

  // History
  { content: "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after just 38 minutes.", category: "History" },
  { content: "The first written constitution in the world was created by the Iroquois Confederacy.", category: "History" },
  { content: "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.", category: "History" },

  // Technology
  { content: "The first computer mouse was made of wood.", category: "Technology" },
  { content: "The first text message was sent in 1992 and said 'Merry Christmas'.", category: "Technology" },
  { content: "About 90% of the world's data has been created in the last two years.", category: "Technology" },

  // Nature
  { content: "Octopuses have three hearts.", category: "Nature" },
  { content: "Sloths take two weeks to digest their food.", category: "Nature" },
  { content: "Hummingbirds are the only birds that can fly backwards.", category: "Nature" },

  // Art & Culture
  { content: "Leonardo da Vinci wrote his notes backwards.", category: "Art & Culture" },
  { content: "The Mona Lisa has no eyebrows.", category: "Art & Culture" },
  { content: "Vincent van Gogh only sold one painting in his lifetime.", category: "Art & Culture" }
  // Add more facts here...
];

export default function Home() {
  const [facts] = useState<Fact[]>(defaultFacts);
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

  const currentFact = searchResult || facts[currentIndex].content;
  const currentCategory = !searchResult ? facts[currentIndex].category : "Wikipedia";

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

          <div className="text-center text-sm text-muted-foreground mb-2">
            Category: {currentCategory}
          </div>

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