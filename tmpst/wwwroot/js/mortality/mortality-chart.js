function createMortalityChart(country, sex, data) {
    let dataobject = [];
    $.each(data, function (key, val) {
        let mortalityobject = {
            name: val.age, 
            value: val.mortality_percent
        };
        dataobject.push(mortalityobject);
    });
    //var myChart = echarts.init(document.getElementById('mortality-chart-container'));

    //option = {
    //    backgroundColor: '#fff',

        

    //    tooltip: {
    //        trigger: 'item',
    //        formatter: "{a} <br/>{b} : {c} ({d}%)"
    //    },

    //    visualMap: {
    //        show: false,
    //        min: 0,
    //        max: 50,
    //        inRange: {
    //            colorLightness: [0, 2]
    //        }
    //    },
    //    series: [
    //        {
    //            name: 'Mortality Percentage',
    //            type: 'pie',
    //            radius: '80%',
    //            center: ['50%', '50%'],
    //            data: dataobject.sort(function (a, b) { return a.value - b.value; }),
                
    //            label: {
    //                normal: {
    //                    textStyle: {
    //                        color: 'rgba(0, 0, 0, 0.3)'
    //                    }
    //                }
    //            },
    //            labelLine: {
    //                normal: {
    //                    lineStyle: {
    //                        color: 'rgba(0, 0, 0, 0.3)'
    //                    },
    //                    smooth: 0.2,
    //                    length: 10,
    //                    length2: 20
    //                }
    //            },
    //            itemStyle: {
    //                normal: {
    //                    color: '#c23531',
    //                    shadowBlur: 200,
    //                    shadowColor: 'rgb(68, 153, 237)'
    //                }
    //            },

    //            animationType: 'scale',
    //            animationEasing: 'elasticOut',
    //            animationDelay: function (idx) {
    //                return Math.random() * 200;
    //            }
    //        }
    //    ]
    //};

    //myChart.setOption(option);

     var myChart = echarts.init(document.getElementById('mortality-chart-container'));

    option = {
        title: {
            text: 'Mortality Rate',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            position: function (pos, params, dom, rect, size) {
                // tooltip will be fixed on the right if mouse hovering on the left,
                // and on the left if hovering on the right.
                var obj = { top: 60 };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
            },
            
        },
        

        series: [
            {
                name: 'Mortality Percentage',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                        
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: dataobject.sort(function (a, b) { return a.value - b.value; }),
                
            }
        ]
    };
    myChart.setOption(option);

    $('#mortality-percentage-chart-result').fadeIn(300);
}
