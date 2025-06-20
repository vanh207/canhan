 // Danh sách bài hát
const playlist = [
    {
        title: "Mix 1",
        file: "15 date.mp3 "
    },
    {
        title: "Mix 2",
        file: "1990s memories.mp3"
    },
    {
        title: "Mix 3",
        file: "nhacimtrenbar.mp3"
    },
       {
        title: "Mix 4",
        file: "1st.mp3"
    },
       {
        title: "Mix 5",
        file: "2st.mp3"
    },
       {
        title: "Mix 6",
        file: "memories 2.mp3"
    },
       {
        title: "Mix 7",
        file: "3st.mp3"
    },
       {
        title: "Mix 8",
        file: "4st.mp3"
    },
];

// Lấy các phần tử DOM
const player = document.getElementById('player');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const albumList = document.getElementById('album-list');
const musicFileInput = document.getElementById('music-file');

let currentSongIndex = 0;
let songs = [...playlist];
           // Tải bài hát và tự động phát
        function loadSong(index, autoPlay = true) {
            if (songs.length === 0) return;
            
            currentSongIndex = index;
            const song = songs[index];
            player.src = song.file;
            songTitle.textContent = song.title;
            songArtist.textContent = song.artist;
            
            player.addEventListener('canplay', () => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                
                // Tự động phát khi bài hát đã sẵn sàng
                if (autoPlay) {
                    const playPromise = player.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                            // Cập nhật giao diện khi phát thành công
                            updateActiveSong();
                        })
                        .catch(error => {
                            showToast('Nhấn Play để phát nhạc', 'info');
                        });
                    }
                    
                }

                // Thiết lập AudioContext cho visualizer
        function setupAudioContext() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 64;
                
                const source = audioContext.createMediaElementSource(player);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            }
            
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            updateVisualizer();
        }

        // Cập nhật visualizer
        function updateVisualizer() {
            analyser.getByteFrequencyData(dataArray);
            
            visualizerBars.forEach((bar, index) => {
                const value = dataArray[index] / 255;
                const height = value * 100;
                bar.style.height = `${height}%`;
                bar.style.opacity = value + 0.1;
            });
            
            animationId = requestAnimationFrame(updateVisualizer);
        }
                // Khởi tạo AudioContext
                if (!window.audioContext) {
                    setupAudioContext();
                }
            }, { once: true });
            
            player.addEventListener('error', () => {
                showToast('Không thể tải bài hát', 'error');
                songTitle.textContent = 'Lỗi tải bài hát';
                songArtist.textContent = 'Vui lòng chọn bài khác';
            });
        }

  // Tạo danh sách album
        function initializeAlbum() {
            albumList.innerHTML = '';
            songs.forEach((song, index) => {
                const albumItem = document.createElement('div');
                albumItem.className = 'album-item';
                albumItem.innerHTML = `
                    <i class="fas fa-music"></i>
                    <div>
                        <div>${song.title}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">${song.artist}</div>
                    </div>
                `;
                albumItem.addEventListener('click', () => {
                    loadSong(index); // Tải và tự động phát khi nhấn vào bài hát
                });
                albumList.appendChild(albumItem);
            });
        }
// Xử lý play/pause
        playBtn.addEventListener('click', () => {
            if (player.paused) {
                if (player.src) {
                    const playPromise = player.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        })
                        .catch(error => {
                            showToast('Nhấn Play lần nữa để phát nhạc', 'info');
                        });
                    }
                }
            } else {
                player.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

// Xử lý next/prev
prevBtn.addEventListener('click', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (!player.paused) player.play();
});

nextBtn.addEventListener('click', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (!player.paused) player.play();
});

// Khi bài hát kết thúc
player.addEventListener('ended', () => {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    player.play();
});

// Cập nhật progress bar
player.addEventListener('timeupdate', () => {
    const progress = (player.currentTime / player.duration) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Cập nhật thời gian
    currentTimeDisplay.textContent = formatTime(player.currentTime);
    durationDisplay.textContent = formatTime(player.duration);
});

// Click vào progress bar để chuyển vị trí
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = player.duration;
    player.currentTime = (clickX / width) * duration;
});

// Định dạng thời gian
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Xử lý khi chọn file nhạc
musicFileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        songs = Array.from(files).map(file => ({
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Local file",
            file: URL.createObjectURL(file)
        }));
        
        initializeAlbum();
        loadSong(0);
    }
});

