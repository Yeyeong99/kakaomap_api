// Kakao Maps SDK 스크립트 동적 생성
const script = document.querySelector(".kakao");
const doDrop = document.querySelector("ul.do.dropdown-menu");
const siDrop = document.querySelector("ul.si.dropdown-menu");
const bankDrop = document.querySelector("ul.bank,dropdown-menu");
const siAnnounce = document.querySelector("li.si.announce");
const doBtn = document.querySelector("button.do");
const siBtn = document.querySelector("button.si");
const bankBtn = document.querySelector("button.bank");

script.src =
  "//dapi.kakao.com/v2/maps/sdk.js?appkey=0f79332a23ebec3df976eaeccfc7e64d&autoload=false";
script.onload = function () {
  // SDK가 로드된 후에 kakao.maps.load로 지도 초기화
  window.kakao.maps.load(function () {
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
            let countries = [];
            for (const i in mapData) {
              if (mapData[i].name === doBtn.textContent) {
                countries = countries.concat(mapData[i].countries);
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

          console.log(message);
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
          console.log(message);
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
          console.log(message);
        });

        // for (var i = 0; i < positions.length; i++) {
        //   // 마커를 생성합니다
        //   var marker = new kakao.maps.Marker({
        //     map: map, // 마커를 표시할 지도
        //     position: positions[i].latlng, // 마커를 표시할 위치
        //     title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        //   });

        //   marker.setMap(map);
        // }
      });
  });
};
