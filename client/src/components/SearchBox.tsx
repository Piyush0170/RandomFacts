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

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    try {
      // First search for pages related to the query
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
      );

      const searchData = await searchResponse.json();
      if (!searchData.query.search.length) {
        throw new Error("No results found");
      }

      // Get a random page from the search results
      const randomIndex = Math.floor(Math.random() * Math.min(searchData.query.search.length, 5));
      const pageId = searchData.query.search[randomIndex].pageid;

      // Fetch the actual page content
      const contentResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=1&explaintext=1&pageids=${pageId}&format=json&origin=*`
      );

      const contentData = await contentResponse.json();
      const extract = contentData.query.pages[pageId].extract;

      if (extract) {
        // Clean up the fact
        const fact = extract
          .replace(/\([^)]*\)/g, '') // Remove parenthetical references
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

        onSearch(`Did you know? ${fact}`);
      } else {
        throw new Error("No fact found");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch fact from Wikipedia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 w-full max-w-2xl mx-auto">
      <Input
        placeholder="Search for interesting facts..."
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