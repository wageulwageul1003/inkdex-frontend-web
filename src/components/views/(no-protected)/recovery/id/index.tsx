'use client';

import RecoveryForm from '../form';

import FindIdEmail from './_components/find-id-email';
import FindIdPhone from './_components/find-id-phone';
import { useContent } from './useContent';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RecoveryIdView = () => {
  const { tab, onChangeTab } = useContent();

  return (
    <div className="default-login-layout-content">
      <RecoveryForm item="아이디">
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
            <FindIdPhone />
          </TabsContent>

          {/* 이메일 인증 */}
          <TabsContent value="email">
            <FindIdEmail />
          </TabsContent>
        </Tabs>
      </RecoveryForm>
    </div>
  );
};

export default RecoveryIdView;
