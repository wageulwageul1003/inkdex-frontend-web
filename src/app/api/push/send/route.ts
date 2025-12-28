import { NextRequest, NextResponse } from 'next/server';

/**
 * 푸시 알림 전송 엔드포인트
 * 서버에서 저장된 구독 정보를 사용하여 푸시 알림 전송
 *
 * 사용하려면 web-push 패키지 설치 필요:
 * npm install web-push
 *
 * VAPID 키 생성:
 * npx web-push generate-vapid-keys
 */
export async function POST(request: NextRequest) {
  try {
    const { title, body, userId, data } = await request.json();

    // TODO: web-push 패키지를 사용하여 푸시 알림 전송
    // const webpush = require('web-push');
    //
    // webpush.setVapidDetails(
    //   'mailto:your-email@example.com',
    //   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    //   process.env.VAPID_PRIVATE_KEY!
    // );
    //
    // // 데이터베이스에서 사용자의 구독 정보 조회
    // const subscriptions = await db.pushSubscription.findMany({
    //   where: userId ? { userId } : {},
    // });
    //
    // const payload = JSON.stringify({
    //   title,
    //   body,
    //   icon: '/icons/notification-icon.png',
    //   badge: '/icons/badge-icon.png',
    //   data: data || {},
    // });
    //
    // // 모든 구독자에게 푸시 알림 전송
    // const sendPromises = subscriptions.map((subscription) =>
    //   webpush.sendNotification(
    //     {
    //       endpoint: subscription.endpoint,
    //       keys: subscription.keys,
    //     },
    //     payload
    //   )
    // );
    //
    // await Promise.all(sendPromises);

    console.log('Push notification send request:', { title, body, userId });

    return NextResponse.json(
      {
        success: true,
        message: '푸시 알림이 전송되었습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { success: false, message: '푸시 알림 전송 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
