# ⚽️ 하비

## :sunny: 서비스 소개
⚽️ 일상에서 취미활동을 할 때 활동한 시간을 측정하여 사진과 글과 함께 업로드하여 유저간 소통하는 커뮤니티 사이트

주소: http://hobbysns.tk
<br/>
<br/>

## :sunny: 사용 기술

백엔드:
<br/>
<br/>
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/><a/>
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/><a/>
<img src="https://img.shields.io/badge/MYSQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/><a/>
- Node.js의 Express를 사용해 API 서버 구축
- RDMBS인 MySQL을 활용해 DB구축
<br/>

프론트엔드:
<br/>
<br/>
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/><a/>
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/><a/>
<img src="https://img.shields.io/badge/styled components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/><a/>
- React.js와 Next.js를 사용하여 화면 개발
- Redux나 Mobx등의 전역 상태관리 라이브러리 대신 서버 캐싱 라이브러리인 SWR을 사용하여 data fetching
- Css-in-Js 방식으로 Styled-Components를 사용
<br/>

배포:
- AWS를 EC2를 이용하여 웹서버 구축
- AWS RDS를 이용하여 MySQL 데이터베이스와 연결
- AWS Route53을 이용하여 도메인 연결
<br/>

### :bulb: 고려한 포인트
- 좋아요, 팔로우와 같이 중복되는 로직들은 재사용할 수 있도록 custom hook을 이용
- 복잡한 컴포넌트는 유지보수와 재사용이 용이하도록 비즈니스 로직과 뷰를 분리
<br/>
<br/>

## :sunny: 구조

### :bulb: 데이터베이스
![hobbysns ERD](https://user-images.githubusercontent.com/84958904/149623682-17b1772e-9804-47d6-9470-0c19e8939b54.png)
<br/>
<br/>

## :sunny: 주요 페이지
### :bulb: 커뮤니티
- 상단에 본인의 활동시간을 측정하는 타이머와 게시글이 로드
- 게시글의 좋아요를 누르면 실시간으로 반영
- 스크롤을 내리면 페이지네이션에 의해 게시글을 추가로 로드
<br/>

![Animation2](https://user-images.githubusercontent.com/84958904/148893251-6118b8fb-6253-4782-aff6-b44640925921.gif)
<br/>
<br/>

### :bulb: 프로필
- 특정 유저의 정보를 로드
- 특정 유저의 작성게시글을 로드
- 팔로우, 좋아요 요청이 실시간으로 반영
<br/>

![Animation3](https://user-images.githubusercontent.com/84958904/148894665-7155b6f2-08c4-4979-9f8a-f655f27477c3.gif)
<br/>
<br/>

### :bulb: 게시글
- 커뮤니티나 프로필 페이지에서 게시글을 클릭하면 상세페이지로 이동
- 로그인한 유저가 게시글이나 댓글 작성자이면 수정/삭제 메뉴를 표시
- 댓글마다 대댓글을 작성, 삭제 가능
<br/>

![Animation4](https://user-images.githubusercontent.com/84958904/148897361-bee525a6-844d-42ce-b4c5-b85dc670a389.gif)
<br/>
<br/>

### :bulb: 마이페이지
- 유저의 프로필 사진 및 개인정보 변경 가능
<br/>

![마이페이지](https://user-images.githubusercontent.com/84958904/148897775-dba20229-c0cc-44ed-9ca7-4ed4dd0b4687.png)
<br/>
<br/>

### :bulb: 글쓰기 / 수정
+ 사진을 첨부하고 내용을 작성하여 업로드
<br/>

![글쓰기](https://user-images.githubusercontent.com/84958904/148898819-e5fca944-9693-41da-ae86-8620eed480ad.png)
<br/>
<br/>

## :sunny: 반응형 구현
+ 모바일, 태블릿, 데스트탑 화면에 맞게 반응형으로 제작
<br/>
<p align="center">
  <image src="https://user-images.githubusercontent.com/84958904/148899877-ed14677f-1592-49ba-81d6-cdfec2ca3028.png" width="300" height="600"/>
</p>
<br/>
<br/>
