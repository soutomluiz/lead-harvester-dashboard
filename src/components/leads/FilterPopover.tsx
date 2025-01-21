import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/types/lead";

interface FilterPopoverProps {
  filters: Partial<Lead>;
  onFiltersChange: (filters: Partial<Lead>) => void;
  activeFiltersCount: number;
}

export const FilterPopover = ({
  filters,
  onFiltersChange,
  activeFiltersCount,
}: FilterPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Leads</h4>
            <p className="text-sm text-muted-foreground">
              Filter leads by different criteria
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, status: value as Lead["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="Filter by industry..."
                value={filters.industry || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, industry: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Filter by location..."
                value={filters.location || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, location: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Filter by phone..."
                value={filters.phone || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, phone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Filter by email..."
                value={filters.email || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, email: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};