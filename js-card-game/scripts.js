const animals = [
    'jellyfish.png', 'cow.png', 'koala.png', 'sheep.png', 
    'zebra.png', 'panda.png', 'tiger.png', 'bear.png'
]; // Hayvan resim dosyalarının isimlerini içeren bir dizi

let cardsArray = [...animals, ...animals]; // Kartların iki setini oluşturuyoruz
let gameBoard = document.getElementById('game-board'); // Oyun tahtası div'ini seçiyoruz
let scoreElement = document.getElementById('score'); // Skor göstergesini seçiyoruz
let moveCounterElement = document.getElementById('moves'); // Hamle sayacını seçiyoruz
let timerElement = document.getElementById('timer'); // Zaman göstergesini seçiyoruz
let resetButton = document.createElement('button'); // Resetleme butonu oluşturuyoruz
let flippedCards = []; // Açılmış kartları tutacak dizi
let score = 0; // Başlangıç skoru
let moves = 0; // Başlangıç hamle sayısı
let matchedPairs = 0; // Eşleşen kartların sayısı
let gameStarted = false; // Oyun başladı mı diye kontrol ediyoruz
let timerInterval; // Zamanlayıcıyı tutacak değişken
let timeElapsed = 0; // Geçen süreyi takip ediyoruz

// Kartları karıştırma işlemi
cardsArray = cardsArray.sort(() => Math.random() - 0.5);

// Kartları oluşturma ve oyun tahtasına yerleştirme işlemi
cardsArray.forEach(animal => {
    const card = document.createElement('div'); // Her bir kart için bir div oluşturuyoruz
    card.classList.add('card'); // 'card' sınıfını karta ekliyoruz
    card.dataset.animal = animal; // Hayvan ismini kartın data-animal özelliğine ekliyoruz

    const img = document.createElement('img'); // Resim etiketi oluşturuyoruz
    img.src = `images/${animal}`; // Resmin kaynak yolunu belirliyoruz ('images' klasöründe olduğunu varsayıyoruz)

    card.appendChild(img); // Resmi kart div'ine ekliyoruz
    gameBoard.appendChild(card); // Kartı oyun tahtasına ekliyoruz

    card.addEventListener('click', flipCard); // Kart tıklandığında 'flipCard' fonksiyonunu çağırıyoruz
});

// Zamanlayıcı başlatma fonksiyonu
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++; // Geçen süreyi artırıyoruz
        timerElement.innerText = `Time: ${timeElapsed}s`; // Zaman göstergesini güncelliyoruz
    }, 1000); // Her saniyede bir çalışacak şekilde ayarlıyoruz
}

// Zamanlayıcıyı durdurma fonksiyonu
function stopTimer() {
    clearInterval(timerInterval); // Zamanlayıcıyı temizliyoruz
}

// Kartı çevirme fonksiyonu
function flipCard() {
    if (!gameStarted) { // Eğer oyun başlamadıysa
        gameStarted = true; // Oyun başladığını işaretliyoruz
        startTimer(); // Zamanlayıcıyı başlatıyoruz
    }
    
    // İki karttan fazla açılmamış ve mevcut kart açılmamışsa
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped'); // Kartı çeviriyoruz
        flippedCards.push(this); // Kartı açılan kartlar dizisine ekliyoruz

        if (flippedCards.length === 2) { // İki kart açıldıysa
            moves++; // Hamle sayısını artırıyoruz
            moveCounterElement.innerText = `Moves: ${moves}`; // Hamle sayısını güncelliyoruz
            setTimeout(checkMatch, 800); // 0.8 saniye sonra eşleşme kontrolü yapıyoruz
        }
    }
}

// Kartların eşleşip eşleşmediğini kontrol eden fonksiyon
function checkMatch() {
    const [card1, card2] = flippedCards; // Açılmış iki kartı seçiyoruz

    if (card1.dataset.animal === card2.dataset.animal) { // Eğer kartlar eşleşiyorsa
        score += 10; // Skoru artırıyoruz
        matchedPairs++; // Eşleşen kart sayısını artırıyoruz
        scoreElement.innerText = `Score: ${score}`; // Skor göstergesini güncelliyoruz

        flippedCards = []; // Açılan kartlar dizisini temizliyoruz

        // Eğer tüm kartlar eşleştiyse (tüm çiftler bulunduysa)
        if (matchedPairs === animals.length) {
            stopTimer(); // Zamanlayıcıyı durduruyoruz
            setTimeout(() => alert(`Tebrikler! ${moves} hamlede ve ${timeElapsed} saniyede kazandınız.`), 500); // Oyuncuyu bilgilendiriyoruz
            resetButton.style.display = 'block'; // Reset butonunu görünür hale getiriyoruz
        }
    } else {
        // Kartlar eşleşmediyse
        card1.classList.remove('flipped'); // İlk kartı geri çeviriyoruz
        card2.classList.remove('flipped'); // İkinci kartı geri çeviriyoruz
        flippedCards = []; // Açılan kartlar dizisini temizliyoruz
    }
}

// Oyunu sıfırlayan fonksiyon
function resetGame() {
    gameBoard.innerHTML = ''; // Oyun tahtasını temizliyoruz
    cardsArray = [...animals, ...animals].sort(() => Math.random() - 0.5); // Kartları yeniden karıştırıyoruz
    flippedCards = []; // Açılan kartları temizliyoruz
    score = 0; // Skoru sıfırlıyoruz
    moves = 0; // Hamle sayısını sıfırlıyoruz
    matchedPairs = 0; // Eşleşen çift sayısını sıfırlıyoruz
    timeElapsed = 0; // Zamanı sıfırlıyoruz
    gameStarted = false; // Oyunun başlamadığını belirtiyoruz
    scoreElement.innerText = `Score: 0`; // Skor göstergesini sıfırlıyoruz
    moveCounterElement.innerText = `Moves: 0`; // Hamle sayacını sıfırlıyoruz
    timerElement.innerText = `Time: 0s`; // Zaman göstergesini sıfırlıyoruz
    resetButton.style.display = 'none'; // Reset butonunu tekrar gizliyoruz

    // Kartları yeniden oluşturup tahtaya ekliyoruz
    cardsArray.forEach(animal => {
        const card = document.createElement('div'); // Yeni kart div'i oluşturuyoruz
        card.classList.add('card'); // 'card' sınıfını ekliyoruz
        card.dataset.animal = animal; // Hayvanı kartın data-animal özelliğine ekliyoruz

        const img = document.createElement('img'); // Resim etiketi oluşturuyoruz
        img.src = `images/${animal}`; // Resim kaynağını belirliyoruz

        card.appendChild(img); // Resmi karta ekliyoruz
        gameBoard.appendChild(card); // Kartı oyun tahtasına ekliyoruz

        card.addEventListener('click', flipCard); // Kart tıklanınca 'flipCard' fonksiyonu çalışsın
    });
}

// Reset butonunu ekleme ve görünüm ayarları
resetButton.innerText = "Oyunu Yeniden Başlat"; // Buton metnini belirliyoruz
resetButton.style.display = 'none'; // Buton başlangıçta gizlenmiş olacak
resetButton.style.marginTop = '20px'; // Üstten boşluk ekliyoruz
resetButton.addEventListener('click', resetGame); // Butona tıklayınca reset fonksiyonu çalışacak
document.body.appendChild(resetButton); // Reset butonunu sayfaya ekliyoruz
