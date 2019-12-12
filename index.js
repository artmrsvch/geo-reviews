ymaps.ready(init);

function init(){
    
    const modal = document.querySelector('#overlay');
    const otziv = document.querySelector('#otziv');
    const create = document.querySelector('.create');
    let myPlacemark;
    let thisAdress;
    let thisCoords;
    let placeObject = new Array;
    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="ballon_place ballon_our"><strong>{{ properties.reviews.place|raw }}</strong></div>' +
        '<a href="#" id="links" class="ballon_adres ballon_our">{{ properties.adressReview|raw }}</a>' +
        '<div class="ballon_area ballon_our">{{ properties.reviews.area|raw }}</div>', {
            build: function () {
                customItemContentLayout.superclass.build.call(this);
                document.querySelector('#links').addEventListener('click', this.onCounterClick);
            },
            clear: function () {
                document.querySelector('#links').removeEventListener('click', this.onCounterClick);
                customItemContentLayout.superclass.clear.call(this);
            },
            onCounterClick: function (e) {
                e.preventDefault();
                let p = findName(e.target.previousElementSibling.textContent);
                reviewModal(e.target.textContent, p);
                eachLi(e.target.textContent);
                myMap.balloon.close();
            }
        }
    );
    
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
    function findName (place) {
        let keeper = clusterer.getGeoObjects();
        let t;
        keeper.forEach(obj => {
            if (place == obj.properties._data.reviews.place) {
                t = obj.geometry._coordinates;
            }
        }) 
        return t;
    }
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
    function createPlacemark(coords, adress, arrRev) {
            return new ymaps.Placemark(coords,{
                adressReview: adress,
                reviews: arrRev,
            },{
                preset: 'islands#violetIcon',
            });
}   
    function reviewModal(adress, coords) {
        const template = Handlebars.compile(modal.innerHTML);
        const psd = template({position: adress});
        create.innerHTML = psd;
        thisAdress = adress;
        thisCoords = coords;
    }
    
    create.addEventListener('click', (e)=>{
        if(e.target.className == 'close-reviews') {
            create.innerHTML = '';
            myPlacemark = undefined;
        } else if (e.target.className == 'i-btn') { 
                
                myPlacemark = createPlacemark(thisCoords, thisAdress, {
                    name: document.querySelector('.i-name').value,
                    place: document.querySelector('.i-place').value,
                    area: document.querySelector('.i-area').value
                });
                placeObject.push(myPlacemark);
                myMap.geoObjects.add(myPlacemark);
                clusterer.add(myPlacemark);

                eachLi(thisAdress);
        } 
    })

    function eachLi (adress) {
        let keeper = clusterer.getGeoObjects();
        let arrTemp = new Array;
        keeper.forEach(obj => {
            if (adress == obj.properties._data.adressReview) {
                arrTemp.push(obj.properties._data.reviews);
            }
        })        
        const templateOtz = Handlebars.compile(otziv.innerHTML);
        const psdOtz = templateOtz(arrTemp);
        document.querySelector('.reviews').innerHTML = psdOtz;
    }
    myMap.geoObjects.events.add('click', function (e) {
        const targ = e.get('target');
        if (targ.properties._data.geoObjects) {
            
        } else {
            myPlacemark = targ;
            reviewModal(targ.properties._data.adressReview, e.get('coords'));
            eachLi(targ.properties._data.adressReview);
        }
    })
    
    let clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        preset: 'islands#invertedVioletClusterIcons',
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5
    });
    
    myMap.geoObjects.add(clusterer);   
}
