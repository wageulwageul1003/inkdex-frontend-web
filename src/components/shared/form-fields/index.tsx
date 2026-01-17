'use client';

import React from 'react';
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import Keywords from './keywords';

import Checkbox from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import SelectComponent from '@/components/ui/select-container';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export enum FormFieldType {
  // INPUT VARIANTS
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PASSWORD = 'password',
  NUMBER_INPUT = 'number-input',
  EDITOR = 'editor',
  TIMER_INPUT = 'timer-input',

  // KEYWORDS
  KEYWORDS = 'keywords',

  // RADIO VARIANTS
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TOGGLE = 'toggle',

  // DATE VARIANTS
  DATE_PICKER = 'datePicker',

  // SELECT VARIANTS
  SELECT = 'select',
  MULTISELECT = 'multi-select',

  // FILE VARIANTS
  FILE = 'file',
  IMAGE = 'image',

  // CUSTOM VARIANTS
  SKELETON = 'skeleton',
}

type InputFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  props: CustomProps<T>;
};

/**
 * @description Used in select, multi-select and radio
 */
export type TOptionList = Array<{
  label: string;
  value: string | boolean;
  disabled?: boolean;
  id?: string;
  labelClassName?: string;
}>;

interface CustomProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
  id?: string;

  // Label and message-related props
  label?: string;
  labelClassName?: string;

  /**
   * @description Used underneath the label
   */
  labelSlot?: React.JSX.Element;

  /**
   * @description Displayed above the main field
   */
  message?: string;
  messageClassName?: string;
  /**
   * @description Displayed underneath the main field
   */
  infoSlot?: React.JSX.Element;
  noDataMessage?: string;

  // Placeholder, format, and limit
  placeholder?: string;
  maxCharacters?: number;

  // State and behavior control
  disabled?: boolean;
  required?: boolean;
  isVerified?: boolean;
  expire?: string | number;
  isSearchIcon?: boolean;
  multiple?: boolean;

  // Layout and styling
  /**
   * @description The main class name applied to the field
   */
  className?: string;
  /**
   * @description The class name applied to the field's sub-element
   */
  fieldClassName?: string;

  // select options
  /**
   * @description Make the select and multi-select searchable
   */
  searchable?: boolean;
  /**
   * @description The select , multi-select and radio options
   * @type {  label: string; value: string; disabled?: boolean; id?: string;  labelClassName?: string;}
   */
  options?: TOptionList;
  checkboxValue?: string | boolean | number;
  checkboxLabel?: string | React.ReactNode;

  // Dynamic content and skeleton rendering
  renderSkeleton?: (
    _field: ControllerRenderProps<T, Path<T>>,
  ) => React.ReactNode;

  // Miscellaneous
  fieldType: FormFieldType;

  // image uploader props
  maxFiles?: number;
  accept?: string[];
  aspectRatio?: number;

  // editor props
  setHasFile?: React.Dispatch<React.SetStateAction<boolean>>;
  maxCount?: number;

  // event handlers
  onChange?: (e: any) => void;
}

