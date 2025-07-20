# LimeFilter - 디지털 미디어 저작 도구

React Native(Expo)를 사용한 크로스 플랫폼 디지털 미디어 콘텐츠(영상, 그래픽 등) 기반 저작 도구입니다.

## 🚀 주요 기능

### 📱 크로스 플랫폼 지원
- iOS, Android, Web 지원
- Expo를 통한 빠른 개발 및 배포

### 🎨 실시간 이미지 필터링
- **Skia** 기반 고성능 그래픽 렌더링
- **React Native Reanimated**를 활용한 부드러운 애니메이션
- 실시간 필터 적용 및 미리보기

### 🎛️ 다양한 필터 효과
- **색상 조정**: 밝기, 대비, 채도, 색조
- **효과 필터**: 흑백, 세피아, 반전, 빈티지
- **블러 효과**: 가변 강도 블러 적용
- **선명도 조정**: 이미지 선명도 개선

### 📁 미디어 관리
- 갤러리 접근 및 미디어 파일 로드
- 이미지 및 비디오 지원
- 파일 정보 표시 (크기, 해상도, 재생 시간)

### 🎯 사용자 경험
- 직관적인 터치 기반 인터페이스
- 실시간 슬라이더 조정
- 다크 테마 지원
- 성능 최적화된 렌더링

## 🛠️ 기술 스택

### 핵심 기술
- **React Native (Expo)** - 크로스 플랫폼 개발
- **TypeScript** - 타입 안전성
- **@shopify/react-native-skia** - 고성능 그래픽 렌더링
- **react-native-reanimated** - 네이티브 애니메이션

### 미디어 처리
- **expo-av** - 오디오/비디오 재생
- **expo-camera** - 카메라 접근
- **expo-media-library** - 갤러리 접근
- **expo-image-picker** - 이미지 선택

### UI/UX
- **react-native-gesture-handler** - 제스처 처리
- **expo-linear-gradient** - 그라데이션 효과
- **expo-blur** - 블러 효과
- **expo-haptics** - 햅틱 피드백

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 16 이상
- Expo CLI
- iOS Simulator 또는 Android Emulator (선택사항)

### 설치
```bash
# 의존성 설치
npm install

# Expo 개발 서버 시작
npm start

# 또는 특정 플랫폼으로 실행
npm run ios
npm run android
npm run web
```

### 권한 설정
앱이 다음 권한을 요청합니다:
- **갤러리 접근**: 미디어 파일 로드
- **카메라 접근**: 사진/비디오 촬영
- **저장소 접근**: 편집된 파일 저장

## 🎨 사용법

### 1. 미디어 선택
- 홈 화면에서 갤러리의 사진이나 비디오를 선택
- 여러 파일을 동시에 선택 가능

### 2. 편집 모드
- 선택한 미디어로 편집 화면 진입
- 좌우 스와이프로 다른 미디어 간 이동

### 3. 필터 적용
- 하단의 필터 버튼을 터치하여 활성화
- 슬라이더를 드래그하여 필터 강도 조정
- 실시간으로 변경사항 확인

### 4. 저장
- 편집 완료 후 저장 버튼 터치
- 갤러리에 편집된 파일 저장

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── MediaItem.tsx    # 미디어 아이템 표시
│   ├── FilteredImage.tsx # Skia 기반 필터 적용
│   └── FilterSlider.tsx # 필터 조정 슬라이더
├── screens/             # 화면 컴포넌트
│   ├── HomeScreen.tsx   # 메인 홈 화면
│   └── EditorScreen.tsx # 편집 화면
├── hooks/               # 커스텀 훅
│   └── useMediaLibrary.ts # 미디어 라이브러리 관리
├── utils/               # 유틸리티 함수
│   └── mediaUtils.ts    # 미디어 파일 처리
├── constants/           # 상수 정의
│   ├── colors.ts        # 색상 테마
│   └── filters.ts       # 필터 정의
└── types/               # TypeScript 타입 정의
    └── index.ts         # 공통 타입
```