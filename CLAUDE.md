# FriendPromisePlanner

## 프로젝트 개요

Next.js 14 (App Router) + Prisma 5 + SQLite(개발) + PostgreSQL(운영) + NextAuth.js 4 + Tailwind CSS 3 스택으로 구현된 친구 약속 조율 플래너입니다.

친구들과 만날 시간을 쉽게 정할 수 있는 폐쇄형 회원 시스템의 약속 플래너로, 히트맵 달력을 통한 일정 조율 기능을 제공합니다.

## 프로젝트 특이사항

- **폴더명 대문자 문제**: FriendPromisePlanner 폴더명 때문에 create-next-app 직접 실행 불가 → 수동으로 파일 생성
- **SQLite enum 미지원**: schema.prisma에서 enum을 String 타입으로 처리
- **운영 배포**: docker-compose.yml + PostgreSQL 사용
- **초기 관리자 계정**: admin@example.com / adminpassword123 (seed)
- **개발 서버**: http://localhost:3000 (포트 사용 중이면 3001)

## 개발 협업 규칙

### 문서 언어
모든 프로젝트 문서(README, 가이드, 주석 등)는 반드시 **한국어**로 작성하세요.
- 대상: README.md, 개발 가이드, 사용자 설명서
- API 및 코드 주석은 영어 사용 가능

### 커밋 메시지
커밋 메시지에는 `Co-Authored-By` 문구를 포함하지 마세요. 순수한 커밋 메시지만 작성해주세요.
