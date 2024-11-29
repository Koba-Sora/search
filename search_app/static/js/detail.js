document.addEventListener('DOMContentLoaded', () => {
    const favoriteButton = document.querySelector('.favorite-button');

    if (favoriteButton) {
        favoriteButton.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            const liked = this.getAttribute('data-liked') === 'true';

            // APIのURLを定義
            const url = liked
                ? `/like_remove_item/${productId}/`  // お気に入り解除のURL
                : `/add_to_like/${productId}/`;     // お気に入り追加のURL

            // サーバーへのPOSTリクエスト
            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'), // CSRFトークンを含める
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // メッセージの表示
                    showMessage(data.message, data.status);

                    // ボタンの状態を更新
                    this.setAttribute('data-liked', !liked);
                    this.textContent = !liked ? 'お気に入りを解除' : 'お気に入りに追加';
                })
                .catch((error) => {
                    showMessage('エラーが発生しました。', 'error');
                });
        });
    }
});

// メイン画像を変更する関数
function changeMainImage(imgUrl) {
    var mainImage = document.getElementById('modalImage');
    mainImage.src = imgUrl;  // クリックされた画像のURLをmain_imgに設定
}


    document.addEventListener('DOMContentLoaded', function() {
        const likeForm = document.getElementById('likeForm');
        
        if (likeForm) {
            likeForm.addEventListener('submit', function(event) {
                event.preventDefault();  // フォームのデフォルト送信を防ぐ

                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                const productId = likeForm.action.split('/').pop();  // product.idをURLから取得

                // AJAXリクエストを送信
                fetch(`{% url 'search_app:add_to_like' product.id %}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify({ product_id: productId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);  // メッセージを表示
                        // リダイレクトしてproduct_detailページに戻る
                        window.location.href = window.location.href; // 現在のページにリダイレクト
                    } else {
                        alert('Error: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error processing your request.');
                });
            });
        }
    });

