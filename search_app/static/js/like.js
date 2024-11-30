document.addEventListener("DOMContentLoaded", function() {
    const notificationBar = document.getElementById('notification-bar');
    
    // フォームが複数ある場合、すべてのフォームに対して処理を追加
    const addToCartForms = document.querySelectorAll('[id^="add-to-cart-form-"]');
    
    addToCartForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // フォームのデフォルトの動作を無効化

            const productId = form.id.split('-')[3]; // アイテムのIDを抽出
            const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value; // CSRFトークンを取得

            // フォームを非同期で送信
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'X-CSRFToken': csrfToken // CSRFトークンをヘッダーに追加
                }
            })
            .then(response => response.json())
            .then(data => {
                // 通知バーにメッセージを表示
                notificationBar.innerText = `${data.message} `;

                // 在庫切れの場合に背景色を変更
                if (data.status === 'out_of_stock') {
                    notificationBar.style.backgroundColor = 'orange';  // 背景色を赤に変更
                } else {
                    notificationBar.style.backgroundColor = 'lightgreen';  // 通常の背景色
                }
            
                notificationBar.style.display = 'block';

                // スライドインのアニメーションを適用
                notificationBar.classList.remove('slide-out');
                notificationBar.classList.add('slide-in');

                // 数秒後にスライドアウトのアニメーションを適用
                setTimeout(() => {
                    notificationBar.classList.remove('slide-in');
                    notificationBar.classList.add('slide-out');
                    
                    // アニメーション後に非表示にする
                    setTimeout(() => {
                        notificationBar.style.display = 'none';
                    }, 500); // スライドアウトアニメーションの時間（500ms）後に非表示にする
                }, 3000); // 3秒後にスライドアウト
            })
            .catch(error => {
                console.error('エラー:', error);
            });
        });
    });
});
