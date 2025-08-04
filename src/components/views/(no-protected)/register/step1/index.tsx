'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useReducer, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep1Schema, TRegisterStep1Schema } from '../schema';

import CButton from '@/components/shared/CButton';
import CIconButton from '@/components/shared/IconButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Form } from '@/components/ui/form';
import { useTermModal } from '@/hooks/terms/useTermModal';
import { cn } from '@/lib/utils';

// Define initial state for checkboxes
const initialState = {
  allAgree: false,
  age: false,
  terms: false,
  privacy: false,
  isPersonalTermAgree: false,
  marketing: false,
  isMarketingEmailAgree: false,
  isMarketingSmsAgree: false,
};

// Define action types
const ACTION_TYPES = {
  TOGGLE_ALL: 'TOGGLE_ALL',
  TOGGLE_MARKETING: 'TOGGLE_MARKETING',
  TOGGLE_COMMUNICATION: 'TOGGLE_COMMUNICATION',
  TOGGLE_CHECKBOX: 'TOGGLE_CHECKBOX',
};

// Create reducer function
const formReducer = (
  state: typeof initialState,
  action: { type: keyof typeof ACTION_TYPES; value: boolean; field?: string },
) => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_ALL:
      // Toggle all checkboxes together - requirement #1
      return {
        ...state,
        allAgree: action.value,
        age: action.value,
        terms: action.value,
        privacy: action.value,
        isPersonalTermAgree: action.value,
        marketing: action.value,
        isMarketingEmailAgree: action.value,
        isMarketingSmsAgree: action.value,
      };

    case ACTION_TYPES.TOGGLE_MARKETING:
      // When marketing is toggled:
      // If marketing is turned ON, we automatically check both isMarketingEmailAgree and isMarketingSmsAgree
      // If marketing is turned OFF, we must uncheck both isMarketingEmailAgree and isMarketingSmsAgree
      const newState = {
        ...state,
        marketing: action.value,
      };

      if (action.value) {
        // If marketing is turned ON, both isMarketingEmailAgree and isMarketingSmsAgree should be checked
        newState.isMarketingEmailAgree = true;
        newState.isMarketingSmsAgree = true;
      } else {
        // If marketing is turned OFF, both isMarketingEmailAgree and isMarketingSmsAgree should be unchecked
        newState.isMarketingEmailAgree = false;
        newState.isMarketingSmsAgree = false;
      }

      // Check if all checkboxes should be true - requirement #2
      newState.allAgree =
        newState.age &&
        newState.terms &&
        newState.privacy &&
        newState.isPersonalTermAgree &&
        newState.marketing &&
        newState.isMarketingEmailAgree &&
        newState.isMarketingSmsAgree;

      return newState;

    case ACTION_TYPES.TOGGLE_COMMUNICATION:
      // When isMarketingEmailAgree or isMarketingSmsAgree is toggled
      const newIsMarketingEmailAgree =
        action.field === 'isMarketingEmailAgree'
          ? action.value
          : state.isMarketingEmailAgree;
      const newIsMarketingSmsAgree =
        action.field === 'isMarketingSmsAgree'
          ? action.value
          : state.isMarketingSmsAgree;

      // Marketing should be true if either isMarketingEmailAgree OR isMarketingSmsAgree is true
      // Marketing should be false ONLY if BOTH isMarketingEmailAgree AND isMarketingSmsAgree are false
      const newMarketing = newIsMarketingEmailAgree || newIsMarketingSmsAgree;

      const commState = {
        ...state,
        [action.field as string]: action.value,
        marketing: newMarketing,
      };

      // Check if all checkboxes should be true - requirement #2
      commState.allAgree =
        commState.age &&
        commState.terms &&
        commState.privacy &&
        commState.isPersonalTermAgree &&
        commState.marketing &&
        commState.isMarketingEmailAgree &&
        commState.isMarketingSmsAgree;

      return commState;

    case ACTION_TYPES.TOGGLE_CHECKBOX:
      // For regular checkboxes (age, terms, privacy, isPersonalTermAgree)
      const checkboxState = {
        ...state,
        [action.field as string]: action.value,
      };

      // Check if all checkboxes should be true - requirement #2
      checkboxState.allAgree =
        checkboxState.age &&
        checkboxState.terms &&
        checkboxState.privacy &&
        checkboxState.isPersonalTermAgree &&
        checkboxState.marketing &&
        checkboxState.isMarketingEmailAgree &&
        checkboxState.isMarketingSmsAgree;

      return checkboxState;

    default:
      return state;
  }
};

