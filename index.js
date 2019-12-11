ymaps.ready(init);

function init(){
    
    const modal = document.querySelector('#overlay');
    const otziv = document.querySelector('#otziv');
    let geoObj = new Array; 
    const create = document.querySelector('.create');
    
    
    const myMap = new ymaps.Map('maps', {
        center: [55.7482921,37.5900027],
        zoom: 15 
    })

    myMap.events.add('click', function (e) {
        if (create.innerHTML != '') {

        } else {
            let coords = e.get('coords'); 
        ymaps.geocode(coords)
            .then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);    
                return firstGeoObject.getAddressLine();;
            })
            .then((adres)=>{
                reviewModal(adres, coords);
                console.log(adres)
                console.log(coords)
                myMap.geoObjects.events.add('click', function (e) {
                    console.log(e.get('target'))
                   
                })
            })
        }
    });
    
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
    
    function reviewModal(adress, coords, textRevi) {
        let myPlacemark;
        let arrRev = new Array;  //создаем массив отзывов
        const template = Handlebars.compile(modal.innerHTML);
        const psd = template({position: adress});
        create.innerHTML = psd;   //открываем модалку с отзывами
        
        create.addEventListener('click', (e)=>{        //вешаем обработчик событий на модалку
            if(e.target.className == 'close-reviews') {   //если клик по кнопке закрыть - закрываем модалку
                create.innerHTML = '';
                myPlacemark = undefined;
                arrRev = [];
                

            } else if (e.target.className == 'i-btn') {   //если клик по кнопке добавить  
                console.log('КЛИК ПО ДОБАВВИТЬ')
                arrRev.push(                              //пушим инпуты в массив отзывов
                    {
                        name: document.querySelector('.i-name').value,
                        place: document.querySelector('.i-place').value,
                        area: document.querySelector('.i-area').value
                    }
                )
                console.log(myPlacemark);
                if (myPlacemark == undefined) {
                    myPlacemark = 1;
                    createPlacemark(coords, adress, arrRev); //создаем маркер с текущими отзывами и адресом
                    myMap.geoObjects.add(myPlacemark);                     //добавлем маркер на карту
                    myPlacemark.events.add('click', function (e) {
                        console.log(e.originalEvent.target.properties._data.adressReview)
                        console.log(e.originalEvent.target.properties._data.reviews)
                    })
                } else {
                    console.log('ДАДАВАЙ НАХУЙ УЖЕ НАКОНЕЦ');
                    myPlacemark.properties._data.reviews = arrRev;
                }
                
                const acessObj = myPlacemark.properties._data;         //получаем доступ к хранилищу отзывов в метке
                const templateOtz = Handlebars.compile(otziv.innerHTML);
                const psdOtz = templateOtz(acessObj.reviews);
                document.querySelector('.reviews').innerHTML = psdOtz; //добавляем отзыв в DOM узел

            }
        })  
        
    }
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
