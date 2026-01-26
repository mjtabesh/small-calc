import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { NumericFormat } from "react-number-format";

export default function IncomeInput({
  label,
  value,
  onChange,
  placeholder = "0",
  hint,
  id
}) {
  return (
    <div className="space-y-1.5">
      {/* @ts-ignore */}
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </Label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <NumericFormat
          id={id}
          value={value === 0 ? '' : value}
          onValueChange={(values) => {
            const floatVal = values.floatValue;
            onChange(floatVal === undefined ? 0 : floatVal);
          }}
          thousandSeparator={true}
          decimalScale={0}
          fixedDecimalScale={false}
          allowNegative={false}
          placeholder={placeholder}
          customInput={Input}
          className="pl-9 h-12 bg-white/60 backdrop-blur-sm border-slate-200/60 focus:ring-slate-400 focus:border-slate-400 text-right font-mono"
        />
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}