function createMortalityChart(country, sex, data) {
    let dataobject = [];
    $.each(data, function (key, val) {
        let mortalityobject = {
            name: val.age, 
            value: val.mortality_percent
        };
        dataobject.push(mortalityobject);
    });
    var myChart = echarts.init(document.getElementById('mortality-chart-container'));

    option = {
        backgroundColor: '#fff',

        title: {
            text: 'Mortality Percentage(%) for ' + sex + 's in ' + country,
            left: 'center',
            top: 5,
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 0,
            max: 100,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [
            {
                name: 'Mortality Percentage',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                data: dataobject.sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(0, 0, 0, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgb(68, 153, 237)'
                    }
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    myChart.setOption(option);

    $('#mortality-percentage-chart-result').fadeIn(300);
}
