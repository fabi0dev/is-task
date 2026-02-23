"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const inputClassName =
  "border-white/15 bg-white/5 focus-visible:ring-primary";

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
} & Omit<
  React.ComponentProps<"input">,
  "name" | "ref" | "onChange" | "onBlur" | "value"
>;

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
  className,
  id,
  ...rest
}: ControlledInputProps<T>) {
  const inputId = id ?? name;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={inputId}>{label}</Label>
          <Input
            {...rest}
            {...field}
            id={inputId}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            aria-describedby={fieldState.error ? `${inputId}-error` : undefined}
            className={cn(inputClassName, className)}
          />
          {fieldState.error?.message && (
            <p
              id={`${inputId}-error`}
              role="alert"
              className="text-destructive text-sm"
            >
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
