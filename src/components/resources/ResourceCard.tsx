
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LegalResource } from "@/types/resource";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar } from "lucide-react";

interface ResourceCardProps {
  resource: LegalResource;
  onClick: (resource: LegalResource) => void;
}

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const { language } = useLanguage();

  if (resource.language !== language && resource.language !== 'en') {
    return null;
  }

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    language === 'en' ? 'en-US' : language, 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-2">{resource.title}</CardTitle>
          <Badge variant={
            resource.category === 'article' ? 'default' : 
            resource.category === 'faq' ? 'secondary' : 'outline'
          }>
            {resource.category}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          {formattedDate}
          {resource.author && <span> • {resource.author}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{resource.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => onClick(resource)} className="w-full">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
