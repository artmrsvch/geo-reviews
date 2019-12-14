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
export {
    getModal
}