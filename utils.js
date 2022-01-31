// from https://gist.github.com/jcxplorer/823878
function createUUID() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += "-";
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}

// 時刻を取得
function nowTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const str = now.toISOString().slice(0, -1);
    return str;
}

// チャートを作成する
function createChart(canvas,title,labels,data,min=0,max=1,step=0.1) {
    let datasets = [];
    for(let key in data){
        datasets.push({
            label: key,
            data: data[key].data,
            borderColor: 'rgba(' + data[key].color + ')',
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: data[key].width
        });
    }
    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            title: { display: true, text: title },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: max,
                        suggestedMin: min,
                        stepSize: step
                    }
                }]
            },
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0
        }
    });
}

export { createUUID, nowTime, createChart };