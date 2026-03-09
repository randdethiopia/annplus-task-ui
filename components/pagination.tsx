import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages?: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  loading?: boolean;
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
  loading
}) => {

  const hasPrev = page > 1;
  const hasNext = page < (totalPages || 1);

  const limits = [10, 25, 50, 100];

  return (
    <div className="flex items-center justify-end gap-3 m-8">
      <Select
        value={String(limit)}
        onValueChange={(v) => onLimitChange(Number(v))}
        disabled={loading}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Rows" />
        </SelectTrigger>
        <SelectContent>
          {limits.map((l) => (
            <SelectItem key={l} value={String(l)}>
              {l} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        disabled={!hasPrev || loading}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="ghost"
        disabled={loading || !hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>

    </div>
  );
};
