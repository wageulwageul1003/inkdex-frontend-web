# hook

## 목표

- 훅 구현 스타일을 일관되게 유지
- 쿼리 키/캐시 무효화 누락으로 인한 UI 불일치 방지
- 타입 안정성과 재사용성 강화

## 공통 규칙

1. 기존 파일 패턴을 우선 유지한다.
2. `react-query` 훅의 `queryKey`는 `@/constants/queryKeys` 상수를 사용한다.
3. mutation 성공 시, 실제 화면에서 사용하는 쿼리까지 함께 invalidate 한다.
4. API 함수는 훅 외부에 분리하고, 훅에서는 `useQuery`/`useMutation`만 구성한다.
5. 파라미터/응답 타입은 명시적으로 선언한다.
6. 불필요한 사이드 이펙트, 과한 추상화는 피한다.

## Query 훅 가이드

- 쿼리 키 형식은 기존 패턴(`['key', params]`)을 따르고 임의 변경하지 않는다.
- 페이지네이션 훅은 `page` 변환(1-based -> 0-based) 로직을 기존 방식대로 맞춘다.
- `select`를 사용할 때는 화면에서 필요한 형태만 반환한다.

## Mutation 훅 가이드

- `onSuccess`에서 다음을 점검한다:
  - 직접 관련 키 invalidate
  - 해당 데이터를 소비하는 리스트/상세 쿼리 invalidate
- 낙관적 업데이트를 사용할 경우 실패 시 롤백을 반드시 구현한다.

## 에러 처리

- `onError`는 최소한 타입을 유지하고, 사용자 피드백이 필요한 경우 호출부에서 처리한다.
- 에러를 삼키지 말고 디버깅 가능한 형태를 유지한다.

## 네이밍

- 파일명: `useGetXxx`, `usePostXxx`, `useDeleteXxx` 패턴 유지
- API 함수명: 훅명에서 `use` 제거한 동사형(`GetXxx`, `postXxx`, `deleteXxx`) 유지

## 변경 범위

- 이 규칙의 범위는 `src/hooks` 전체다.
- 더 하위 디렉터리에 별도 `AGENTS.md`가 있으면 하위 문서가 우선한다.
