<div align="center">

# [Assignment 5] 휴먼스케이프

### 원티드x위코드 백엔드 프리온보딩 과제 5

<br>

### **[과제 출제 기업 정보]**

[기업명] 휴먼스케이프

[🔗 휴먼스케이프 사이트](https://humanscape.io/kr/index.html)

[🔗 wanted 채용공고 링크](https://www.wanted.co.kr/wd/41413)

</br>

## 😎 Members of 12-Punch

| 이름   | github                                          | 담당 기능                | TIL/회고 |
| ------ | ----------------------------------------------- | ------------------------ | -------- |
| 김남형 | [42seouler](https://github.com/)                | 업데이트 데이터 조회         |[휴먼스케이프회고](https://velog.io/@42seouler/Assignment-5)|
| 김서경 | [riley909](https://github.com/riley909)         | 외부 API 호출, Unit Test |          |
| 김요셉 | [kim-jos](https://github.com/kim-jos)           | 임상정보 수집 Batch Task |          |
| 정천우 | [codehousepig](https://github.com/codehousepig) | Unit Test, 배포         | [codehousepig](https://blog.naver.com/codehouse9/222568810485)          |
| 최유진 | [n12seconds](https://github.com/n12seconds)     | 리스트 검색, 단건 조회 |          |

</div>

<br>
<br>
<br>
<br>

## 📖 과제 내용

### [필수 포함 사항]

- README 작성
  - 프로젝트 빌드, 자세한 실행 방법 명시
  - 구현 방법과 이유에 대한 간략한 설명
  - 완료된 시스템이 배포된 서버의 주소
  - 해당 과제를 진행하면서 회고 내용 블로그 포스팅
- Swagger나 Postman을 이용하여 API 테스트 가능하도록 구현

</br>

### [개발 요구사항]

<details>
<summary>확인 사항</summary>

- ORM 사용 필수
- 데이터베이스는 SQLite로 구현
- secret key, api key 등을 레포지토리에 올리지 않도록 유의
  - README.md 에 관련 설명 명시 필요

</details>

<details>
<summary>과제 안내</summary>
다음 사항들을 충족하는 서비스를 구현해주세요.

- 임상정보를 수집하는 batch task
  - 참고: [https://www.data.go.kr/data/3074271/fileData.do#/API 목록/GETuddi%3Acfc19dda-6f75-4c57-86a8-bb9c8b103887](https://www.data.go.kr/data/3074271/fileData.do#/API%20%EB%AA%A9%EB%A1%9D/GETuddi%3Acfc19dda-6f75-4c57-86a8-bb9c8b103887)
- 수집한 임상정보에 대한 API
  - 특정 임상정보 읽기(키 값은 자유)
- 수집한 임상정보 리스트 API
  - 최근 일주일내에 업데이트(변경사항이 있는) 된 임상정보 리스트
    - pagination 기능
- **Test 구현시 가산점이 있습니다.**
</details>

<details>
<summary>도전 과제: 스스로에게도 도움이 되는 내용 + 추가 가산점</summary>

- 배포하여 웹에서 사용 할 수 있도록 제공
- 임상정보 검색 API 제공

</details>

</br>
</br>

## 🛠 사용 기술 및 Tools

### [Back-End] ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

### [Deploy] <img src="https://img.shields.io/badge/AWS_EC2-232F3E?style=for-the-badge&logo=Amazon&logoColor=white"/>

### [Etc.] <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white"/> <img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white">

<img src="https://user-images.githubusercontent.com/67426853/141735078-05c51c5c-a5b2-452d-ad5f-79ba79f7d04a.png" width=700>

<br>
<br>

## DB Schema

</br>
</br>

## 📌 구현 기능

### 임상정보 수집하는 Batch Task

Cron을 사용해 매 시간 임상정보를 수집하는 메소드가 실행되도록 설정했습니다.
메소드 실행방식은 다음과 같습니다:

1. 해당 사이트의 정보를 HTTP GET를 사용해 수집합니다.
2. 각 임상정보의 과제번호를 사용해 DB에 저장되어 있는지 확인합니다 (Key 값을 '과제번호'로 설정했습니다).
3. 과제번호가 DB에 저장되어 있다면 update를 합니다.
4. 과제번호가 DB에 저장되어 있지 않다면 insert를 합니다.

### findUpdateList

- 조회 기준점은 현재 시간 기준으로 -7일 00:00:00부터 현재 23:59:59.999까지의 기준으로 데이터를 조회하고 페이지네이션 기능이 적용되어 있습니다.
- 예시 데이터는 아래와 같습니다.
```
{
  "updateElement": 업데이트 된 요소의 수
  "totalPage": 업데이트 된 총 페이지 수
  "currentPage": 현재 페이지
  "data": [
    {
      "id": "C130010",
      "title": "조직구증식증 임상연구 네트워크 구축 및 운영(HLH)",
      "department": "Pediatrics",
      "institution": "서울아산병원",
      "subjectCount": 120,
      "period": "3년",
      "researchType": "관찰연구",
      "stage": "코호트",
      "scope": "국내다기관",
      "createdAt": "2021-11-01T12:51:43.000Z",
      "updatedAt": "2021-11-16T13:00:00.000Z"
    },
    ....
```

### findAll
- 검색어를 기준으로 모든 컬럼 값을 매칭하여 매칭되는 데이터를 조회하고 페이지네이션 기능이 적용되어 있습니다.
- 예시 데이터는 아래와 같습니다.
```
{
  "count": 조회된 총 데이터 수,
  "data": [
    {
      "id": "C130011",
      "title": "대한민국 쇼그렌 증후군 코호트 구축",
      "department": "Rheumatology",
      "institution": "가톨릭대 서울성모병원",
      "subjectCount": 500,
      "period": "6년",
      "researchType": "관찰연구",
      "stage": "코호트",
      "scope": "국내다기관",
      "createdAt": "2021-11-16T13:17:46.000Z",
      "updatedAt": "2021-11-16T14:00:00.000Z"
    }, ...
```

### findOne
- findOne의 키값은 과제번호로 지정하였습니다.
- 예시 데이터는 아래와 같습니다.
```
  {
      "id": "C130011",
      "title": "대한민국 쇼그렌 증후군 코호트 구축",
      "department": "Rheumatology",
      "institution": "가톨릭대 서울성모병원",
      "subjectCount": 500,
      "period": "6년",
      "researchType": "관찰연구",
      "stage": "코호트",
      "scope": "국내다기관",
      "createdAt": "2021-11-16T13:17:46.000Z",
      "updatedAt": "2021-11-16T14:00:00.000Z"
    }, ...
```

### Unit Test

##### loadData 메소드

- 외부 API를 호출해서 임상정보 데이터를 가져오는 메소드 입니다.
- API 호출에 필요한 api key가 있는지를 확인합니다.
- 유효한 api key를 가지고 있는 경우 호출이 성공하는지 확인합니다.
- api key가 유효하지 않은 경우 결과가 undefined임을 확인합니다.

##### Batch Task메소드

- 기능에 대한 설명은 '임상정보 수집하는 Batch Task'에서 확인할 수 있습니다.
- Batch Task 메소드에서 테스트 할 수 있는 기능은 총 세가지라고 생각했습니다: 1) Cron기능, 2) pagination 기능, 3) update/insert 기능 입니다.
- 해당 프로젝트에서는 가장 핵심이 되는 update/insert 기능을 테스트를 했습니다. Cron는 Nest에서 제공하는 라이브러리라서 따로 하지 않았습니다.
- Update/insert 기능을 테스트하기 위해 DB에 데이터가 있을 때와 없을 때의 시나리오를 생각했고 update/insert 메소드가 제대로 실행되는지 확인했습니다.

##### findUpdateList 메소드

- createQueryBuilder를 호출하는지 확인합니다.
  - 호출이 횟수가 1회인지 확인합니다.
  - take와 skip 메소드를 호출하는지 확인합니다.
- 조회한 결과가 유효한지 확인합니다.

<br>
<br>

## 📖 API Document

[🔗 Swagger ](http://13.125.0.161:3015/api/)

### API Test 방법

#### <span style="color:red">주의사항</span>
- <span style="color:slateblue">아래의 findUpdateList, findAll은 페이지네이션이 적용되어 있습니다.</span>
- <span style="color:slateblue">offset(page)를 뜻하고 offset은 인덱스 기준으로 되어 있기 때문에 0부터 시작합니다.</span>
- <span style="color:slateblue">skip(limit)을 뜻하고 한번에 가져올 요소의 갯수입니다.</span>

  <br>
  <br>

## 🪄 설치 및 실행 방법

### 설치

1. 레포지토리를 clone 받습니다

```
$ git clone
```

2. clone한 경로에 들어간 후 의존성을 설치하고 환경 셋팅을 진행합니다.

```
$ cd humanscape-12-punch-assignment
$ npm install
```

3.서버를 구동합니다.

```
$ npm start
```

4.유닛 테스트를 확인합니다.

```
$ npm test
```

</br>
</br>

## 🛠 Dependencies

</br>

<div align=center>

</div>

<br>
<br>

## Reference

이 프로젝트는 [원티드 프리온보딩 백엔드 코스](https://www.wanted.co.kr/events/pre_onboarding_course_4) 5차 과제 일환으로 휴먼스케이프에서 출제한 과제를 기반으로 만들었습니다.

2021년 11월 15일(월) 오후 6시 ~ 11월 17일(수) 오전 10시
