import { NextRequest, NextResponse } from 'next/server';

/**
 * 푸시 알림 구독 엔드포인트
 * 클라이언트에서 받은 PushSubscription 객체를 데이터베이스에 저장
 */
export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    // TODO: 데이터베이스에 구독 정보 저장
    // await db.pushSubscription.create({
    //   data: {
    //     endpoint: subscription.endpoint,
    //     keys: subscription.keys,
    //     userId: session.user.id, // 인증된 사용자 ID
    //   },
    // });

    console.log('Push subscription received:', subscription);

    return NextResponse.json(
      { success: true, message: '푸시 알림 구독이 완료되었습니다.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { success: false, message: '구독 저장 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
