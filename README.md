# Money Manager - 예산 관리 서비스

<p align = "center" ><img src="https://github.com/sphy1597/money_manager/assets/101171867/ab7838af-8462-495c-a4a8-6f4968c7240b"/></p>

<p align="center">  
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</p>



## 목차
1. [프로젝트 소개](#프로젝트-소개)
2. [Installation](#Installation)
3. [Running App](#Running-App)
4. [API Reference](#API-Referenc)
5. [ERD](#ERD)
6. [Function](#Function)
7. [TIL](#TIL)


## 프로젝트 소개
*사용자의 한달 예산을 설정하고, 지출을 관리할 수 있습니다.*

사용자들의 개인 재무를 관리하고 지출을 추적하는데 도움이 되는 편리한 서비스입니다. 사용자들은 예산을 설정하고 지출을 모니터링하며, 재무 목표를 달성하는 데 도움을 받을 수 있습니다. 시작 날짜에 맞춰 한 달 동안 설정한 예산 내에서 지출을 관리할 수 있어 개인의 재무 상태를 체계적으로 관리할 수 있습니다 또한 카테고리별로 지출을 분류하여 관리할 수 있어 지출의 트렌드를 파악하고 예산을 더욱 효율적으로 할당할 수 있습니다.

## Installation
```
npm i
npm install
```

## Running App  
```
node server/main.js
npm start
```

## API Reference

![image](https://github.com/sphy1597/money_manager/assets/101171867/c7abb604-ee55-467c-ad04-4203775f0251)

세부 내용 문서
[api Refe.pdf](https://github.com/sphy1597/money_manager/files/13542936/api.Refe.pdf)

## ERD
![image](https://github.com/sphy1597/money_manager/assets/101171867/b5935353-e800-481d-a147-609ae4689701)

## Function

#### 1. 회원가입 (/signup)
- 사용자의 아이디, 비밀번호를 받아 DB에 저장하는 기능
- bcrypt를 활용하여 비밀번호를 암호화하여 저장

#### 2. 로그인 (/signin)
- 아이디, 비밀번호를 받아 DB에 저장된 유저 정보와 비교
- 1 유저 없음,  2 패스워드 틀림  3 로그인 성공
- 로그인 성공시, JWT accessToken, refreshToken 발급

#### 3. 예산 CRUD (/budget)
1. 예산 설정 (POST) : 카테고리별 예산을 설정하는 기능, left_money = total_money로 설정
2. 예산 수정 (PATCh) : 설정한 예산의 내용을 수정하는 기능
3. 예산 삭제 (DELETE) : 예산 삭제 기능
4. 예산 확인 (GET) : 예산 관련된 정보 확인 기능

#### 4. 지출 CRUD (/spending)
1. 지출 설정 (POST) : 카테고리, 금액, 코멘트 형식으로 지출을 저장하는 기능
2. 지출 수정 (PATCH) : 설정한 지출의 내용을 수정하는 기능
3. 지출 삭제 (DELETE) : 지출 내역 삭제 기능
4. 지출 검색 (GET) : 지출 내역 검색 기능, 카테고리, 기간검색, 최소, 최대값 검색을 복합적으로 사용 가능 (카테고리만, 시작일만과 같은 검색 가능)

#### 5. 하루 사용 금액 추천 (/goodmorning)
- 예산을 설정일 부터 30일을 기준으로 남은 기간과 남은 금액 (left_money)를 고려해 카테고리별로 오늘의 사용 가능 금액을 추천해줌
- 최소값은 5000원, 100원 단위에서 반올림하여 사용자 친화적으로 적용

#### 6. 하루 지출 내역 정리 (/goodnight)
- 오늘 하루 사용한 지출 내역을 기반으로 다음 내용을 정리
1. 오늘의 카테고리별 지출 금액
2. 총 예산 대비 지출 비율
3. 일일 추천 사용 금액
4. 추천 대비 사용 비율

#### JWT
- 로그인시 AccessToken, RefreshToken 발급
- 지출 내역, 예산 내역과 같은 기능을 사용할 때 본인만 사용가 능하도록 하기 위해 JWT를 활용하여 권한 기능 구현
- refresh토큰을 함께 생성하여 Redis에 저장하고 관리


#### Redis
- JWT 및 지출 내역을 캐싱하기 위해 사용한 캐싱서버
- JWT Refresh토큰을 저장하고 관리하는데 활용
- 사용자의 지출 내역을 저장하고 goodnight 기능에서 캐싱된 데이터를 활용하여 사용자 사용 금액 등을 계산하는데 활용
- goodnight 기능 동작시 해당 사용자의 캐싱 내역 삭제


## TLI








