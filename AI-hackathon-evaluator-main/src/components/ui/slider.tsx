import * as React from "react"
import { cn } from "../../lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'defaultValue'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, onValueChange, max = 100, step = 1, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (onValueChange) {
        onValueChange([val]);
      }
    };

    const currentValue = value ? value[0] : (defaultValue ? defaultValue[0] : 0);

    return (
      <input
        type="range"
        className={cn(
          "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500",
          className
        )}
        ref={ref}
        value={currentValue}
        onChange={handleChange}
        max={max}
        step={step}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
