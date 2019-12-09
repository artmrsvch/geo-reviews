ymaps.ready(init);
function init(){
    let myPlacemark;
    const myMap = new ymaps.Map('maps', {
        center: [55.7482921,37.5900027],
        zoom: 15 
    })
   // yandexMaps.behaviors.disable('scrollZoom');

    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        let coords = e.get('coords');
        
        myPlacemark = createPlacemark(coords);
        myMap.geoObjects.add(myPlacemark);
        getAddress(myPlacemark.geometry.getCoordinates());
        getAddress(coords);
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                   
                });
                console.log(firstGeoObject.getAddressLine())
        });
        
    }

}

