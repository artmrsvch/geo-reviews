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

export {
    formatDateBaloon,
    formatDateModal
}