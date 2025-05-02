
// Kakao Maps SDK 스크립트 동적 생성
const script = document.querySelector(".kakao");
script.src =
  "//dapi.kakao.com/v2/maps/sdk.js?appkey=0f79332a23ebec3df976eaeccfc7e64d&libraries=services&autoload=false";

// SDK가 로드된 후에 kakao.maps.load로 지도 초기화
// Kakao Maps SDK 스크립트 동적 생성

const doDrop = document.querySelector("ul.do.dropdown-menu");
const siDrop = document.querySelector("ul.si.dropdown-menu");
const bankDrop = document.querySelector("ul.bank.dropdown-menu");
const siAnnounce = document.querySelector("li.si.announce");
const doBtn = document.querySelector("button.do");
const siBtn = document.querySelector("button.si");
const bankBtn = document.querySelector("button.bank");
const formTag = document.querySelector("form");

script.onload = function () {
  // SDK가 로드된 후에 kakao.maps.load로 지도 초기화
  window.kakao.maps.load(function () {
    // 마커를 클릭하면 장소명을 표출할 인포윈도우
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    const mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(37.4978, 127.02786), // 지도의 중심좌표
        level: 4, // 지도의 확대 레벨
        mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
      };

    // 지도를 생성한다
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // data 불러오기
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        // 데이터 저장
        const mapData = data.mapInfo;
        const bankData = data.bankInfo;

        // 광역시 / 도
        for (const i in mapData) {
          const li = document.createElement("li");
          doDrop.appendChild(li);
          li.textContent = mapData[i].name;
          li.role = "button";
          li.classList.add("p-2");
          const hr = document.createElement("hr");
          hr.classList.add("m-0");
          doDrop.appendChild(hr);
          li.addEventListener("click", (e) => {
            doBtn.textContent = li.textContent;
            siAnnounce.classList.add("d-none");
            siDrop.innerHTML = "";
            // 시 / 군 / 구
            let countries = [];
            for (const i in mapData) {
              if (mapData[i].name === doBtn.textContent) {
                countries = mapData[i].countries;
              }
            }
            for (const country of countries) {
              const li = document.createElement("li");
              siDrop.appendChild(li);
              li.role = "button";
              li.classList.add("p-2");
              li.textContent = country;
              const hr = document.createElement("hr");
              hr.classList.add("m-0");
              siDrop.appendChild(hr);

              li.addEventListener("click", (e) => {
                siBtn.textContent = li.textContent;
              });
            }
          });
        }

        // 은행
        for (const bank of bankData) {
          const li = document.createElement("li");
          bankDrop.appendChild(li);
          li.role = "button";
          li.classList.add("p-2");
          li.textContent = bank;
          const hr = document.createElement("hr");
          hr.classList.add("m-0");
          bankDrop.appendChild(hr);

          li.addEventListener("click", (e) => {
            bankBtn.textContent = li.textContent;
          });
        }
        // 장소 검색 객체 생성하기
        var ps = new kakao.maps.services.Places();
        // 지도에 마커 표시하기
        function displayMarker(place) {
          // 마커 생성하고 지도에 표시하기
          var marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x),
          });

          // 마커에 클릭 이벤트 등록
          kakao.maps.event.addListener(marker, "click", function () {
            // 마커 클릭하면 장소명이 인포윈도우에 표출된다.
            infowindow.setContent(
              '<div style="padding:5px; font-size:12px;">' +
                place.place_name +
                "</div>"
            );
            infowindow.open(map, marker);
          });
        }

        // 키워드 검색 완료 시 호출되는 콜백 함수
        function placeSearchCB(data, status, pagination) {
          if (status === kakao.maps.services.Status.OK) {
            // 검색된 장소 위치를 기준으로 지도 범위 재 설정
            // LatLng Bounds 객체에 좌표 추가
            var bounds = new kakao.maps.LatLngBounds();

            for (var i = 0; i < data.length; i++) {
              console.log(data[i]);
              displayMarker(data[i]);
              bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }

            // 검색된 장소 위치 기준으로 지도 범위 재설정
            map.setBounds(bounds);
          }
        }

        formTag.addEventListener("submit", (e) => {
          e.preventDefault();
          const place = `${doBtn.textContent} ${siBtn.textContent} ${bankBtn.textContent}`;
          ps.keywordSearch(place, placeSearchCB);
        });

        // 지도 타입 변경 컨트롤을 생성한다
        var mapTypeControl = new kakao.maps.MapTypeControl();

        // 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 지도에 확대 축소 컨트롤을 생성한다
        var zoomControl = new kakao.maps.ZoomControl();

        // 지도의 우측에 확대 축소 컨트롤을 추가한다
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도 중심 좌표 변화 이벤트를 등록한다
        kakao.maps.event.addListener(map, "center_changed", function () {
          console.log(
            "지도의 중심 좌표는 " + map.getCenter().toString() + " 입니다."
          );
        });

        // 지도 확대 레벨 변화 이벤트를 등록한다
        kakao.maps.event.addListener(map, "zoom_changed", function () {
          console.log(
            "지도의 현재 확대레벨은 " + map.getLevel() + "레벨 입니다."
          );
        });

        // 지도 영역 변화 이벤트를 등록한다
        kakao.maps.event.addListener(map, "bounds_changed", function () {
          var mapBounds = map.getBounds(),
            message =
              "지도의 남서쪽, 북동쪽 영역좌표는 " +
              mapBounds.toString() +
              "입니다.";

          //   console.log(message);
        });

        // 지도 시점 변화 완료 이벤트를 등록한다
        kakao.maps.event.addListener(map, "idle", function () {
          var message =
            "지도의 중심좌표는 " +
            map.getCenter().toString() +
            " 이고," +
            "확대 레벨은 " +
            map.getLevel() +
            " 레벨 입니다.";
          //   console.log(message);
        });

        // 지도 클릭 이벤트를 등록한다 (좌클릭 : click, 우클릭 : rightclick, 더블클릭 : dblclick)
        kakao.maps.event.addListener(map, "click", function (mouseEvent) {
          console.log(
            "지도에서 클릭한 위치의 좌표는 " +
              mouseEvent.latLng.toString() +
              " 입니다."
          );
        });

        // 지도 드래깅 이벤트를 등록한다 (드래그 시작 : dragstart, 드래그 종료 : dragend)
        kakao.maps.event.addListener(map, "drag", function () {
          var message =
            "지도를 드래그 하고 있습니다. " +
            "지도의 중심 좌표는 " +
            map.getCenter().toString() +
            " 입니다.";
          //   console.log(message);
        });
      });
  });
};
