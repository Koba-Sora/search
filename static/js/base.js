
document.getElementById('menu-toggle').addEventListener('click', function(event) {
  event.stopPropagation(); // メニュー以外のクリックで閉じるためにバブルを止める
  var menu = document.getElementById('menu');
  var overlay = document.getElementById('overlay');

  if (menu.style.display === 'none' || menu.style.display === '') {
      menu.style.display = 'flex';
      overlay.style.display = 'block'; // オーバーレイを表示
  } else {
      menu.style.display = 'none';
      overlay.style.display = 'none'; // オーバーレイを非表示
  }
});

document.getElementById('close-menu').addEventListener('click', function() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('overlay').style.display = 'none'; // オーバーレイを非表示
});

// メニュー以外の部分をクリックするとメニューを閉じる
document.getElementById('overlay').addEventListener('click', function() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('overlay').style.display = 'none'; // オーバーレイを非表示
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
