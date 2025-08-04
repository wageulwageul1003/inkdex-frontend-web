'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import CTextButton from '../../../shared/CTextButton';

import { ILogin, loginSchema, TLoginSchema } from './schema';

import CButton from '@/components/shared/CButton';
import { LoginCarousel } from '@/components/shared/carousel-handler/login-carousel';
import { useHandleCarousel } from '@/components/shared/carousel-handler/useHandleCarousel';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { useLogin } from '@/hooks/auth/useLogin';
import { useGetBannerList } from '@/hooks/banner/useGetBannerList';
import { useAuth } from '@/providers/auth';
import { IBanner } from '@/types/banner';

const LoginView = () => {
  const router = useRouter();
  const { mutateAsync: post } = useLogin();
  const { data: loginBanners } = useGetBannerList('banner_login');
  const { checkAuth, isLoggedIn } = useAuth();
  const { scrollPrev, scrollNext, current, setApi } = useHandleCarousel();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      account: '',
      password: '',
      saveAccount: null,
    },
  });
  const { formState, handleSubmit } = form;

  const onSubmit = async (values: TLoginSchema) => {
    const response = await post(values as ILogin);
    const eightHours = 8 * 60 * 60 * 1000;
    Cookies.set('bookseed-user-accessToken', response.data.accessToken, {
      expires: new Date(Date.now() + eightHours),
    });
    Cookies.set('bookseed-admin-role', response.data.role, {
      expires: new Date(Date.now() + eightHours),
    });

    // Update auth state before navigation
    checkAuth();

    toast.success('로그인 되었습니다.');

    if (isLoggedIn) {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <div className="default-login-layout-content">
      <p className="font-subtitle-bold">책씨앗에 오신 것을</p>
      <p className="font-subtitle-bold">환영합니다!</p>
      <p className="font-caption mt-2 text-gray-400">
        로그인하고 서비스를 이용해 보세요.
      </p>

      <div className="mt-8">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col gap-5">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="account"
                label="아이디"
                placeholder="아이디 입력"
              />

              <FormFields
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="비밀번호"
                placeholder="비밀번호 입력"
              />

              <div className="flex items-center justify-end">
                {/* <FormFields
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="saveAccount"
                  checkboxLabel="아이디 저장"
                  checkboxValue="true"
                /> */}
                <div className="flex items-center gap-2">
                  <CTextButton
                    type="button"
                    text="아이디 찾기"
                    onClick={() => router.push(`/recovery/id`)}
                  />
                  <div className="h-3 w-[1px] bg-gray-200" />
                  <CTextButton
                    type="button"
                    text="비밀번호 찾기"
                    onClick={() => router.push(`/recovery/password`)}
                  />
                </div>
              </div>

              <div className="mt-[80px]">
                <CButton
                  buttonType="contained"
                  text="로그인"
                  type="submit"
                  className={`w-full rounded bg-gray-700 px-4 py-2 text-white`}
                  // disabled={!formState.isValid}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>

      <CButton
        buttonType="subtle"
        text="회원가입"
        className={`mt-2 w-full rounded bg-white px-4 py-2 text-gray-500`}
        onClick={() => router.push('/register')}
      />

      {loginBanners && (
        <div className="mt-[56px]">
          <LoginCarousel
            data={loginBanners.data.map((item: IBanner) => {
              return {
                url: item.imageFile.link,
                title: item.title,
                isNewTab: item.isNewTab,
                link: item.link,
              };
            })}
            setApi={setApi}
            scrollPrev={scrollPrev}
            scrollNext={scrollNext}
            current={current}
          />
        </div>
      )}
    </div>
  );
};

export default LoginView;
