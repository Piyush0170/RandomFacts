import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchBoxProps {
  onSearch: (result: string) => void;
}

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function extractFact(text: string): string {
    // Get first sentence or short paragraph
    const firstSentence = text.split(/[.!?](?:\s|$)/)[0];

    // Remove parenthetical references
    const cleanSentence = firstSentence.replace(/\([^)]*\)/g, "").trim();

    // Limit length and add ellipsis if needed
    return cleanSentence.length > 150 
      ? cleanSentence.substring(0, 150) + "..."
      : cleanSentence;
  }

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(query)}&origin=*`
      );

      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;

      if (extract) {
        const fact = extractFact(extract);
        onSearch(fact);
      } else {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch from Wikipedia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 w-full max-w-2xl mx-auto">
      <Input
        placeholder="Search Wikipedia..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch} disabled={loading}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}