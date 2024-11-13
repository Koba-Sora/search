document.getElementById('menu-toggle').addEventListener('click', function(event) {
    event.stopPropagation(); // メニュー以外のクリックで閉じるためにバブルを止める
    var menu = document.getElementById('menu');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
});

document.getElementById('close-menu').addEventListener('click', function() {
    document.getElementById('menu').style.display = 'none';
});

// メニュー以外の部分をクリックするとメニューを閉じる
document.addEventListener('click', function(event) {
    var menu = document.getElementById('menu');
    var menuToggle = document.getElementById('menu-toggle');

    if (menu.style.display === 'flex' && !menu.contains(event.target) && event.target !== menuToggle) {
        menu.style.display = 'none';
    }
});