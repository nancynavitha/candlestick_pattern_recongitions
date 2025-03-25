const canvas = document.getElementById('candlestickChart');
const ctx = canvas.getContext('2d');

const candlestickPatterns = {
    hammer: 'hammer',
    doji: 'doji',
    engulfing: 'engulfing'
};

function generateRandomData(numCandles = 50) {
    const data = [];
    let open = 100;
    for (let i = 0; i < numCandles; i++) {
        const high = open + Math.random() * 5 + 2;
        const low = open - Math.random() * 5 - 2;
        const close = open + (Math.random() - 0.5) * 10;
        data.push({ open, high, low, close });
        open = close;
    }
    return data;
}

function detectPatterns(data) {
    const patterns = [];
    for (let i = 1; i < data.length; i++) {
        const candle = data[i];
        const prev = data[i - 1];
        if (candle.close > candle.open && candle.low < candle.open - 2 * (candle.close - candle.open)) {
            patterns.push({ index: i, pattern: candlestickPatterns.hammer });
        }
        if (Math.abs(candle.open - candle.close) < (candle.high - candle.low) * 0.1) {
            patterns.push({ index: i, pattern: candlestickPatterns.doji });
        }
        if (candle.open < candle.close && prev.open > prev.close &&
            candle.open < prev.close && candle.close > prev.open) {
            patterns.push({ index: i, pattern: candlestickPatterns.engulfing });
        }
    }
    return patterns;
}

function plotChart(data, patterns) {
    const chartData = {
        datasets: [{
            label: 'Candlestick',
            data: data.map((d, i) => ({ x: i, o: d.open, h: d.high, l: d.low, c: d.close })),
            color: {
                up: '#26a69a',
                down: '#ef5350',
                unchanged: '#999'
            },
            backgroundColor: data.map((_, i) => {
                const pattern = patterns.find(p => p.index === i);
                if (pattern) {
                    if (pattern.pattern === candlestickPatterns.hammer) return 'green';
                    if (pattern.pattern === candlestickPatterns.doji) return 'blue';
                    if (pattern.pattern === candlestickPatterns.engulfing) return 'red';
                }
                return 'transparent';
            })
        }]
    };

    new Chart(ctx, {
        type: 'candlestick',
        data: chartData,
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { type: 'linear', display: true },
                y: { type: 'linear', display: true }
            },
            responsive: true
        }
    });
}

function main() {
    const data = generateRandomData();
    const patterns = detectPatterns(data);
    plotChart(data, patterns);
}

main();

