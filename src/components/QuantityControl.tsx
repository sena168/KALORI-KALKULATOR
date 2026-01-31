import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0 text-[0.85rem] sm:text-[0.9rem] md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1rem]",
        className
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        onClick={onDecrement}
        disabled={quantity <= 0}
        className="rounded-full h-[2.4em] w-[2.4em] md:h-[2.2em] md:w-[2.2em] lg:h-[2.5em] lg:w-[2.5em] xl:h-[2.8em] xl:w-[2.8em]"
      >
        <Minus className="h-[1em] w-[1em]" />
      </Button>
      
      <span className="text-[1.4em] font-bold min-w-[2em] text-center text-foreground leading-none">
        {quantity}
      </span>
      
      <Button
        variant="default"
        size="icon"
        onClick={onIncrement}
        className="rounded-full h-[2.4em] w-[2.4em] md:h-[2.2em] md:w-[2.2em] lg:h-[2.5em] lg:w-[2.5em] xl:h-[2.8em] xl:w-[2.8em]"
      >
        <Plus className="h-[1em] w-[1em]" />
      </Button>
    </div>
  );
};

export default QuantityControl;
