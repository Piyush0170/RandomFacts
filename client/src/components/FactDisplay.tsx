import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface FactDisplayProps {
  fact: string;
  onNext: () => void;
  onPrev: () => void;
  isPaused?: boolean;
  onFavorite?: (fact: string) => void;
  isFavorited?: boolean;
}

export function FactDisplay({ 
  fact, 
  onNext, 
  onPrev, 
  isPaused = false,
  onFavorite,
  isFavorited = false
}: FactDisplayProps) {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const duration = 10000; // 10 seconds
  const interval = 100;

  useEffect(() => {
    if (isPaused || isHovered) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onNext();
          return 100;
        }
        return prev - (interval / duration * 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, onNext]);

  const handleFavorite = () => {
    onFavorite?.(fact);
  };

  return (
    <Card 
      className="w-full max-w-2xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-lg text-center">{fact}</p>

          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Progress value={progress} className="flex-1" />

            <Button
              variant="outline"
              size="icon"
              onClick={handleFavorite}
              className={isFavorited ? "text-red-500" : ""}
            >
              <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}