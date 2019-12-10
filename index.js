ymaps.ready(init);

function init(){
   
    const modal = document.querySelector('#overlay');
    let myPlacemark;
    let geoObj = new Array; 
    const create = document.querySelector('.create');
    
    const myMap = new ymaps.Map('maps', {
        center: [55.7482921,37.5900027],
        zoom: 15 
    })

    myMap.events.add('click', function (e) {
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
            })


        myPlacemark = createPlacemark(coords); //Создаем метку 

        myMap.geoObjects.add(myPlacemark); 
        myPlacemark.events.add('click', function (e) {
            console.log(e.originalEvent.target.properties._data.balloonContent)
            console.log('asdasd')
        })

    });
    
    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords,{
           
            balloonContent: 'цвет <strong>влюбленной жабы</strong>',
        },{
            preset: 'islands#violetIcon',
        });
    }
    
    // Определяем адрес по координатам (обратное геокодирование).
    
    function reviewModal(adress, coords, textRevi) {
        const html = modal.innerHTML;
        const template = Handlebars.compile(html);
        const thisObj = {
            position: adress
        };
        const psd = template(thisObj);
        create.innerHTML = psd;
        let arrRev = new Array;


        create.addEventListener('click', (e)=>{
            
            if(e.target.className == 'close-reviews') {
                create.innerHTML = '';
            } else if (e.target.className == 'i-btn') {
                arrRev.push(
                    {
                        name: document.querySelector('.i-name').value,
                        place: document.querySelector('.i-place').value,
                        area: document.querySelector('.i-area').value
                    }
                )
                console.log(arrRev)  //тут массив отзывов
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
    myMap.geoObjects.events.add('click', (e)=>{

        console.log(e)
    });

   
}
