document.getElementById('index-menu-toggle').addEventListener('click', function(event) {
    event.stopPropagation(); // メニュー以外のクリックで閉じるためにバブルを止める
    var menu = document.getElementById('menu');
    var homeText = document.querySelector('.index-home');
    var searchText = document.querySelector('.index-search');

    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
        // HOMEを非表示にしてsearchを表示
        homeText.style.display = 'none';
        searchText.style.display = 'block';
    } else {
        menu.style.display = 'none';
        // HOMEを表示してsearchを非表示
        homeText.style.display = 'block';
        searchText.style.display = 'none';
    }
});

document.getElementById('close-menu').addEventListener('click', function() {
    var menu = document.getElementById('menu');
    var homeText = document.querySelector('.index-home');
    var searchText = document.querySelector('.index-search');

    menu.style.display = 'none';
    // HOMEを表示してsearchを非表示
    homeText.style.display = 'block';
    searchText.style.display = 'none';
});

// メニュー以外の部分をクリックするとメニューを閉じる
document.addEventListener('click', function(event) {
    var menu = document.getElementById('menu');
    var menuToggle = document.getElementById('menu-toggle');
    var homeText = document.querySelector('.index-home');
    var searchText = document.querySelector('.index-search');

    if (menu.style.display === 'flex' && !menu.contains(event.target) && event.target !== menuToggle) {
        menu.style.display = 'none';
        // HOMEを表示してsearchを非表示
        homeText.style.display = 'block';
        searchText.style.display = 'none';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById('logout-link');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();  // デフォルトのリンク遷移をキャンセル
  
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = logoutLink.href;  // hrefに設定されたログアウトURLをフォームのactionに指定
  
            // CSRFトークンを追加
            const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
  
            // フォームを送信
            document.body.appendChild(form);
            form.submit();
        });
    }
  });