ymaps.ready(init);

function init(){
    
    const modal = document.querySelector('#overlay');
    const otziv = document.querySelector('#otziv');
    let geoObj = new Array; 
    const create = document.querySelector('.create');
    let myPlacemark;
    let thisAdress;
    let thisCoords;
    
    
    const myMap = new ymaps.Map('maps', {
        center: [55.7482921,37.5900027],
        zoom: 15 
    })

    myMap.events.add('click', function (e) {
        if (create.innerHTML != '') {

        } else {
            getModal (e);
        }
    });
    function getModal (e) {
        let coords = e.get('coords'); 
            ymaps.geocode(coords)
            .then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);    
                return firstGeoObject.getAddressLine();;
            })
            .then((adres)=>{
                reviewModal(adres, coords);            
            })
    }
    // Создание метки.
    function createPlacemark(coords, adress, arrRev, placemark) {
        if (placemark == undefined) {   //передаем метку
            let temp = [];
            
            temp.push(arrRev);
            return new ymaps.Placemark(coords,{
                adressReview: adress,
                reviews: temp,
        },{
            preset: 'islands#violetIcon',
        });
        } else {
            placemark.properties._data.reviews.push(arrRev)
        }
    }
    
    // Определяем адрес по координатам (обратное геокодирование).
    function reviewModal(adress, coords) {
        const template = Handlebars.compile(modal.innerHTML);
        const psd = template({position: adress});
        create.innerHTML = psd;   //открываем модалку с отзывами
        thisAdress = adress;
        thisCoords = coords;
    }
    
    create.addEventListener('click', (e)=>{        //вешаем обработчик событий на модалку
        if(e.target.className == 'close-reviews') {   //если клик по кнопке закрыть - закрываем модалку
            create.innerHTML = '';
            myPlacemark = undefined;              
        } else if (e.target.className == 'i-btn') {   //если клик по кнопке добавить  

            if (myPlacemark == undefined) {
                myPlacemark = createPlacemark(thisCoords, thisAdress, {
                    name: document.querySelector('.i-name').value,
                    place: document.querySelector('.i-place').value,
                    area: document.querySelector('.i-area').value
                }); //создаем маркер с текущими отзывами и адресом
                myMap.geoObjects.add(myPlacemark);                     //добавлем маркер на карту
            } else {
                console.log('ДАДАВАЙ НАХУЙ УЖЕ НАКОНЕЦ');
                createPlacemark(thisCoords, thisAdress, {
                    name: document.querySelector('.i-name').value,
                    place: document.querySelector('.i-place').value,
                    area: document.querySelector('.i-area').value
                }, myPlacemark);
            }
            eachLi(myPlacemark);
        }
    })
    function eachLi (myPlacemark) {
        const acessObj = myPlacemark.properties._data;         
        const templateOtz = Handlebars.compile(otziv.innerHTML);
        const psdOtz = templateOtz(acessObj.reviews);
        document.querySelector('.reviews').innerHTML = psdOtz; 
    }
    myMap.geoObjects.events.add('click', function (e) {
        myPlacemark = e.get('target');
        console.log(e.get('target').properties._data.reviews);
        reviewModal(e.get('target').properties._data.adressReview, e.get('coords'));
        eachLi(e.get('target'));
    })
    let clusterer = new ymaps.Clusterer({

    });
    /*clusterer.createCluster = function(center, geoObjects)
        {
            var cluster = ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects) ;
            cluster.events.add('click', function(e) {
                e.stopImmediatePropagation();
                console.log('Кликнут кластер') ;    
                
            }) ;
            return cluster;
        };*/
    myMap.geoObjects.add(clusterer);
    

   
}