// Khởi tạo
initializeAlbum();
loadSong(0);

      // Điều chỉnh âm lượng
        volumeSlider.addEventListener('input', function() {
            player.volume = this.value;
        });

        // Progress bar
        player.addEventListener('timeupdate', () => {
            const progress = (player.currentTime / player.duration) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Update time display
            currentTimeDisplay.textContent = formatTime(player.currentTime);
            durationDisplay.textContent = formatTime(player.duration);
        });

        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = player.duration;
            player.currentTime = (clickX / width) * duration;
        });

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // Real Time Clock with smooth animation
        function updateRealTimeClock() {
            const now = new Date();
            
            // Format time with leading zeros
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            
            // Smooth transition for seconds
            const clockElement = document.getElementById('real-time-clock');
            clockElement.style.opacity = 0;
            setTimeout(() => {
                clockElement.textContent = `${hours}:${minutes}:${seconds}`;
                clockElement.style.opacity = 1;
            }, 100);
            
            // Format date
            const date = now.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            document.getElementById('current-date').textContent = date;
        }

        // Countdown Timer
        let countdownInterval;
        
        function setCountdown() {
            const timeString = document.getElementById('countdown-time').value;
            if (!timeString) {
                alert("Vui lòng chọn thời gian đếm ngược");
                return;
            }
            
            const [hours, minutes] = timeString.split(':').map(Number);
            const totalSeconds = hours * 3600 + minutes * 60;
            
            if (totalSeconds <= 0) {
                alert("Vui lòng chọn thời gian lớn hơn 00:00");
                return;
            }
            
            clearInterval(countdownInterval);
            
            let remainingSeconds = totalSeconds;
            
            countdownInterval = setInterval(() => {
                remainingSeconds--;
                
                if (remainingSeconds < 0) {
                    clearInterval(countdownInterval);
                    alert("Đã hết thời gian đếm ngược!");
                    return;
                }
                
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                
                document.getElementById('minutes').textContent = mins.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = secs.toString().padStart(2, '0');
            }, 1000);
        }

        // Reminders
        function addReminder() {
            const input = document.getElementById('new-reminder');
            const text = input.value.trim();
            if (!text) return;
            
            const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
            const newReminder = {
                id: Date.now(),
                text: text,
                time: new Date().toLocaleString('vi-VN')
            };
            
            reminders.push(newReminder);
            localStorage.setItem('reminders', JSON.stringify(reminders));
            input.value = '';
            renderReminders();
        }
        
        function deleteReminder(id) {
            let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
            reminders = reminders.filter(reminder => reminder.id !== id);
            localStorage.setItem('reminders', JSON.stringify(reminders));
            renderReminders();
        }
        
        function renderReminders() {
            const list = document.getElementById('reminders-list');
            list.innerHTML = '';
            
            const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
            reminders.forEach(reminder => {
                const li = document.createElement('li');
                li.className = 'reminder-item';
                li.innerHTML = `
                    <div class="reminder-text">
                        <div>${reminder.text}</div>
                        <div class="reminder-time">${reminder.time}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteReminder(${reminder.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                list.appendChild(li);
            });
        }

        // Tic Tac Toe Game
        let currentPlayer = 'X';
        let gameBoard = ['', '', '', '', '', '', '', '', ''];
        let gameActive = true;
        const gameBoardElement = document.getElementById('game-board');
        const gameStatusElement = document.getElementById('game-status');

        function initializeGame() {
            gameBoardElement.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.setAttribute('data-index', i);
                cell.addEventListener('click', handleCellClick);
                gameBoardElement.appendChild(cell);
            }
            updateGameStatus();
        }

        function handleCellClick(e) {
            const index = e.target.getAttribute('data-index');
            
            if (gameBoard[index] !== '' || !gameActive) return;
            
            gameBoard[index] = currentPlayer;
            e.target.textContent = currentPlayer;
            
            if (checkWinner()) {
                gameStatusElement.textContent = `Người chơi ${currentPlayer} thắng!`;
                gameActive = false;
                return;
            }
            
            if (gameBoard.every(cell => cell !== '')) {
                gameStatusElement.textContent = 'Hòa!';
                gameActive = false;
                return;
            }
            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateGameStatus();
        }

        function checkWinner() {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            
            return winPatterns.some(pattern => {
                const [a, b, c] = pattern;
                return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
            });
        }

        function updateGameStatus() {
            gameStatusElement.textContent = `Lượt chơi: ${currentPlayer}`;
        }

        function resetGame() {
            currentPlayer = 'X';
            gameBoard = ['', '', '', '', '', '', '', '', ''];
            gameActive = true;
            initializeGame();
        }

        // Temperature Converter
        function convertTemperature(from) {
            let celsius, fahrenheit, kelvin;
            
            switch (from) {
                case 'celsius':
                    celsius = parseFloat(document.getElementById('celsius-input').value) || 0;
                    fahrenheit = (celsius * 9/5) + 32;
                    kelvin = celsius + 273.15;
                    break;
                case 'fahrenheit':
                    fahrenheit = parseFloat(document.getElementById('fahrenheit-input').value) || 0;
                    celsius = (fahrenheit - 32) * 5/9;
                    kelvin = celsius + 273.15;
                    break;
                case 'kelvin':
                    kelvin = parseFloat(document.getElementById('kelvin-input').value) || 0;
                    celsius = kelvin - 273.15;
                    fahrenheit = (celsius * 9/5) + 32;
                    break;
            }
            
            document.getElementById('celsius-input').value = celsius.toFixed(2);
            document.getElementById('fahrenheit-input').value = fahrenheit.toFixed(2);
            document.getElementById('kelvin-input').value = kelvin.toFixed(2);
        }

        // Star Rating
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                document.querySelectorAll('.star').forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
                
                // Lưu đánh giá
                localStorage.setItem('userRating', rating);
                document.getElementById('rating-text').textContent = `Bạn đã đánh giá ${rating} sao!`;
            });
        });

        // Load saved rating
        const savedRating = localStorage.getItem('userRating');
        if (savedRating) {
            document.querySelectorAll('.star').forEach((star, i) => {
                if (i < savedRating) {
                    star.classList.add('active');
                }
            });
            document.getElementById('rating-text').textContent = `Bạn đã đánh giá ${savedRating} sao!`;
        }

        // Calendar
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        function renderCalendar() {
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
            
            const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
                               "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
            
            document.getElementById('calendar-title').textContent = 
                `${monthNames[currentMonth]}, ${currentYear}`;
            
            const calendarGrid = document.getElementById('calendar-grid');
            calendarGrid.innerHTML = '';
            
            // Thêm các ngày từ tháng trước
            const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
            for (let i = 0; i < startingDay; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
                calendarGrid.appendChild(dayElement);
            }
            
            // Thêm các ngày của tháng hiện tại
            const today = new Date();
            for (let i = 1; i <= daysInMonth; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = i;
                
                if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    dayElement.classList.add('today');
                }
                
                calendarGrid.appendChild(dayElement);
            }
            
            // Thêm các ngày từ tháng sau
            const totalCells = startingDay + daysInMonth;
            const remainingCells = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
            
            for (let i = 1; i <= remainingCells; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = i;
                calendarGrid.appendChild(dayElement);
            }
        }

        function changeMonth(step) {
            currentMonth += step;
            
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            } else if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            
            renderCalendar();
        }

        // Weather Effects
        function startWeatherEffect(type) {
            const container = document.getElementById('weather-container');
            container.innerHTML = '';
            
            if (type === 'rain') {
                for (let i = 0; i < 100; i++) {
                    createRainDrop();
                }
            } else if (type === 'snow') {
                for (let i = 0; i < 50; i++) {
                    createSnowFlake();
                }
            }
        }

        function createRainDrop() {
            const drop = document.createElement('div');
            drop.style.position = 'absolute';
            drop.style.width = '2px';
            drop.style.height = '15px';
            drop.style.backgroundColor = 'rgba(174, 194, 224, 0.5)';
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.top = '-20px';
            drop.style.zIndex = '0';
            
            document.getElementById('weather-container').appendChild(drop);
            
            const animationDuration = Math.random() * 0.5 + 0.5;
            
            drop.animate([
                { top: '-20px', opacity: 1 },
                { top: '100vh', opacity: 0.2 }
            ], {
                duration: animationDuration * 1000,
                iterations: Infinity
            });
        }

        function createSnowFlake() {
            const flake = document.createElement('div');
            flake.innerHTML = '❄';
            flake.style.position = 'absolute';
            flake.style.fontSize = Math.random() * 10 + 10 + 'px';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.top = '-20px';
            flake.style.zIndex = '0';
            flake.style.opacity = Math.random() * 0.5 + 0.5;
            
            document.getElementById('weather-container').appendChild(flake);
            
            const animationDuration = Math.random() * 5 + 5;
            const xMovement = Math.random() * 200 - 100;
            
            flake.animate([
                { top: '-20px', left: flake.style.left },
                { top: '100vh', left: `calc(${flake.style.left} + ${xMovement}px)` }
            ], {
                duration: animationDuration * 1000,
                iterations: Infinity
            });
        }

        function clearWeatherEffects() {
            document.getElementById('weather-container').innerHTML = '';
        }

        // View Counter
        function updateViewCount() {
            let views = localStorage.getItem('pageViews') || 0;
            views = parseInt(views) + 1;
            localStorage.setItem('pageViews', views);
            document.getElementById('view-count').textContent = views;
        }

        // Modal
        function showModal(title, content) {
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-content').textContent = content;
            document.getElementById('modal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }

        // Dark Mode Toggle
        function toggleDarkMode() {
            document.body.classList.toggle('light-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('light-mode'));
            
            const icon = document.querySelector('#dark-mode-btn i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }

        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Password protection
            if (!localStorage.getItem('authenticated')) {
                document.getElementById('password-modal').style.display = 'flex';
            }
            
            // Real time clock
            updateRealTimeClock();
            setInterval(updateRealTimeClock, 1000);
            
            // Countdown timer
            document.getElementById('countdown-time').value = '00:05:00';
            
            // Initialize other features
            renderReminders();
            initializeGame();
            renderCalendar();
            updateViewCount();
            initializeAlbum();
            
            // Check dark mode
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('light-mode');
                document.querySelector('#dark-mode-btn i').classList.remove('fa-moon');
                document.querySelector('#dark-mode-btn i').classList.add('fa-sun');
            }
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                closeModal();
            }
        });
        // Toast Notification
    function showToast(message, type = 'success') {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toast-container').appendChild(toast);
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Thêm style cho toast
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .toast {
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            color: white;
            display: flex;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateX(150%);
            animation: slideIn 0.5s forwards, fadeOut 0.5s 2.5s forwards;
        }
        .toast.success {
            background: #4cc9f0;
        }
        .toast.error {
            background: #f72585;
        }
        .toast.info {
            background: #4361ee;
        }
        .toast.warning {
            background: #f8961e;
        }
        .toast i {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        @keyframes slideIn {
            to { transform: translateX(0); }
        }
        @keyframes fadeOut {
            to { opacity: 0; }
        }
    `;
    function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    element.appendChild(cursor);
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i) + `<span class="typewriter-cursor">${text.charAt(i)}</span>`;
            i++;
            setTimeout(type, speed);
        } else {
            element.innerHTML = text + '<span class="typewriter-cursor"></span>';
            if (callback) callback();
        }
    }
    
    type();
}

