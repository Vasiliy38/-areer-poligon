ymaps.ready(function () {
    var myMap = new ymaps.Map("map", {
        center: [57.60, 38.54],
        zoom: 8
    }, {
        searchControlProvider: 'yandex#search'
    })

    const regex = /(\d+)°(\d+)'(\d+(?:\.\d+)?)"([NE])/g

    function get_decimaldegree(str) {
        let [_, degrees, minutes, seconds, direction] = regex.exec(str)
        let dd = parseFloat(degrees) + (parseFloat(minutes) / 60) + (parseFloat(seconds) / (60 * 60))
        return dd
    }

    fetch('76.json',)
        .then(arr => arr.json())
        .then(arr => {
            const geoObj = []
            const x = []
            arr.forEach(obj => {
                if (obj.geo) {
                    geoObj.push({
                        geo: obj.geo.split("Д(гр,мин,сек)\n1").map(y => y.split("\n----------------Объект")),
                        name: obj.name,
                        company: obj.company,
                        active: obj.active,
                        link: obj.link
                    })
                }
            })
            return geoObj
        })

        .then(arr => {
            let a = []
            let object = []
            arr.forEach(obj => {
                a.push(obj.geo.map((x, i) => x.join(',').match(regex)).slice(1))
                object.push({
                    geo: a,
                    name: obj.name,
                    company: obj.company,
                    link: obj.link,
                    active: obj.active
                })
                a = []
            })
            return object
        })
        .then(arr => {
            let coord = []
            let dataArray = []

            arr.forEach(elem => {
                if (elem.geo.length) {

                    elem.geo.forEach(el => el.map(x => coord.push(x.map(y => get_decimaldegree(y.match(regex))))))

                    dataArray.push({
                        geo: coord,
                        name: elem.name,
                        company: elem.company,
                        link: elem.link,
                        active: elem.active
                    })
                    coord = []
                }
            })
            return dataArray
        })
        .then(arr => {
            let dataArray = []
            arr.forEach(obj => {
                if (obj.geo.length) {
                    let geo = []

                    obj.geo.forEach(x => {
                        for (let i = 0; i < x.length; i++) {
                            if (Number(String(x[i])[0]) >= 5) {
                                geo.push(x.slice(i, i + 2))
                                i += 1
                            } else {
                                geo.push(x.slice(i, i + 2).reverse())
                                i += 1
                            }
                        }
                        dataArray.push({
                            geo,
                            name: obj.name,
                            company: obj.company,
                            link: obj.link,
                            active: obj.active
                        })

                    })
                    geo = []

                }
            })
            return dataArray
        })
        .then(arr => {
            console.log(arr)
            arr.forEach((obj) => {
                if (obj.geo.length) {
                    if (!obj.active) {
                        var objectManager = new ymaps.ObjectManager({clusterize: false});
                        var objects = []
                        objects.push({
                            type: 'Feature',
                            id: 4,

                            geometry: {
                                type: 'Polygon',
                                coordinates: [obj.geo]
                            },
                            properties: {
                                hintContent: obj.name,
                                balloonContent: `<a target="_blank" href="${obj.link}">${obj.link}</a><br><strong>${obj.company}</strong>`
                            },
                            options: {
                                opacity: 1,
                                strokeWidth: 1,
                                strokeColor: '#1d7200'
                            }
                        })
                        objectManager.add(objects)
                        myMap.geoObjects.add(objectManager)
                    } else if (obj.active.includes('Аннулирование')) {
                        var objectManager = new ymaps.ObjectManager({clusterize: false});
                        var objects = []
                        objects.push({
                            type: 'Feature',
                            id: 4,

                            geometry: {
                                type: 'Polygon',
                                coordinates: [obj.geo]
                            },
                            properties: {
                                hintContent: obj.name,
                                balloonContent: `<a target="_blank" href="${obj.link}">${obj.link}</a><br><strong>${obj.company}</strong>`
                            },
                            options: {
                                opacity: .7,
                                strokeWidth: 1,
                                strokeColor: '#f50000'
                            }
                        })
                        objectManager.add(objects)
                        myMap.geoObjects.add(objectManager)
                    } else if (obj.active.includes('Приостановление')) {
                        var objectManager = new ymaps.ObjectManager({clusterize: false});
                        var objects = []
                        objects.push({
                            type: 'Feature',
                            id: 4,

                            geometry: {
                                type: 'Polygon',
                                coordinates: [obj.geo]
                            },
                            properties: {
                                hintContent: obj.name,
                                balloonContent: `<a target="_blank" href="${obj.link}">${obj.link}</a><br><strong>${obj.company}</strong>`
                            },
                            options: {
                                opacity: .7,
                                strokeWidth: 1,
                                strokeColor: '#fff200'
                            }
                        })
                        objectManager.add(objects)
                        myMap.geoObjects.add(objectManager)
                    }
                }
            })
        })
})
