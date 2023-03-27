ymaps.ready(function () {
    const searchControls = new ymaps.control.SearchControl({
        options: {
            float: 'right',
            noPlacemark: true
        }
    })

    var myMap = new ymaps.Map("map40", {
        center: [54.513845, 36.261215],
        zoom: 6,
        controls: [searchControls]
    })
    const removeControls = [
        'geolocationControl',
        'trafficControl',
        'fullscreenControl',
        'zoomControl', 'rulerControl',
        'typeSelector'
    ]

    const clearTheMap = myMap => {
        removeControls
            .forEach(controls => myMap.controls.remove(controls))
    }

    clearTheMap(myMap)

    fetch('regions/40.json',)
        .then(arr => arr.json())
        .then(arr => {
            var objectManager = new ymaps.ObjectManager({clusterize: false});

            objectManager.add(arr)
            myMap.geoObjects.add(objectManager)
        })
})
