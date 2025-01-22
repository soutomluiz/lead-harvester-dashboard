import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ThemeSettings() {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (value: string) => {
    setTheme(value);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(value);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    handleThemeChange(savedTheme);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tema</h3>
      <div className="space-y-2">
        <Label htmlFor="theme-select">Selecione o tema</Label>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger id="theme-select">
            <SelectValue placeholder="Selecione o tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Claro</SelectItem>
            <SelectItem value="dark">Escuro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}