export const InputField = <T extends FieldValues>({
  field,
  props,
}: InputFieldProps<T>) => {
  const { error, formItemId } = useFormField();

  switch (props.fieldType) {
    // INPUT
    case FormFieldType.INPUT:
      return (
        <fieldset
          className={cn('flex flex-col', props.labelSlot ? 'mt-2' : '')}
        >
          <Input
            placeholder={props.placeholder}
            error={error}
            type="search"
            disabled={props.disabled}
            className={props.fieldClassName}
            maxLength={props.maxCharacters}
            id={formItemId}
            {...field}
          />
        </fieldset>
      );

    // NUMBER_INPUT
    case FormFieldType.NUMBER_INPUT:
      return (
        <fieldset className="flex flex-col">
          <Input
            placeholder={props.placeholder}
            error={error}
            type="number"
            disabled={props.disabled}
            className={props.fieldClassName}
            maxLength={props.maxCharacters}
            id={formItemId}
            {...field}
          />
          {props.maxCharacters && (
            <span className="font-caption mt-2 truncate text-gray-500">
              ({field.value?.length.toString() || '0'}/{props.maxCharacters})
            </span>
          )}
        </fieldset>
      );

    // TIMER INPUT
    case FormFieldType.TIMER_INPUT:
      return (
        <Input
          placeholder={props.placeholder}
          error={error}
          disabled={props.disabled}
          className={props.fieldClassName}
          expire={props.expire}
          isVerified={props.isVerified}
          isSearchIcon={props.isSearchIcon}
          id={formItemId}
          {...field}
        />
      );

    // TEXTAREA
    case FormFieldType.TEXTAREA:
      return (
        <fieldset className="relative">
          <Textarea
            placeholder={props.placeholder}
            {...field}
            maxLength={props.maxCharacters}
            className={props.fieldClassName}
            id={formItemId}
            error={error}
          />
          {props.maxCharacters && (
            <span className="font-xs-2 absolute bottom-3 right-4 truncate text-gray-04">
              {field.value?.length.toString() || '0'}/{props.maxCharacters}
            </span>
          )}
        </fieldset>
      );

    // KEYWORD INPUT
    case FormFieldType.KEYWORDS:
      return (
        <Keywords
          field={field}
          message={props.message!}
          placeholder={props.placeholder!}
          maxCount={props.maxCount}
          {...props}
        />
      );

    // PASSWORD
    case FormFieldType.PASSWORD:
      return (
        <Input
          type="password"
          autoComplete="current-password"
          error={error}
          placeholder={props.placeholder}
          disabled={props.disabled}
          className={props.fieldClassName}
          id={formItemId}
          {...field}
        />
      );

    // **********************************************************************************
    // SELECTS, MULTI-SELECTS, COMBOBOX, COMBOBOX MULTISELECT
    // **********************************************************************************

    // SELECT
    case FormFieldType.SELECT:
      return (
        <SelectComponent
          options={props.options!}
          value={field.value}
          defaultValue={field.value}
          onValueChange={field.onChange}
          placeholder={props.placeholder}
          searchable={props.searchable}
          disabled={props.disabled}
          className={props.fieldClassName}
          noDataMessage={props.noDataMessage}
          error={error}
        />
      );

    // CHECKBOX
    case FormFieldType.CHECKBOX:
      return (
        <Checkbox
          label={props.checkboxLabel}
          className={props.className}
          disabled={props.disabled}
          checked={field.value}
          onChange={(e) => {
            field.onChange(e);
            props.onChange?.(e);
          }}
        />
      );
    case FormFieldType.RADIO:
      return (
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className={cn(props.fieldClassName)}
          disabled={props.disabled}
        >
          <div className="flex flex-col space-y-3">
            {props.options?.map((option) => (
              <div
                key={String(option.value)}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={String(option.value)}
                  id={option.id ?? String(option.value)}
                  disabled={option.disabled || props.disabled}
                />
                <label
                  htmlFor={option.id ?? String(option.value)}
                  className={cn(
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    option.labelClassName,
                  )}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );

    // TOGGLE
    case FormFieldType.TOGGLE:
      return (
        <Switch
          className={props.className}
          disabled={props.disabled}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      );

    // SKELETON
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;

    default:
      return null;
  }
};

const FormFields = <T extends FieldValues>(props: CustomProps<T>) => {
  const {
    control,
    name,
    label,
    labelSlot,
    required,
    className,
    labelClassName,
    message,
    messageClassName,
    infoSlot,
    fieldType,
  } = props;
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {/* LABEL */}
          {label && (
            <FormLabel required={required} className={cn(labelClassName)}>
              {label}
              {/* maxCharacters */}
              {fieldType === FormFieldType.INPUT && props.maxCharacters && (
                <span className="font-caption ml-1 mt-2 truncate text-gray-500">
                  ({field.value?.length.toString() || '0'}/{props.maxCharacters}
                  )
                </span>
              )}
            </FormLabel>
          )}

          {labelSlot}
          {/* DESCRIPTION */}
          {message && (
            <FormDescription
              className={cn(
                'font-caption mb-2 text-gray-500',
                messageClassName,
              )}
            >
              {message}
            </FormDescription>
          )}

          {/* FORM CONTROL */}
          <FormControl>
            <InputField field={field} props={props} />
          </FormControl>

          {/* Error message */}
          <FormMessage />

          {/* Info slot */}
          {infoSlot}
        </FormItem>
      )}
    />
  );
};

export default FormFields;
