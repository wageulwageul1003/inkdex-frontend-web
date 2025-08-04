'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep3Schema, TRegisterStep3Schema } from '../schema';

import InstitutionSearchModal from './_components/InstitutionSearchModal';

import CButton from '@/components/shared/CButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import AddressSearchModal from '@/components/shared/modals/AddressSearchModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Form } from '@/components/ui/form';
import { DateMode } from '@/constants/enums';
import { useGetCheckId } from '@/hooks/auth/useGetCheckId';
import { usePostRegister } from '@/hooks/auth/usePostRegister';
import { useGetPointIntroduce } from '@/hooks/point/useGetPointIntroduce';
import { useAlert } from '@/hooks/useAlert';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
import { useGetRegionTree } from '@/hooks/useGetRegionTree';
import { decryptObject } from '@/lib/utils';

// 담당 업무 타입 정의
interface ResponsibilityTypeItem {
  constResponsibilityType: string;
  responsibilityTypeManual: string | null | undefined;
}

const RegisterStep3View: React.FC = () => {
  const { mutateAsync: postRegister } = usePostRegister();
  const { mutateAsync: getCheckId } = useGetCheckId();
  const [isDuplication, setIsDuplication] = useState<boolean>(false);
  const [isIdVerified, setIsIdVerified] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const alert = useAlert();
  const [openAccordions, setOpenAccordions] = useState<string[]>([
    'accordion-1',
    'accordion-2',
  ]);
  const legacyUserInfoParam = searchParams.get('legacyUserInfo');
  const legacyUserInfoData = legacyUserInfoParam
    ? decryptObject(legacyUserInfoParam)
    : null;
  const { data: pointGuide } = useGetPointIntroduce();

  // 회원 구분
  const { constants: memberType } = useSpecificConstant('const_member_type');

  // 성별
  const { constants: gender } = useSpecificConstant('const_gender');

  // 직업/역할
  const { constants: job } = useSpecificConstant('const_job');

  // 기관 구분
  const { constants: organizationType } = useSpecificConstant(
    'const_organization_type',
  );

  // 기관명 입력 방식
  const { constants: affiliationInputType } = useSpecificConstant(
    'const_affiliation_input_type',
  );

  // 기관 주소
  const { data: regionTree } = useGetRegionTree();

  // 설립 구분
  const { constants: establishmentType } = useSpecificConstant(
    'const_establishment_type',
  );

  // 담당 업무
  const { constants: responsibilityType } = useSpecificConstant(
    'const_responsibility_type',
  );

  // 가입 목적
  const { constants: registrationPurpose } = useSpecificConstant(
    'const_registration_purpose',
  );

  // 가입 경로
  const { constants: registrationSource } = useSpecificConstant(
    'const_registration_source',
  );

  // 폼 필드 타입 확장 (동적 필드 추가)
  type ExtendedFormType = TRegisterStep3Schema & {
    [key: string]: any;
    responsibility_other_manual?: string;
    responsibility_manual_input?: string;
    additionalInfo: {
      additionalInfoExtendInfo: ResponsibilityTypeItem[];
      responsibilityTypes?: string[];
      responsibilityTypeManual?: string;
      [key: string]: any;
    };
  };

  const form = useForm<ExtendedFormType>({
    resolver: zodResolver(registerStep3Schema),
    mode: 'onChange',
    defaultValues: {
      isPersonalTermAgree: searchParams.get('isPersonalTermAgree') === 'true',
      marketing:
        searchParams.get('isMarketingEmailAgree') === 'true' &&
        searchParams.get('isMarketingSmsAgree') === 'true',
      isMarketingEmailAgree:
        searchParams.get('isMarketingEmailAgree') === 'true',
      isMarketingSmsAgree: searchParams.get('isMarketingSmsAgree') === 'true',
      phone: searchParams.get('phone') || '',
      constMemberType: '',
      account: '',
      name: '',
      nickName: '',
      password: '',
      email: '',
      addressZipCode: '',
      addressDefault: '',
      addressDetail: '',
      constGender: '',
      birth: new Date(),
      constJob: '',
      additionalInfo: {
        constOrganizationType: '',
        constAffiliationInputType: 'search',
        affiliationName: '',
        regionProvince: '',
        regionDistrict: '',
        constEstablishmentType: '',
        additionalInfoExtendInfo: [],
        responsibilityTypes: [],
        responsibilityTypeManual: '',
        constRegistrationPurpose: '',
        registrationPurposeManual: '',
        constRegistrationSource: '',
        registrationSourceManual: '',
      },
    },
  });

  // 기관명 입력 방식 label
  const affiliationInputTypeLabel = useGetConstantLabel(
    affiliationInputType,
    form.watch('additionalInfo.constAffiliationInputType') || '',
  );

  const onSubmit = async (values: TRegisterStep3Schema) => {
    try {
      const responsibilityTypes = form.getValues(
        'additionalInfo.responsibilityTypes',
      );
      // undefined를 null로 변환하여 타입 오류 해결
      const responsibilityTypeManual =
        form.getValues('additionalInfo.responsibilityTypeManual') || null;

      // 배열 형식으로 변환
      const formattedResponsibilityTypes = Array.isArray(responsibilityTypes)
        ? responsibilityTypes.map((type: string) => {
            const item: ResponsibilityTypeItem = {
              constResponsibilityType: type,
              responsibilityTypeManual:
                type === 'other_manual' ? responsibilityTypeManual : null,
            };
            return item;
          })
        : [];

      // 변환된 값으로 업데이트
      const updatedValues = {
        ...values,
        additionalInfo: {
          ...values.additionalInfo,
          additionalInfoExtendInfo: formattedResponsibilityTypes,
        },
      };

      const data = await postRegister(updatedValues as TRegisterStep3Schema);
      if (data.code === 2000) {
        router.push('/register/success');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  // useRef를 사용하여 알림이 이미 표시되었는지 추적
  const alertShownRef = React.useRef(false);

  // Check for required query parameters from step1
  useEffect(() => {
    const isPersonalTermAgree = searchParams.get('isPersonalTermAgree');
    const isMarketingEmailAgree = searchParams.get('isMarketingEmailAgree');
    const isMarketingSmsAgree = searchParams.get('isMarketingSmsAgree');
    const isExistingMember = searchParams.get('isExistingMember');
    const legacyUserInfo = searchParams.get('legacyUserInfo');

    // If any of the required parameters are missing, redirect to step1
    if (
      isPersonalTermAgree === null ||
      isMarketingEmailAgree === null ||
      isMarketingSmsAgree === null
    ) {
      router.push('/register/step1');
    }

    if (isExistingMember === 'false' || legacyUserInfo === String(null)) {
      router.push('/register/step2');
    }

    if (isExistingMember === 'true' && !alertShownRef.current) {
      alertShownRef.current = true; // 알림이 표시되었음을 표시
      alert({
        title: '기존 회원 정보가 확인되었습니다.',
        description: (
          <div className="flex w-full flex-col">
            <span className="font-body1 text-center text-gray-500">
              가입된 이력이 확인되어 기존 데이터를 자동 입력했습니다. 필요하면
              수정 후 가입을 진행해 주세요.
            </span>
            <span className="font-body1 text-center text-gray-500">
              또한, 보유 중인 포인트도 그대로 유지됩니다.
            </span>
          </div>
        ),
        cancelButton: null,
      });

      form.setValue('constMemberType', legacyUserInfoData.constMemberType);
      form.setValue('name', legacyUserInfoData.name);
      form.setValue('nickName', legacyUserInfoData.nickName);
      form.setValue('email', legacyUserInfoData.email);
      form.setValue('addressZipCode', legacyUserInfoData.addressZipCode);
      form.setValue('addressDefault', legacyUserInfoData.addressDefault);
      form.setValue('addressDetail', legacyUserInfoData.addressDetail);
      form.setValue('constGender', legacyUserInfoData.constGender);
      form.setValue('birth', new Date(legacyUserInfoData.birth));
      form.setValue('constJob', String(legacyUserInfoData.constJob));
      form.setValue('additionalInfo', legacyUserInfoData.additionalInfo);
    }
  }, [searchParams, router, alert]);

  // 아이디 입력 필드 값이 변경될 때마다 상태 업데이트
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'account' || name === undefined) {
        // 아이디가 변경되면 중복 확인 상태와 검증 상태를 초기화
        setIsIdVerified(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // 기관명 입력 방식 변경될 때마다 기관명 입력 필드 초기화
  useEffect(() => {
    form.setValue('additionalInfo.affiliationName', '');
  }, [form.watch('additionalInfo.constAffiliationInputType')]);

  // 가입 경로 변경될 때마다 가입 경로 입력 필드 초기화
  useEffect(() => {
    form.setValue('additionalInfo.registrationSourceManual', '');
  }, [form.watch('additionalInfo.constRegistrationSource')]);

  const handleCheckId = async () => {
    const account = form.getValues('account');
    const data = await getCheckId(account);
    setIsDuplication(data.isDuplication);

    if (data.isDuplication) {
      form.setError('account', {
        type: 'manual',
        message: '이미 가입된 아이디입니다.',
      });
      setIsIdVerified(false);
    } else {
      form.clearErrors('account');
      setIsIdVerified(true);
    }
  };

  // 주소 검색 모달 열기
  const openAddressSearch = (): void => {
    // 모달을 열고 ref에 ID 저장
    const alertIdRef = { current: '' };

    const addressPromise = alert({
      title: '우편번호 찾기',
      description: null,
      contentSlot: (
        <AddressSearchModal
          onComplete={(data) => {
            form.setValue('addressZipCode', data.zonecode, {
              shouldValidate: true,
            });
            form.setValue('addressDefault', data.roadAddress, {
              shouldValidate: true,
            });
            alert.closeAlert(alertIdRef.current);
          }}
          alertId={alertIdRef.current}
        />
      ),
      alertDialogFooter: {
        className: 'justify-end',
      },
    });

    // 모달 ID를 ref에 저장
    alertIdRef.current = addressPromise.id;
  };

  return (
    <div className="default-login-layout-content">
      <span className="font-subtitle-bold text-black">회원가입</span>

      <div className="mt-8 flex w-full flex-col items-start">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Validation Errors:', errors);
            })}
            className="w-full space-y-5"
          >
            <div className="font-body2-bold w-full border-b border-gray-200 py-1 text-gray-700">
              기본 정보 입력
            </div>

            <FormFields
              fieldType={FormFieldType.RADIO}
              control={form.control}
              name="constMemberType"
              label="회원 구분"
              required
              options={memberType.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />

            <div className="flex grid w-full grid-cols-[1fr_auto] items-start items-end gap-1">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="account"
                label="아이디"
                placeholder="아이디 입력"
                required
                className="w-full"
                isVerified={isIdVerified}
              />
              <CButton
                buttonType="contained"
                text="중복확인"
                type="button"
                className={`whitespace-nowrap ${form.formState.errors.account ? 'mb-5' : 'mb-0'} flex-shrink-0`}
                onClick={handleCheckId}
                disabled={isIdVerified}
              />
            </div>

            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="이름"
              placeholder="이름 입력"
              required
            />
            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="nickName"
              label="닉네임"
              placeholder="닉네임 입력"
              required
            />
            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="영문, 숫자, 특수문자 조합 8자 이상"
              required
            />
            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="confirmedPassword"
              label="비밀번호 확인"
              placeholder="비밀번호 재입력"
              required
            />

            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="이메일"
              labelClassName="!mb-1"
              placeholder="이메일를 입력해주세요"
              message="이메일은 다양한 프로그램 신청 안내를 위해 필요합니다. 정확한 이메일 주소를 입력해 주세요."
              messageClassName="font-caption"
              required
            />
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_auto] items-end gap-1">
                <FormFields
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="addressZipCode"
                  label="주소"
                  placeholder="우편번호"
                  disabled
                  required
                />
                <CButton
                  buttonType="contained"
                  text="우편번호 찾기"
                  type="button"
                  className={`whitespace-nowrap ${form.formState.errors.addressZipCode ? 'mb-5' : 'mb-0'} flex-shrink-0`}
                  onClick={openAddressSearch}
                />
              </div>
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="addressDefault"
                placeholder="도로명 주소"
                disabled
              />

              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="addressDetail"
                placeholder="상세 주소"
              />
            </div>

            <FormFields
              fieldType={FormFieldType.RADIO}
              control={form.control}
              name="constGender"
              label="성별"
              required
              options={gender.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />

            <FormFields
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birth"
              label="생년월일"
              required
              mode={DateMode.DATE}
            />

            <FormFields
              fieldType={FormFieldType.RADIO}
              control={form.control}
              name="constJob"
              label="직업/역할"
              fieldClassName="flex-wrap gap-x-5 gap-y-2 flex-shrink-0 h-fit"
              placeholder="직업/역할 선택"
              required
              options={job.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />

            {/* *****************************************************************
             * 추가 정보 입력
             * ***************************************************************** */}
            <Accordion
              type="multiple"
              defaultValue={['accordion-1', 'accordion-2']}
              onValueChange={setOpenAccordions}
              value={openAccordions}
            >
              <AccordionItem value="accordion-1">
                <AccordionTrigger className="font-body2-bold mt-3 text-gray-700">
                  추가 정보 입력
                </AccordionTrigger>
                <AccordionContent className="space-y-5 pt-2">
                  <div className="font-caption flex items-center justify-start gap-2 rounded bg-gray-100 px-3 py-2 text-gray-500">
                    추가 정보를 모두 입력 시 서비스 내에서 사용하실 수 있는{' '}
                    {pointGuide?.data?.filter(
                      (item) => item.constPointConfigType === 'additional',
                    )[0]?.pointAmount || 50}
                    포인트를 드려요! 빠짐 없이 정보를 입력하셔야 포인트가
                    발급됩니다.
                  </div>
                  <FormFields
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    label="기관 구분"
                    name="additionalInfo.constOrganizationType"
                    placeholder="기관 구분 선택"
                    options={organizationType}
                  />
                  <FormFields
                    fieldType={FormFieldType.RADIO}
                    control={form.control}
                    name="additionalInfo.constAffiliationInputType"
                    label="기관명 입력 방식"
                    options={affiliationInputType}
                  />
                  <div className="grid grid-cols-[1fr_auto] items-end gap-1">
                    <FormFields
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="additionalInfo.affiliationName"
                      label="기관명"
                      placeholder={
                        affiliationInputTypeLabel === '기관검색'
                          ? '기관명 검색'
                          : '기관명 입력'
                      }
                      disabled={affiliationInputTypeLabel === '기관검색'}
                    />
                    {affiliationInputTypeLabel === '기관검색' && (
                      <InstitutionSearchModal
                        onSelectInstitution={(institutionName) => {
                          form.setValue(
                            'additionalInfo.affiliationName',
                            institutionName,
                          );
                        }}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 items-end gap-1">
                    <FormFields
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      label="기관 지역 정보"
                      name="additionalInfo.regionProvince"
                      placeholder="시/도"
                      options={
                        regionTree?.data
                          ? regionTree.data.map(
                              (item: { regionProvince: string }) => ({
                                label: item.regionProvince,
                                value: item.regionProvince,
                              }),
                            )
                          : []
                      }
                    />
                    <FormFields
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      label="/"
                      labelClassName="text-white"
                      name="additionalInfo.regionDistrict"
                      placeholder="시/군/구"
                      options={
                        regionTree?.data
                          ? regionTree.data
                              .find(
                                (item: { regionProvince: string }) =>
                                  item.regionProvince ===
                                  form.watch('additionalInfo.regionProvince'),
                              )
                              ?.regionDistricts.map((district: string) => ({
                                label: district,
                                value: district,
                              })) || []
                          : []
                      }
                      disabled={!form.watch('additionalInfo.regionProvince')}
                    />
                  </div>

                  <FormFields
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    label="설립 구분"
                    name="additionalInfo.constEstablishmentType"
                    placeholder="설립 구분 선택"
                    options={establishmentType}
                  />
                  <div>
                    <h1 className="font-body1-bold text-black">담당 업무</h1>
                    <p className="font-caption text-gray-500">
                      중복 선택할 수 있습니다.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
                      {responsibilityType
                        .filter((item) => item.label !== '기타(직접 입력)')
                        .map((item) => (
                          <FormFields
                            key={String(item.value)}
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name={`additionalInfo.responsibilityTypes`}
                            checkboxLabel={item.label}
                            checkboxValue={item.value}
                            id={`responsibility-${item.value}`}
                          />
                        ))}
                    </div>
                    <div className="mt-2 flex items-center justify-start gap-2">
                      {/* 기타 옵션 처리 */}
                      <FormFields
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="additionalInfo.responsibilityTypes"
                        checkboxLabel="기타"
                        labelClassName="shrink-0 mr-2"
                        checkboxValue="other_manual"
                        id="responsibility-other-manual"
                      />
                      <FormFields
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="additionalInfo.responsibilityTypeManual"
                        placeholder="직접 입력"
                        className="flex-1"
                        disabled={
                          !Array.isArray(
                            form.watch('additionalInfo.responsibilityTypes'),
                          ) ||
                          !form
                            .watch('additionalInfo.responsibilityTypes')
                            ?.includes('other_manual')
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="accordion-2">
                <AccordionTrigger className="font-body2-bold mt-8 text-gray-700">
                  기타 정보 입력
                </AccordionTrigger>
                <AccordionContent className="space-y-5 pt-2">
                  <div className="font-caption flex items-center justify-start gap-2 rounded bg-gray-100 px-3 py-2 text-gray-500">
                    기타 정보를 모두 입력 시 서비스 내에서 사용하실 수 있는{' '}
                    {pointGuide?.data?.filter(
                      (item) => item.constPointConfigType === 'extra',
                    )[0]?.pointAmount || 50}
                    포인트를 드려요! 빠짐 없이 정보를 입력하셔야 포인트가
                    발급됩니다.
                  </div>

                  <FormFields
                    fieldType={FormFieldType.RADIO}
                    control={form.control}
                    name="additionalInfo.constRegistrationPurpose"
                    label="가입 목적"
                    fieldClassName="gap-2 flex-col items-start justify-start h-fit"
                    options={
                      registrationPurpose && registrationPurpose.length > 0
                        ? registrationPurpose.map((item) => ({
                            label: item.label,
                            value: item.value,
                          }))
                        : []
                    }
                  />
                  <div>
                    <FormFields
                      fieldType={FormFieldType.RADIO}
                      control={form.control}
                      name="additionalInfo.constRegistrationSource"
                      label="가입 경로"
                      className="gap-x-2 gap-y-1"
                      options={
                        registrationSource && registrationSource.length > 0
                          ? registrationSource
                              .filter(
                                (item) => item.value !== 'acquaintance_input',
                              )
                              .map((item, index) => ({
                                label: item.label,
                                value: item.value,
                                id: `joinPath_${index}`,
                              }))
                          : []
                      }
                    />
                    <div className="mt-1 flex items-center justify-start gap-2">
                      <FormFields
                        fieldType={FormFieldType.RADIO}
                        control={form.control}
                        name="additionalInfo.constRegistrationSource"
                        options={[
                          { label: '지인', value: 'acquaintance_input' },
                        ]}
                      />

                      <FormFields
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="additionalInfo.registrationSourceManual"
                        placeholder="추천인 아이디 입력"
                        className="w-full"
                        disabled={
                          !form
                            .watch('additionalInfo.constRegistrationSource')
                            ?.includes('acquaintance_input')
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="pt-[60px]">
              <CButton text="가입 완료" type="submit" className="w-full" />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterStep3View;
