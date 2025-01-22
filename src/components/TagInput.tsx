import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  onChange, 
  placeholder = "Digite uma tag e pressione Enter" 
}) => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = inputValue.trim();
      
      if (!newTag) {
        return;
      }

      if (tags.includes(newTag)) {
        toast({
          title: "Tag já existe",
          description: "Esta tag já foi adicionada.",
          variant: "destructive",
        });
        return;
      }

      onChange([...tags, newTag]);
      setInputValue("");
      
      toast({
        title: "Tag adicionada",
        description: `A tag "${newTag}" foi adicionada com sucesso.`,
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
    toast({
      title: "Tag removida",
      description: `A tag "${tagToRemove}" foi removida.`,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="px-2 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 hover:text-destructive focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};