import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues
} from "react-hook-form"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Context to track current field name
const FormFieldContext = React.createContext<{ name: string } | null>(null)

function useFormField(): { name: string } {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error("Form components must be used within a FormField")
  }
  return context
}

// <Form> wrapper (used in pages)
const Form = FormProvider

// <FormField> — wraps each field with name context and controller
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  render,
  ...props
}: ControllerProps<TFieldValues, TName>): JSX.Element {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} render={render} {...props} />
    </FormFieldContext.Provider>
  )
}

// <FormItem> — spacing wrapper
function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn(className)} {...props} />
}

// <FormLabel> — styled label
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>): JSX.Element {
  return <Label className={cn("text-sm font-medium", className)} {...props} />
}

// <FormControl> — input wrapper
function FormControl({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn("w-full", className)} {...props} />
}

// <FormMessage> — shows error for the current field
function FormMessage({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element | null {
  const { name } = useFormField()
  const { errors } = useFormState()

  const error = (errors as any)?.[name]

  if (!error) return null

  return (
    <p className={cn("text-sm text-red-500", className)} {...props}>
      {String(error.message)}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }
