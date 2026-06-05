// 选座页面脚本
document.addEventListener('DOMContentLoaded', () => {
    const seatGrid = document.getElementById('seatGrid');
    const selectedSeatsDisplay = document.getElementById('selectedSeats');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const confirmBtn = document.getElementById('confirmBtn');

    const ticketPrice = 40;
    const rows = 10;
    const cols = 10;

    // 预设已售座位，用于区分已售、可选、已选三种状态。
    const soldSeats = new Set([
        '1-3', '1-4', '2-5', '3-6', '4-7',
        '5-2', '6-9', '7-3', '8-8', '9-1', '10-10'
    ]);

    const selectedSeats = new Set();
    const seatHandlers = new Map();

    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
            const seat = document.createElement('div');
            const key = `${row}-${col}`;

            seat.classList.add('seat');
            seat.dataset.key = key;
            seat.title = formatSeatName(key);

            if (soldSeats.has(key)) {
                seat.classList.add('sold');
            } else {
                seat.classList.add('available');
                const handler = () => toggleSeat(seat, key);
                seatHandlers.set(key, handler);
                seat.addEventListener('click', handler);
            }

            seatGrid.appendChild(seat);
        }
    }

    function toggleSeat(seat, key) {
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add('available');
            selectedSeats.delete(key);
        } else {
            seat.classList.remove('available');
            seat.classList.add('selected');
            selectedSeats.add(key);
        }

        updateInfo();
    }

    function formatSeatName(key) {
        const [row, col] = key.split('-').map(Number);
        const rowLetter = String.fromCharCode('A'.charCodeAt(0) + row - 1);
        return `${rowLetter}${col}`;
    }

    function updateInfo() {
        const names = Array.from(selectedSeats).map(formatSeatName);

        selectedSeatsDisplay.textContent = names.length ? names.join(', ') : '无';
        totalPriceDisplay.textContent = `¥${names.length * ticketPrice}`;
    }

    confirmBtn.addEventListener('click', () => {
        if (selectedSeats.size === 0) {
            alert('您尚未选择任何座位！');
            return;
        }

        const names = Array.from(selectedSeats).map(formatSeatName);
        const total = names.length * ticketPrice;

        alert(`选座成功！\n您选择的座位：${names.join(', ')}\n总票价：¥${total}`);

        // 支付确认后，将已选座位变为已售状态。
        selectedSeats.forEach((key) => {
            soldSeats.add(key);
            const seat = seatGrid.querySelector(`[data-key="${key}"]`);
            const handler = seatHandlers.get(key);

            if (seat) {
                seat.classList.remove('selected', 'available');
                seat.classList.add('sold');
            }

            if (seat && handler) {
                seat.removeEventListener('click', handler);
            }
        });

        selectedSeats.clear();
        updateInfo();
    });
});
