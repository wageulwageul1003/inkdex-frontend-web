import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CCheckbox from '@/components/shared/CCheckbox';
import CTextButton from '@/components/shared/CTextButton';
import { Icons } from '@/components/shared/icons';
import { DeleteSignOut } from '@/hooks/auth/mypage/useDeleteSignOut';
import { useAlert } from '@/hooks/useAlert';
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/providers/auth';

const SignOut = () => {
  const { logout } = useAuth();

  const confirm = useAlert();
  const term = useModal();
  const deletedConfirm = useAlert();
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    term.updateConfig('signOut', {
      confirmButton: {
        disabled: !isChecked,
      },
    });
  }, [isChecked]);

  const handleSignOut = () => {
    confirm({
      icon: 'info',
      title: '정말 탈퇴하시겠습니까?',
      description: (
        <p className="font-body1 mt-2 text-center text-gray-500">
          탈퇴를 원하실 경우, 아래의 ‘탈퇴하기' 버튼을 클릭해 주세요.
        </p>
      ),
      confirmText: '탈퇴하기',
      cancelText: '닫기',
      onConfirm: () => {
        term({
          id: 'signOut',
          title: '회원 탈퇴 유의사항 안내',
          description: (
            <div className="font-body1 text-gray-500">
              <h4 className="font-body1 text-gray-700">[탈퇴회원 관리 기준]</h4>
              <p className="font-body1 mb-2 text-gray-500">
                (탈퇴 회원 정보 1년 보관, 결제 및 대금 정산 관련 정보는 5년
                보관)
              </p>
              <p className="font-body1 text-gray-700">
                · 내부 방침에 의한 정보보유 사유
              </p>
              <p className="font-body1 text-gray-500">
                - 보존 항목: 아이디(휴대전화번호), 이메일, 탈퇴사유, 탈퇴일
                <br />
                - 보존 근거: 서비스 이용의 혼선 방지, 불법적 사용자에 대한 관련
                기관 수사 협조
                <br />- 보존 기간: 1년
              </p>
              <p className="font-body1 text-gray-500">
                (1) 계약 또는 청약철회 등에 관한 기록
                <br />
                - 보존 근거: 전자상거래 등에서의 소비자보호에 관한 법률
                <br />- 보존 기간: 5년
              </p>
              <p className="font-body1 text-gray-500">
                (2) 대금결제 및 재화 등의 공급에 관한 기록
                <br />
                - 보존 근거: 전자상거래 등에서의 소비자보호에 관한 법률
                <br />- 보존 기간: 5년
              </p>
              <p className="font-body1 text-gray-500">
                (3) 소비자의 불만 또는 분쟁처리에 관한 기록
                <br />
                - 보존 근거: 전자상거래 등에서의 소비자보호에 관한 법률
                <br />- 보존 기간: 3년
              </p>
              <p className="font-body1 text-gray-500">
                (4) 본인 확인에 관한 기록
                <br />
                - 보존 근거: 정보통신망 이용촉진 및 정보보호 등에 관한 법률
                <br />- 보존 기간: 6개월
              </p>
              <p className="font-body1 text-gray-500">
                (5) 웹사이트 방문기록
                <br />
                - 보존 근거: 통신비밀보호법
                <br />- 보존 기간: 3개월
              </p>

              <div className="mt-4 flex flex-row items-center gap-2">
                <CCheckbox
                  defaultChecked={isChecked}
                  onToggle={(checked) => {
                    setIsChecked(checked);
                  }}
                />
                <span className="font-body1 text-gray-700">
                  위 내용을 모두 확인했습니다.
                </span>
              </div>
            </div>
          ),
          confirmText: '탈퇴하기',
          confirmButton: {
            disabled: !isChecked,
          },
          cancelText: '닫기',
          onConfirm: async () => {
            const result = await DeleteSignOut();
            if (result.code === 2000) {
              deletedConfirm({
                title: '탈퇴가 완료되었습니다.',
                description: (
                  <p className="font-body1 mt-2 text-center text-gray-500">
                    회원 정보는 관련 법령 및 운영 방침에 따라 일정 기간
                    보관되며, 이후 안전하게 삭제됩니다.
                  </p>
                ),
                confirmText: '메인으로',
                onConfirm: () => {
                  logout();
                  router.push('/');
                },
                cancelButton: null,
              });
            }
          },
        });
      },
    });
  };

  return (
    <div className="mt-2">
      <CTextButton
        text="회원 탈퇴"
        iconPosition="right"
        icon={
          <Icons.keyboard_arrow_right className="h-xs w-xs text-gray-500" />
        }
        onClick={handleSignOut}
        className="cursor-pointer py-3"
      />
    </div>
  );
};

export default SignOut;
