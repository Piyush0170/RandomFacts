import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FactDisplayProps {
  fact: string;
  category: string;
  onNext: () => void;
  onPrev: () => void;
  isPaused?: boolean;
  onFavorite?: (fact: string) => void;
  isFavorited?: boolean;
}

export function FactDisplay({ 
  fact, 
  category,
  onNext, 
  onPrev, 
  isPaused = false,
  onFavorite,
  isFavorited = false
}: FactDisplayProps) {
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const duration = 10000; // 10 seconds
  const interval = 100;
  const { toast } = useToast();

  useEffect(() => {
    if (isPaused || isHovered) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + (interval / duration * 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, onNext]);

  const handleFavorite = () => {
    onFavorite?.(fact);
  };

  const handleShare = async () => {
    const shareText = `${fact} - ${category}`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText
        });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          handleCopyToClipboard();
        }
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${fact} - ${category}`);
      toast({
        title: "Copied to clipboard",
        description: "You can now share this fact with others!",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying the text manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="w-full max-w-2xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            {category}
          </div>
          <p className="text-lg text-center">{fact}</p>

          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 h-1">
              <Progress value={progress} className="h-1" />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>

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