import { Lead } from "@/types/lead";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LeadScoreProps {
  lead: Lead;
}

export function LeadScore({ lead }: LeadScoreProps) {
  const calculateScore = (lead: Lead): number => {
    let score = 0;
    
    // Basic information completeness (40 points max)
    if (lead.company_name) score += 10;
    if (lead.industry) score += 10;
    if (lead.location) score += 10;
    if (lead.contact_name) score += 10;
    
    // Contact information (30 points max)
    if (lead.email) score += 15;
    if (lead.phone) score += 15;
    
    // Additional data (30 points max)
    if (lead.website) score += 10;
    if (lead.deal_value > 0) score += 10;
    if (lead.tags && lead.tags.length > 0) score += 10;
    
    return score;
  };

  const score = calculateScore(lead);
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return "Hot";
    if (score >= 60) return "Warm";
    if (score >= 40) return "Cool";
    return "Cold";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Progress 
              value={score} 
              className={`w-24 ${getScoreColor(score)}`}
            />
            <Badge variant={score >= 60 ? "default" : "secondary"}>
              {getScoreLabel(score)}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Score: {score}/100</p>
          <p className="text-xs text-muted-foreground">
            Based on information completeness and quality
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}