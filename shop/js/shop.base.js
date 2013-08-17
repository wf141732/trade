/// <reference path="jquery.js" />
/// <reference path="bootstrap.js" />
/// <reference path="../../js/base.js" />
var shop = shop || {};
var version = 0.1;

var coid = coid || 1;

shop.nav = (function () {
    if (localStorage.shopVersion == version && localStorage.shopTime && (parseInt(localStorage.shopTime) + 1 * 3600 * 1000) > parseInt(new Date().getTime())) {
        $('.navbar .nav:eq(0)').html(localStorage.shopNav);
        $('.product_list .nav:eq(0)').html(localStorage.shopSid);
        return;
    }
    gf.noPagination('up_shop_getBrandCategory', [coid], function (a) {
        var de = '<li class="dropdown"><a href="category.shtml?/' + a[0][1] + '" class="dropdown-toggle" data-toggle="dropdown">'
            + a[0][3] + ' <b class="caret"></b></a><ul class="dropdown-menu">', brand = [], catg = [],
            sidbar = '<li><a class="active" href="category.shtml?/' + a[0][1] + '">' + a[0][3] + ' </a><ul>';
        for (var i = 1, b = []; b = a[i]; i++) {
            if (b[7] == 1) {
                de += '<li><a href="listing.shtml?/' + b[1] + '">' + b[3] + '</a></li>';
                sidbar += '<li><a href="listing.shtml?/' + b[1] + '">- ' + b[3] + '</a></li>';
            }
            else {
                brand.push('<li><a href="category.shtml?/' + b[1] + '">' + b[3] + '</a></li>');
                catg.push('<li><a href="category.shtml?/' + b[1] + '">' + b[3] + '</a></li>');
            }
        }
        de += '</ul></li>';
        sidbar += '</ul></li>';
        $('.navbar .nav:eq(0)').html(de + brand.join(''));
        $('.product_list .nav:eq(0)').html(sidbar + catg.join(''));
        localStorage.shopVersion = version;
        localStorage.shopNav = de + brand.join('');
        localStorage.shopSid = sidbar + catg.join('');
        localStorage.shopTime = new Date().getTime();
    });
})()

