'use client';

import RecoveryForm from '../form';

import FindPasswordEmail from './_components/find-passowrd-email';
import FindPasswordPhone from './_components/find-password-phone';
import { useContent } from './useContent';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RecoveryPasswordView = () => {
  const { tab, onChangeTab } = useContent();

  return (
    <div className="default-login-layout-content">
      <RecoveryForm item="비밀번호">
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="no-scrollbar flex whitespace-nowrap">
            <TabsTrigger value="phone" className="flex-1">
              휴대폰 인증
            </TabsTrigger>
            <TabsTrigger value="email" className="flex-1">
              이메일 인증
            </TabsTrigger>
          </TabsList>

          {/* 휴대폰 인증 */}
          <TabsContent value="phone">
            <FindPasswordPhone />
          </TabsContent>

          {/* 이메일 인증 */}
          <TabsContent value="email">
            <FindPasswordEmail />
          </TabsContent>
        </Tabs>
      </RecoveryForm>
    </div>
  );
};

export default RecoveryPasswordView;
