@echo off
REM 초기 Git 세팅 배치 파일

REM .git 폴더 삭제 (기존 Git 초기화 제거)
IF EXIST .git (
    echo 기존 .git 폴더 삭제 중...
    rmdir /s /q .git
)

REM Git 초기화
echo Git 초기화 중...
git init

REM Git 원격 저장소 연결 (origin으로 정확히!)
git remote add origin https://github.com/CHA-junh/BIST.git

REM 기본 브랜치 이름 설정 (main)
git branch -M main

REM 모든 파일 스테이지에 추가
echo 파일 추가 중...
git add .

REM 첫 커밋
git commit -m "initial commit"

REM GitHub로 푸시
git push -u origin main

pause