const RegisterStep1View = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 약관 모달 훅 사용
  const { handleTermsModal } = useTermModal();

  // Convert initial state to match schema requirements for required fields
  const defaultValues = {
    ...initialState,
    age: initialState.age,
    terms: initialState.terms,
    privacy: initialState.privacy,
  };

  const form = useForm<TRegisterStep1Schema>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues,
    mode: 'onSubmit', // Only validate on submit
  });

  const { control, setValue, formState, watch, trigger } = form;

  // Watch for form value changes
  const formValues = {
    allAgree: watch('allAgree') ?? false,
    age: watch('age') ?? false,
    terms: watch('terms') ?? false,
    privacy: watch('privacy') ?? false,
    isPersonalTermAgree: watch('isPersonalTermAgree') ?? false,
    marketing: watch('marketing') ?? false,
    isMarketingEmailAgree: watch('isMarketingEmailAgree') ?? false,
    isMarketingSmsAgree: watch('isMarketingSmsAgree') ?? false,
  };

  // Handle form value changes
  useEffect(() => {
    // Create a deep copy of the current state for comparison
    const currentState = { ...state };

    // Check which field changed
    let changedField = null;
    for (const field of Object.keys(formValues) as Array<
      keyof typeof formValues
    >) {
      if (formValues[field] !== currentState[field]) {
        changedField = field;
        break;
      }
    }

    if (changedField) {
      let actionType;

      if (changedField === 'allAgree') {
        actionType = ACTION_TYPES.TOGGLE_ALL;
      } else if (changedField === 'marketing') {
        actionType = ACTION_TYPES.TOGGLE_MARKETING;
      } else if (
        changedField === 'isMarketingEmailAgree' ||
        changedField === 'isMarketingSmsAgree'
      ) {
        actionType = ACTION_TYPES.TOGGLE_COMMUNICATION;
      } else {
        actionType = ACTION_TYPES.TOGGLE_CHECKBOX;
      }

      // Process the action through our reducer
      const newState = formReducer(currentState, {
        type: actionType as
          | 'TOGGLE_ALL'
          | 'TOGGLE_MARKETING'
          | 'TOGGLE_COMMUNICATION'
          | 'TOGGLE_CHECKBOX',
        field: changedField,
        value: formValues[changedField] ?? false,
      });

      // Update the state
      dispatch({
        type: actionType as
          | 'TOGGLE_ALL'
          | 'TOGGLE_MARKETING'
          | 'TOGGLE_COMMUNICATION'
          | 'TOGGLE_CHECKBOX',
        field: changedField,
        value: formValues[changedField] ?? false,
      });

      // Update other form values without triggering this effect again
      for (const key of Object.keys(newState) as Array<
        keyof typeof formValues
      >) {
        if (key !== changedField && newState[key] !== formValues[key]) {
          setValue(key, newState[key], {
            shouldValidate: isSubmitted, // Only validate if form has been submitted
          });
        }
      }

      // Only trigger validation if the form has been submitted
      if (isSubmitted) {
        trigger();
      }
    }
  }, [formValues, state, setValue, trigger, isSubmitted]);

  const handleSubmit = async () => {
    setIsSubmitted(true); // Mark form as submitted

    const isValid = await trigger(); // Manually trigger validation

    if (isValid) {
      const values = form.getValues();
      onSubmit(values as TRegisterStep1Schema);
    }
  };

  const onSubmit = (values: TRegisterStep1Schema) => {
    // console.log('폼 데이터:', values);
    router.push(
      `/register/step2?isPersonalTermAgree=${values.isPersonalTermAgree}&isMarketingEmailAgree=${values.isMarketingEmailAgree}&isMarketingSmsAgree=${values.isMarketingSmsAgree}`,
    );

    //finally onSubmit end
    setIsSubmitted(false);
  };

  return (
    <div className="default-login-layout-content">
      <div className="flex flex-col items-start text-left">
        <p className="font-subtitle-bold">서비스 이용약관을 위해</p>
        <p className="font-subtitle-bold">약관에 동의해 주세요.</p>
      </div>
      <p className="font-caption mt-2 flex flex-col items-start text-gray-400">
        자세한 내용은 각 약관을 클릭해 확인할 수 있습니다.
      </p>

      <div className="mt-8 flex flex-col items-start">
        <Form {...form}>
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            <FormFields
              id="allAgree"
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="allAgree"
              checkboxLabel={
                <span className="font-body2-bold">약관 전체 동의</span>
              }
              checkboxValue={true}
              className="py-2"
            />

            <div
              className={cn(
                `flex flex-col gap-3 border-t border-gray-200 pt-3`,
              )}
            >
              {[
                {
                  name: 'age',
                  label: '본인은 만 14세 이상입니다.',
                  required: true,
                },
                {
                  name: 'terms',
                  label: '이용약관',
                  uuid: 'service_term',
                  required: true,
                  arrow: '/help',
                },
                {
                  name: 'privacy',
                  label: '개인정보 수집 및 이용내역',
                  uuid: 'personal_information_collection',
                  required: true,
                  arrow: '/help',
                },
                {
                  name: 'isPersonalTermAgree',
                  label: '개인정보 제 3자 제공 내역',
                  uuid: 'personal_information_third',
                  required: false,
                  arrow: '/help',
                },
              ].map(({ name, label, required, arrow, uuid }, index) => (
                <FormFields
                  key={name}
                  id={name}
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name={name}
                  checkboxLabel={
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-body1-bold ${required ? '' : 'text-gray-400'}`}
                        >
                          {required ? '(필수)' : '(선택)'}
                        </span>
                        <span className={`font-body1`}>{label}</span>
                      </div>
                      {arrow && (
                        <CIconButton
                          buttonType="only"
                          size="small"
                          icon={
                            <Icons.keyboard_arrow_right className="h-m w-m fill-gray-700" />
                          }
                          onClick={() => handleTermsModal(label, uuid)}
                        />
                      )}
                    </div>
                  }
                  checkboxValue={true}
                />
              ))}

              <FormFields
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="marketing"
                id="marketing"
                checkboxLabel={
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className={`font-body1-bold text-gray-400`}>
                        (선택)
                      </span>
                      <span className={`font-body1`}>
                        마케팅 및 광고 활용 동의
                      </span>
                    </div>
                    <CIconButton
                      buttonType="only"
                      size="small"
                      icon={
                        <Icons.keyboard_arrow_right className="fill-gray-700" />
                      }
                      onClick={() =>
                        handleTermsModal(
                          '마케팅 및 광고 활용 동의',
                          'marketing_consent',
                        )
                      }
                    />
                  </div>
                }
                checkboxValue={true}
              />
            </div>

            <div className="mt-2 flex items-center gap-5 px-7">
              {[
                { name: 'isMarketingEmailAgree', label: '이메일' },
                { name: 'isMarketingSmsAgree', label: 'SMS' },
              ].map(({ name, label }, index) => (
                <FormFields
                  key={name}
                  fieldType={FormFieldType.CHECK}
                  control={form.control}
                  name={name}
                  id={name}
                  checkboxLabel={<span>{label}</span>}
                  checkboxValue={true}
                />
              ))}
            </div>
          </form>
        </Form>
      </div>

      <CButton
        buttonType="contained"
        text="다음"
        type="button"
        onClick={handleSubmit}
        className={`mt-[80px] w-full rounded px-4 py-2`}
        disabled={
          !form.getValues('age') ||
          !form.getValues('privacy') ||
          !form.getValues('terms')
        }
      />
    </div>
  );
};

export default RegisterStep1View;
