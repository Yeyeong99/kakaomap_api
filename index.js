import config from './apikey.js';

// Kakao Maps SDK 스크립트 동적 생성
const script = document.querySelector('.kakao');
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0f79332a23ebec3df976eaeccfc7e64d&autoload=false`;
script.onload = function() {
    // SDK가 로드된 후에 kakao.maps.load로 지도 초기화
    window.kakao.maps.load(function() {
        var mapContainer = document.getElementById('map');
        var mapOption = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 3
        };
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 지도 타입 변경 컨트롤을 생성한다
        var mapTypeControl = new kakao.maps.MapTypeControl();

        // 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);	

        // 지도에 확대 축소 컨트롤을 생성한다
        var zoomControl = new kakao.maps.ZoomControl();

        // 지도의 우측에 확대 축소 컨트롤을 추가한다
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도 중심 좌표 변화 이벤트를 등록한다
        kakao.maps.event.addListener(map, 'center_changed', function () {
            console.log('지도의 중심 좌표는 ' + map.getCenter().toString() +' 입니다.');
        });

        // 지도 확대 레벨 변화 이벤트를 등록한다
        kakao.maps.event.addListener(map, 'zoom_changed', function () {
            console.log('지도의 현재 확대레벨은 ' + map.getLevel() +'레벨 입니다.');
        });

        // 지도 영역 변화 이벤트를 등록한다
        kakao.maps.event.addListener(map, 'bounds_changed', function () {
            var mapBounds = map.getBounds(),
                message = '지도의 남서쪽, 북동쪽 영역좌표는 ' +
                            mapBounds.toString() + '입니다.';

            console.log(message);	
        });

        // 지도 시점 변화 완료 이벤트를 등록한다
        kakao.maps.event.addListener(map, 'idle', function () {
            var message = '지도의 중심좌표는 ' + map.getCenter().toString() + ' 이고,' + 
                            '확대 레벨은 ' + map.getLevel() + ' 레벨 입니다.';
            console.log(message);
        });

        // 지도 클릭 이벤트를 등록한다 (좌클릭 : click, 우클릭 : rightclick, 더블클릭 : dblclick)
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            console.log('지도에서 클릭한 위치의 좌표는 ' + mouseEvent.latLng.toString() + ' 입니다.');
        });	

        // 지도 드래깅 이벤트를 등록한다 (드래그 시작 : dragstart, 드래그 종료 : dragend)
        kakao.maps.event.addListener(map, 'drag', function () {
            var message = '지도를 드래그 하고 있습니다. ' + 
                            '지도의 중심 좌표는 ' + map.getCenter().toString() +' 입니다.';
            console.log(message);
        });
    });
};
