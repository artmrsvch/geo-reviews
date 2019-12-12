ymaps.ready(init);

function init(){
    
    const modal = document.querySelector('#overlay');
    const otziv = document.querySelector('#otziv');
    const create = document.querySelector('.create');
    
    let storage = localStorage;
    let data;
    let thisAdress;
    let thisCoords;
    let placeObject = new Array;
    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="baloon-container">' +
            '<div class="baloon-container__top">' +
                '<div class="ballon_place ballon_our"><strong>{{ properties.reviews.place|raw }}</strong></div>' +
                '<a href="#" id="links" class="ballon_adres ballon_our">{{ properties.adressReview|raw }}</a>' +
                '<div class="ballon_area ballon_our">{{ properties.reviews.area|raw }}</div>' +
            '</div>'+
            '<span class="ballon_time ballon_our">{{ properties.date|raw }}</span>' +
        '</div>', {
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
    try {
        data = JSON.parse(storage.data);
    } catch (e) {
        data = undefined;
    }
    const myMap = new ymaps.Map('maps', {
        center: [55.7482921,37.5900027],
        zoom: 15 
    })
    
    myMap.events.add('click', function (e) {
        if (create.innerHTML != '') {
            create.innerHTML = '';
            getModal (e);
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
    function createPlacemark(coords, adress, arrRev, arcivedDate) {
        let comentDate;
        if (arcivedDate == undefined) {
            comentDate = formatDateBaloon(new Date);
        } else {
            comentDate = arcivedDate;
        };        
        let mark = new ymaps.Placemark(coords,{
            adressReview: adress,
            reviews: arrRev,
            date: comentDate
        },{
            preset: 'islands#violetIcon',
        });
        placeObject.push({
            coord: coords,
            adres: adress,
            review: arrRev,
            date: comentDate
        });
        storage.data = JSON.stringify(placeObject);
        myMap.geoObjects.add(mark);
        clusterer.add(mark);

        return mark
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
        } else if (e.target.className == 'i-btn') {      
                let nowDate = formatDateModal(new Date);
                createPlacemark(thisCoords, thisAdress, {
                name: document.querySelector('.i-name').value,
                place: document.querySelector('.i-place').value,
                area: document.querySelector('.i-area').value,
                dateModal: nowDate
            });
            document.querySelector('.i-name').value = '';
            document.querySelector('.i-place').value = '';
            document.querySelector('.i-area').value = '';
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
        console.log(targ);
        if (targ.properties._data.geoObjects) {
            
        } else {
            reviewModal(targ.properties._data.adressReview, e.get('coords'));
            eachLi(targ.properties._data.adressReview);
        }
    })
    function formatDateBaloon(date) {

        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
      
        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
      
        let yy = date.getFullYear();
        let se = date.getSeconds();
        if (se < 10) se = '0' + se;

        let mi = date.getMinutes();
        if (mi < 10) mi = '0' + mi;

        let hr = date.getHours();
        if (hr < 10) hr = '0' + hr;
        
        return yy + '.' + mm + '.' + dd + '  ' + hr +':'+ mi +':'+ se;
    }
    function formatDateModal(date) {

        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
      
        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
      
        let yy = date.getFullYear();

        return dd + '.' + mm + '.' + yy;
    }
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
    if (data) {
        data.forEach(thismark => {
            createPlacemark (thismark.coord, thismark.adres, thismark.review, thismark.date);
        })
    }
}
