const sholatData = [
    { id: 'subuh', name: 'Subuh', time: '04:30' },
    { id: 'dzuhur', name: 'Dzuhur', time: '12:00' },
    { id: 'ashar', name: 'Ashar', time: '15:15' },
    { id: 'maghrib', name: 'Maghrib', time: '18:00' },
    { id: 'isya', name: 'Isya', time: '19:15' }
];

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('current-date').innerText = new Date().toLocaleDateString('id-ID', options);

const sholatListContainer = document.getElementById('sholat-list');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resetBtn = document.getElementById('reset-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    darkModeBtn.innerText = '☀️';
}

darkModeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        darkModeBtn.innerText = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeBtn.innerText = '☀️';
    }
});

const getTodayKey = () => {
    const d = new Date();
    return jurnal_sholat_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()};
};

const loadData = () => {
    const saved = localStorage.getItem(getTodayKey());
    return saved ? JSON.parse(saved) : {};
};

let dailyRecord = loadData();

const renderApp = () => {
    sholatListContainer.innerHTML = '';
    let completedCount = 0;

    sholatData.forEach(item => {
        const isChecked = dailyRecord[item.id] || false;
        if (isChecked) completedCount++;

        const div = document.createElement('div');
        div.className = 'sholat-item';
        div.innerHTML = `
            <div class="sholat-info">
                <label for="${item.id}">${item.name}</label>
                <span>Estimasi: ${item.time}</span>
            </div>
            <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''}>
        `;

        const checkbox = div.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            dailyRecord[item.id] = e.target.checked;
            localStorage.setItem(getTodayKey(), JSON.stringify(dailyRecord));
            renderApp();
        });

        sholatListContainer.appendChild(div);
    });

    const percentage = (completedCount / sholatData.length) * 100;
    progressFill.style.width = ${percentage}%;
    progressText.innerText = ${completedCount}/${sholatData.length} Sholat Selesai;
};

resetBtn.addEventListener('click', () => {
    if (confirm('Yakin ingin mereset catatan sholat hari ini?')) {
        dailyRecord = {};
        localStorage.removeItem(getTodayKey());
        renderApp();
    }
});

renderApp();