function deleteText(element, text, speed, callback) {
    let i = text.length;
    
    function deleteChar() {
        if (i >= 0) {
            element.innerHTML = text.substring(0, i) + '<span class="typewriter-cursor"></span>';
            i--;
            setTimeout(deleteChar, speed / 2);
        } else {
            if (callback) callback();
        }
    }
    
    deleteChar();
}

function runMessageCycle() {
    // Message 1
    typeWriter(
        document.getElementById('typewriter-message'),
        'Chào mừng bạn đã đến với trang web của mình',
        100,
        () => {
            setTimeout(() => {
                deleteText(
                    document.getElementById('typewriter-message'),
                    'Chào mừng bạn đã đến với trang web của mình',
                    50,
                    () => {
                        // Message 2
                        typeWriter(
                            document.getElementById('typewriter-message'),
                            'Có gì lỗi về vấn đề gì trong trang web bạn để lại lời nhắn cho mình nhé',
                            100,
                            () => {
                                setTimeout(() => {
                                    deleteText(
                                        document.getElementById('typewriter-message'),
                                        'Có gì lỗi về vấn đề gì trong trang web bạn để lại lời nhắn cho mình nhé',
                                        50,
                                        runMessageCycle // Lặp lại chu kỳ
                                    );
                                }, 3000);
                            }
                        );
                    }
                );
            }, 3000);
        }
    );
}

// Bắt đầu hiệu ứng khi trang tải xong
document.addEventListener('DOMContentLoaded', runMessageCycle);
// Thêm hàm tạo hiệu ứng bong bóng
function createBubbles() {
    const colors = ['#ff4d4d', '#f9cb28', '#4dff4d', '#4df2ff', '#4d4dff', '#ff4dff'];
    const container = document.querySelector('.message-container');
    
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.width = bubble.style.height = (Math.random() * 20 + 5) + 'px';
        bubble.style.animationDuration = (Math.random() * 10 + 5) + 's';
        container.appendChild(bubble);
    }
}

// Thêm CSS cho bong bóng
const bubbleStyle = document.createElement('style');
bubbleStyle.textContent = `
    .bubble {
        position: absolute;
        border-radius: 50%;
        opacity: 0.3;
        animation: floatUp linear infinite;
        z-index: -1;
    }
    @keyframes floatUp {
        to { transform: translateY(-100vh) rotate(360deg) }
    }
`;
document.head.appendChild(bubbleStyle);

// Bắt đầu hiệu ứng khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    runMessageCycle();
});
    document.head.appendChild(toastStyle);