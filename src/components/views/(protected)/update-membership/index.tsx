'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// 담당 업무 타입 정의
interface ResponsibilityTypeItem {
  constResponsibilityType: string;
  responsibilityTypeManual: string | null | undefined;
}

import {
  registerStep3Schema,
  TRegisterStep3Schema,
} from '../../(no-protected)/register/schema';
import InstitutionSearchModal from '../../(no-protected)/register/step3/_components/InstitutionSearchModal';
import { useTermModal } from '../../../../hooks/terms/useTermModal';

import UpdatePhoneDialog from './_components/UpdatePhone';
import UpdatePwdDialog from './_components/UpdatePwd';

import CButton from '@/components/shared/CButton';
import CIconButton from '@/components/shared/IconButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import AddressSearchModal from '@/components/shared/modals/AddressSearchModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { useGetMyInfoDetail } from '@/hooks/auth/mypage/useGetMyInfoDetail';
import { usePatchRegister } from '@/hooks/auth/mypage/usePatchRegister';
import { useGetPointIntroduce } from '@/hooks/point/useGetPointIntroduce';
import { useAlert } from '@/hooks/useAlert';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
import { useGetRegionTree } from '@/hooks/useGetRegionTree';

const UpdateMembershipView: React.FC = () => {
  const router = useRouter();
  const alert = useAlert();
  const { mutateAsync: patchRegister } = usePatchRegister();
  const { data: myInfoDetail } = useGetMyInfoDetail();
  const { data: pointGuide } = useGetPointIntroduce();
  const [openAccordions, setOpenAccordions] = useState<string[]>([
    'accordion-1',
    'accordion-2',
  ]);

  // 약관 모달 훅 사용
  const { handleTermsModal } = useTermModal();

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
      isPersonalTermAgree: true,
      isMarketingEmailAgree: true,
      isMarketingSmsAgree: true,
      phone: '',
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
        constAffiliationInputType: '',
        affiliationName: '',
        regionProvince: '',
        regionDistrict: '',
        constEstablishmentType: '',
        additionalInfoExtendInfo: [],
        constRegistrationPurpose: '',
        registrationPurposeManual: '',
        constRegistrationSource: '',
        registrationSourceManual: '',
      },
    },
  });

  // 시/도와 시/군/구 설정을 위한 별도의 useEffect
  useEffect(() => {
    if (myInfoDetail?.additionalInfo?.regionProvince) {
      // 시/도 설정
      form.setValue(
        'additionalInfo.regionProvince',
        myInfoDetail.additionalInfo.regionProvince,
      );

      // 시/도 설정 후 약간의 지연을 두고 시/군/구 설정
      setTimeout(() => {
        if (myInfoDetail?.additionalInfo?.regionDistrict) {
          form.setValue(
            'additionalInfo.regionDistrict',
            myInfoDetail.additionalInfo.regionDistrict,
          );
        }
      }, 100);
    }
  }, [myInfoDetail, form]);

  useEffect(() => {
    if (myInfoDetail) {
      form.setValue('password', 'ahapsxl1!');
      form.setValue(
        'isMarketingEmailAgree',
        myInfoDetail?.isMarketingEmailAgree,
      );
      form.setValue('isMarketingSmsAgree', myInfoDetail?.isMarketingSmsAgree);
      form.setValue('isPersonalTermAgree', myInfoDetail?.isPersonalTermAgree);
      form.setValue(
        'marketing',
        myInfoDetail?.isMarketingEmailAgree ||
          myInfoDetail?.isMarketingSmsAgree,
      );
      form.setValue('phone', myInfoDetail?.phone);
      form.setValue('constMemberType', myInfoDetail?.constMemberType);
      form.setValue('account', myInfoDetail?.account);
      form.setValue('name', myInfoDetail?.name);
      form.setValue('nickName', myInfoDetail?.nickName);
      form.setValue('email', myInfoDetail?.email);
      form.setValue('addressZipCode', myInfoDetail?.addressZipCode);
      form.setValue('addressDefault', myInfoDetail?.addressDefault);
      form.setValue('addressDetail', myInfoDetail?.addressDetail);
      form.setValue('constGender', myInfoDetail?.constGender);
      form.setValue('birth', new Date(myInfoDetail?.birth));
      form.setValue('constJob', myInfoDetail?.constJob);
      form.setValue(
        'additionalInfo.constOrganizationType',
        myInfoDetail?.additionalInfo?.constOrganizationType,
      );
      form.setValue(
        'additionalInfo.constAffiliationInputType',
        myInfoDetail?.additionalInfo?.constAffiliationInputType,
      );
      form.setValue(
        'additionalInfo.affiliationName',
        myInfoDetail?.additionalInfo?.affiliationName,
      );
      // 시/도와 시/군/구는 별도의 useEffect에서 처리
      form.setValue(
        'additionalInfo.constEstablishmentType',
        myInfoDetail?.additionalInfo?.constEstablishmentType,
      );
      form.setValue(
        'additionalInfo.additionalInfoExtendInfo',
        myInfoDetail?.additionalInfo?.additionalInfoExtendInfo,
      );
      form.setValue(
        'additionalInfo.constRegistrationPurpose',
        myInfoDetail?.additionalInfo?.constRegistrationPurpose,
      );
      form.setValue(
        'additionalInfo.registrationPurposeManual',
        myInfoDetail?.additionalInfo?.registrationPurposeManual,
      );
      form.setValue(
        'additionalInfo.constRegistrationSource',
        myInfoDetail?.additionalInfo?.constRegistrationSource,
      );
      form.setValue(
        'additionalInfo.registrationSourceManual',
        myInfoDetail?.additionalInfo?.registrationSourceManual,
      );

      // 담당 업무 초기화
      if (
        myInfoDetail?.additionalInfo?.additionalInfoExtendInfo &&
        myInfoDetail.additionalInfo.additionalInfoExtendInfo.length > 0
      ) {
        // 담당 업무 체크박스 값 설정
        const responsibilityTypes =
          myInfoDetail.additionalInfo.additionalInfoExtendInfo.map(
            (item: ResponsibilityTypeItem) => item.constResponsibilityType,
          );
        // 담당 업무 체크박스 값 설정 - 필드 경로 수정
        form.setValue(
          'additionalInfo.responsibilityTypes',
          responsibilityTypes,
        );

        // 기타(직접 입력) 값이 있는지 확인하고 설정
        const manualItem =
          myInfoDetail.additionalInfo.additionalInfoExtendInfo.find(
            (item: ResponsibilityTypeItem) =>
              item.constResponsibilityType === 'other_manual',
          );

        if (manualItem && manualItem.responsibilityTypeManual) {
          // 기타 입력 필드 값 설정 - 필드 경로 수정
          form.setValue(
            'additionalInfo.responsibilityTypeManual',
            manualItem.responsibilityTypeManual,
          );
        }
      }
    }
  }, [myInfoDetail, form]);

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

      const data = await patchRegister(updatedValues as TRegisterStep3Schema);
      if (data.code === 2000) {
        toast.success('회원정보가 성공적으로 업데이트되었습니다.');
        router.push('/mypage');
      }
    } catch (error) {
      console.error('회원정보 업데이트 실패:', error);
      toast.error('회원정보 업데이트 중 오류가 발생했습니다.');
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

  // 기관명 입력 방식 변경될 때마다 기관명 입력 필드 초기화
  useEffect(() => {
    if (form.watch('additionalInfo.constAffiliationInputType') === 'search') {
      form.setValue('additionalInfo.affiliationName', '');
    } else {
      form.setValue(
        'additionalInfo.affiliationName',
        myInfoDetail?.additionalInfo?.affiliationName,
      );
    }
  }, [form.watch('additionalInfo.constAffiliationInputType')]);

  // 가입 경로 변경될 때마다 가입 경로 입력 필드 초기화
  useEffect(() => {
    if (
      form.watch('additionalInfo.constRegistrationSource') ===
      'acquaintance_input'
    ) {
      form.setValue(
        'additionalInfo.registrationSourceManual',
        myInfoDetail?.additionalInfo?.registrationSourceManual,
      );
    } else {
      form.setValue('additionalInfo.registrationSourceManual', '');
    }
  }, [form.watch('additionalInfo.constRegistrationSource')]);

  return (
    <div className="default-login-layout-content">
      <div className="flex items-start gap-4">
        <CIconButton
          buttonType="only"
          size="small"
          icon={
            <Icons.arrow_left_alt className="h-m w-m shrink-0 fill-gray-700" />
          }
          onClick={() => router.back()}
        />
        <h1 className="font-title-bold">회원정보 변경</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-8 w-full space-y-5"
        >
          <h1 className="font-body2-bold border-b border-gray-200 py-1 text-gray-700">
            기본 정보
          </h1>

          <dl>
            <dt className="font-body1-bold mb-2 text-black">휴대번호</dt>
            <dd className="font-body1-bold text-gray-500">
              {form
                .watch('phone')
                .replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')}
            </dd>
            <UpdatePhoneDialog />
          </dl>
          <dl>
            <dt className="font-body1-bold mb-2 text-black">아이디</dt>
            <dd className="font-body1-bold text-gray-500">
              {form.watch('account')}
            </dd>
          </dl>

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

          <FormFields
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="이름"
            placeholder="이름를 입력해주세요"
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
          <div>
            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              className="[&>fieldset>button]:hidden"
              required
              disabled
            />
            <UpdatePwdDialog />
          </div>
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
                className="flex-shrink-0 whitespace-nowrap"
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
          />

          <FormFields
            fieldType={FormFieldType.RADIO}
            control={form.control}
            name="constJob"
            label="직업/역할"
            fieldClassName="flex-wrap gap-x-5 gap-y-2 flex-shrink-0 h-fit"
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
                        ? regionTree.data.map((item) => ({
                            label: item.regionProvince,
                            value: item.regionProvince,
                          }))
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
                              (item) =>
                                item.regionProvince ===
                                form.watch('additionalInfo.regionProvince'),
                            )
                            ?.regionDistricts.map((district) => ({
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
                      options={[{ label: '지인', value: 'acquaintance_input' }]}
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

          <h1 className="font-body2-bold border-b border-gray-200 py-1 text-gray-700">
            서비스 동의
          </h1>

          <div className="flex flex-col gap-2">
            <FormFields
              key={'isPersonalTermAgree'}
              id={'isPersonalTermAgree'}
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name={'isPersonalTermAgree'}
              checkboxLabel={
                <div className="flex w-full items-center justify-between">
                  <span className={`font-body1`}>
                    개인정보 제 3자 제공 내역
                  </span>
                  <CIconButton
                    buttonType="only"
                    size="small"
                    icon={
                      <Icons.keyboard_arrow_right className="h-m w-m fill-gray-700" />
                    }
                    type="button"
                    onClick={() =>
                      handleTermsModal(
                        '개인정보 제 3자 제공 내역',
                        'personal_information_third',
                      )
                    }
                  />
                </div>
              }
              checkboxValue={true}
            />

            <FormFields
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="marketing"
              id="marketing"
              checkboxLabel={
                <div className="flex w-full items-center justify-between">
                  <span className={`font-body1`}>마케팅 및 광고 활용 동의</span>

                  <CIconButton
                    buttonType="only"
                    size="small"
                    icon={
                      <Icons.keyboard_arrow_right className="h-m w-m fill-gray-700" />
                    }
                    type="button"
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
          </div>

          <div className="space-y-2">
            <CButton text="수정" type="submit" className="w-full" />
            <CButton
              text="취소"
              type="button"
              buttonType="outlined"
              className="w-full"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateMembershipView;
