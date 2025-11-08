
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceCategory } from "@/types/resource";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResourceFiltersProps {
  categories: ResourceCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onSearch: (term: string) => void;
}

export function ResourceFilters({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onSearch 
}: ResourceFiltersProps) {
  const { translate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input 
          placeholder={translate('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>
      
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(null)}
        >
          All
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(category.id)}
            className="flex gap-2 items-center"
          >
            {category.name}
            <Badge variant="outline">{category.count}</Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}
