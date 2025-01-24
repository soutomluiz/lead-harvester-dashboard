import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  leadId?: string;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  onChange,
  leadId,
  placeholder = "Digite uma tag e pressione Enter" 
}) => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const updateTagsInDatabase = async (newTags: string[]) => {
    if (!leadId) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ tags: newTags })
        .eq('id', leadId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating tags:', error);
      toast({
        title: "Erro ao salvar tags",
        description: "Não foi possível salvar as tags. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
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

      const newTags = [...tags, newTag];
      onChange(newTags);
      await updateTagsInDatabase(newTags);
      setInputValue("");
      
      toast({
        title: "Tag adicionada",
        description: `A tag "${newTag}" foi adicionada com sucesso.`,
      });
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
    await updateTagsInDatabase(newTags);
    
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
        className="w-full min-w-[100px]"
      />
    </div>
  );
};