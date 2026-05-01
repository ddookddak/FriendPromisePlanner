# 친구약속플래너 (FriendPromisePlanner)

로그인 없이 친구들과 만날 시간을 쉽게 정할 수 있는 가벼운 약속 조율 애플리케이션입니다. 이름을 입력하고, 약속 방을 만들고, 친구들을 초대하고, 모두가 만날 수 있는 시간을 찾아보세요.

🌐 **라이브 서비스:** [140.245.66.150:3000](http://140.245.66.150:3000)

---

## 주요 기능

- **회원가입 필요 없음** — 이름만 입력하면 바로 사용 가능
- **약속 방 만들기** — 날짜 범위와 설명을 입력하여 약속 방 생성
- **친구 초대** — 방 링크를 공유하면 누구나 이름으로 참여 가능
- **인터랙티브 캘린더** — 날짜별 참여자 현황을 시각적으로 표시
- **실시간 업데이트** — 다른 참여자들의 일정 변경 내용을 즉시 확인
- **방 관리** — 방 생성자는 상태 변경(모집 중 → 확정 → 마감) 및 삭제 가능
- **반응형 디자인** — PC, 태블릿, 모바일 모두에서 완벽히 작동

---

## 기술 스택

- **프론트엔드:** Next.js 14 (React 18), TypeScript, Tailwind CSS
- **백엔드:** Next.js API Routes
- **데이터베이스:** PostgreSQL + Prisma ORM
- **배포:** Docker on Oracle Cloud Free Tier

---

## 빠른 시작

### 필수 조건
- Node.js 18 이상
- PostgreSQL 데이터베이스 (개발 환경에서는 SQLite 가능)
- npm 또는 yarn

### 로컬 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone https://github.com/kdh19911031/FriendPromisePlanner.git
   cd FriendPromisePlanner
   ```

2. **패키지 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env.local
   ```
   `.env.local` 파일을 편집하여 `DATABASE_URL` 설정:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/friendpromiseplanner"
   ```

4. **데이터베이스 초기화**
   ```bash
   npx prisma db push
   ```

5. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 프로젝트 구조

```
FriendPromisePlanner/
├── app/                          # Next.js app 디렉토리
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 이름 입력 페이지 (홈)
│   ├── api/                     # API 라우트
│   │   ├── rooms/               # 방 CRUD 엔드포인트
│   │   ├── rooms-list/          # 모든 방 조회 엔드포인트
│   │   └── [roomId]/            # 특정 방 엔드포인트
│   └── (app)/                   # 앱 페이지 (인증 불필요)
│       ├── layout.tsx           # 헤더/네비게이션이 포함된 레이아웃
│       ├── dashboard/           # 방 목록 페이지
│       └── rooms/[roomId]/      # 방 상세 & 캘린더 페이지
├── components/
│   ├── calendar/                # 캘린더 관련 컴포넌트
│   │   ├── CalendarView.tsx     # 캘린더 메인 컨테이너
│   │   ├── CalendarGrid.tsx     # 그리드 레이아웃
│   │   ├── DayCell.tsx          # 개별 날짜 셀
│   │   └── ParticipantPanel.tsx # 참여자 목록
│   ├── room/                    # 방 관련 컴포넌트
│   │   ├── RoomCard.tsx         # 방 목록 카드
│   │   ├── JoinRoomButton.tsx   # 방 참여 버튼
│   │   ├── DeleteRoomButton.tsx # 방 삭제 버튼
│   │   ├── RoomStatusBadge.tsx  # 상태 표시/변경
│   │   └── CopyLinkButton.tsx   # 링크 공유 버튼
│   └── NicknameEntry.tsx        # 이름 입력 컴포넌트
├── lib/
│   ├── prisma.ts               # Prisma 클라이언트
│   └── utils.ts                # 유틸리티 함수
├── prisma/
│   └── schema.prisma           # 데이터베이스 스키마
└── public/                     # 정적 파일
```

---

## 데이터베이스 스키마

### Room (약속 방)
여러 사람의 일정을 조율하기 위한 공간입니다.
- `id`: 고유 ID
- `title`: 방 이름
- `description`: 약속에 대한 설명
- `startDate`, `endDate`: 일정 조율 기간
- `createdBy`: 방 생성자의 이름
- `status`: "OPEN" (참여 모집중), "CONFIRMED" (확정), "CLOSED" (마감)
- `participants`: 참여 인원 목록
- `schedules`: 모든 일정 선택 기록

### Participant (참여자)
누가 어느 방에 참여했는지 기록합니다.
- `id`: 고유 ID
- `name`: 참여자 이름
- `roomId`: 참여한 방
- `joinedAt`: 참여 시간
- 고유 제약: `(name, roomId)` — 한 방에 같은 이름 불가

### Schedule (일정)
각 참여자가 가능한 날짜를 기록합니다.
- `id`: 고유 ID
- `participantId`: 참여자 정보
- `date`: 가능한 날짜
- `createdAt`: 선택한 시간
- 고유 제약: `(participantId, roomId, date)` — 참여자당 날짜별 1개만

---

## API 엔드포인트

### 방 관련
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/rooms-list` | 모든 방 조회 |
| POST | `/api/rooms` | 새 방 생성 |
| GET | `/api/rooms/[roomId]` | 방 상세 조회 |
| DELETE | `/api/rooms/[roomId]` | 방 삭제 (생성자만) |
| PATCH | `/api/rooms/[roomId]/status` | 방 상태 변경 |

### 참여자 관련
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| POST | `/api/rooms/[roomId]/join` | 방 참여 |

### 일정 관련
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/rooms/[roomId]/schedules` | 방의 모든 일정 조회 |
| PUT | `/api/rooms/[roomId]/schedules` | 가능 날짜 추가/제거 |

---

## 사용 흐름

1. **앱 접속** → 이름 입력 화면
2. **이름 입력** → 브라우저에 저장됨
3. **방 목록 확인** → 대시보드에서 활성화된 약속 방 목록
4. **방 생성** → 제목, 날짜 범위, 설명 입력
5. **방 참여** → 클릭하여 참여자 등록
6. **일정 선택** → 캘린더에서 가능한 날짜 클릭
7. **결과 확인** → 히트맵으로 모두가 가능한 날짜 확인
8. **방 생성자가 확정** → 상태를 "확정"으로 변경

---

## 개발 가이드

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 린트 검사
```bash
npm run lint
```

### 데이터베이스 스키마 업데이트
```bash
npx prisma db push      # 안전한 변경 적용
npx prisma generate    # Prisma 클라이언트 재생성
```

### 데이터베이스 GUI로 확인 (선택)
```bash
npx prisma studio
```

---

## 배포

### Docker로 배포
`docker-compose.yml`이 포함되어 있어 PostgreSQL과 함께 쉽게 배포 가능합니다:

```bash
docker compose up -d
```

실행 내용:
- Next.js 애플리케이션 (포트 3000)
- PostgreSQL 데이터베이스
- 자동 스키마 마이그레이션

### 환경 변수
`.env` 또는 `docker-compose.yml`에서 설정:
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `NODE_ENV`: 배포 환경에서는 "production"

### 주의사항
- 이름은 `localStorage`에 저장됨 (브라우저별로 별도 관리)
- 서버 세션이나 쿠키 없음
- 방 생성자는 이름으로 식별
- 모든 날짜는 UTC로 저장되며 사용자 시간대에 맞게 표시됨

---

## 설계 결정사항

**왜 인증 기능이 없을까?**
- 더 간단하고 빠른 사용 시작
- 비밀번호 관리나 보안 오버헤드 제거
- 소규모 그룹 링크 공유에 최적화
- 이 용도에는 이름 식별이 충분함

**왜 회원가입 대신 이름만 사용할까?**
- 로그인/회원가입 과정 제거
- 브라우저에 이름 저장하여 별도 서버 세션 불필요
- 임시 약속 조율에 최적화
- 휴대폰 번호나 닉네임으로도 사용 가능

**왜 실시간 기능(WebSocket)을 안 쓸까?**
- 일반 fetch 방식이 더 간단함
- 배포 복잡도 감소 (소켓 서버 불필요)
- 약속 조율 용도에는 충분한 속도

---

## 문제 해결

**"앱에 접속할 수 없어요"**
- PostgreSQL이 실행 중인지 확인
- `DATABASE_URL`이 올바른지 확인
- `npx prisma db push` 실행하여 스키마 동기화

**"내 변경사항이 저장되지 않아요"**
- 브라우저 저장소 삭제 후 재시도 (`F12` → Application → Local Storage)
- 개발자도구 콘솔에서 API 에러 확인

**"방을 만들 수 없어요"**
- 이름이 저장되었는지 확인 (localStorage 확인)
- DevTools 네트워크 탭에서 요청 실패 여부 확인

---

## 라이선스

ISC

---

## 기여하기

버그 리포트, 기능 요청, PR을 환영합니다.  
[GitHub 이슈](https://github.com/kdh19911031/FriendPromisePlanner/issues)에 등록해주세요.

---

## 지원

문제가 있거나 궁금한 점이 있으시면:  
[GitHub 이슈](https://github.com/kdh19911031/FriendPromisePlanner/issues)
