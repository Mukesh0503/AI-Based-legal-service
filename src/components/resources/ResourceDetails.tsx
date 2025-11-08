
import { useState } from "react";
import { LegalResource } from "@/types/resource";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Printer, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResourceDetailsProps {
  resource: LegalResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDetails({ resource, open, onOpenChange }: ResourceDetailsProps) {
  const { language, translate } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    language === 'en' ? 'en-US' : language, 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: translate("linkCopied"),
      description: translate("resourceLinkCopied")
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = resource.content;
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: translate("downloadStarted"),
      description: `${resource.title} ${translate("isBeingDownloaded")}`
    });
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'article': return 'default';
      case 'faq': return 'secondary';
      case 'guide': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto glass-effect">
        <DialogHeader className="text-left border-b pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={getBadgeVariant(resource.category)} className="capitalize">
              {resource.category}
            </Badge>
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-accent/50">
                {tag}
              </Badge>
            ))}
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-balance">
            {resource.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate}</span>
            {resource.author && (
              <>
                <span className="mx-1">•</span>
                <span className="font-medium">{resource.author}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="prose prose-stone dark:prose-invert max-w-none py-4">
          <div dangerouslySetInnerHTML={{ __html: resource.content }} />
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 border-t pt-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              {translate("download")}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              {translate("print")}
            </Button>
          </div>
          <Button variant="secondary" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            {copied ? translate("copied") : translate("share")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
