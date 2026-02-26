import { forwardRef, type InputHTMLAttributes } from "react";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, onCheckedChange, className = "", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            onChange={handleChange}
            {...props}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/30"></div>
        </label>
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <span className="text-sm font-medium text-text-primary">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-text-secondary">{description}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
