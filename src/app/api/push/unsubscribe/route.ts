import { NextRequest, NextResponse } from 'next/server';

/**
 * 푸시 알림 구독 해제 엔드포인트
 * 클라이언트에서 받은 PushSubscription 객체를 데이터베이스에서 삭제
 */
export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    // TODO: 데이터베이스에서 구독 정보 삭제
    // await db.pushSubscription.delete({
    //   where: {
    //     endpoint: subscription.endpoint,
    //   },
    // });

    console.log('Push unsubscription received:', subscription);

    return NextResponse.json(
      { success: true, message: '푸시 알림 구독이 해제되었습니다.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json(
      { success: false, message: '구독 해제 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
