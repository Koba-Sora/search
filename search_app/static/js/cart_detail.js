

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.update-quantity').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // フォームのデフォルト動作を防ぐ

            // ボタンからデータを取得
            const cartItemId = this.getAttribute('data-cart-item-id'); // アイテムID
            const action = this.getAttribute('data-action'); // 増加 or 減少
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value; // CSRFトークン

            console.log('Cart Item ID:', cartItemId, 'Action:', action); // デバッグ用

            // 非同期リクエストを送信
            fetch(`/cart/update-quantity/${cartItemId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken // CSRFトークンを設定
                },
                body: JSON.stringify({ action: action }) // アクションを送信
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text); });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.quantity) {
                        // 数量を更新
                        const quantityElement = document.querySelector(`#quantity-${cartItemId}`);
                        if (quantityElement) {
                            quantityElement.textContent = `${data.quantity}個`;
                        }
                    }

                    if (data.total_price) {
                        // 合計金額をカンマ区切りで更新
                        const totalPriceElement = document.querySelector('#total-price');
                        if (totalPriceElement) {
                            // 数値をカンマ区切りでフォーマット
                            const formattedTotalPrice = data.total_price.toLocaleString(); 
                            totalPriceElement.textContent = `${formattedTotalPrice}`;
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const purchaseButton = document.getElementById('purchase-button');
    const notificationBar = document.getElementById('notification-bar');
    const form = purchaseButton.closest('form');
    const mainContent = document.getElementById('main-content'); 

    if (purchaseButton) {
        purchaseButton.addEventListener('click', function(event) {
            event.preventDefault();  // フォーム送信を防ぐ

            // 確認ダイアログを表示
            const userConfirmed = window.confirm("購入を確定しますか？");

            if (userConfirmed) {
                // ユーザーが「OK」をクリックした場合

                // 通知バーを表示
                notificationBar.style.display = 'block';

                // 「購入処理を実行中...」のメッセージを設定
                notificationBar.innerText = "購入処理を実行中...";
                notificationBar.style.backgroundColor = 'lightblue';  // 実行中メッセージの色
                notificationBar.classList.remove('slide-out');
                notificationBar.classList.add('slide-in');  // スライドインアニメーション

                // 数秒後に「購入処理を実行中...」をスライドアウト
                setTimeout(() => {
                    notificationBar.classList.remove('slide-in');
                    notificationBar.classList.add('slide-out');  // スライドアウトアニメーション

                    // 数秒後に新しいメッセージに更新
                    setTimeout(() => {
                        // 購入完了メッセージに更新
                        notificationBar.innerText = "購入が完了しました！"; 
                        notificationBar.style.backgroundColor = 'lightgreen';  // 成功色に変更
                        notificationBar.classList.remove('slide-out');
                        notificationBar.classList.add('slide-in');  // スライドインアニメーション

                        // フォームを非同期で送信
                        fetch(form.action, {
                            method: 'POST',
                            body: new FormData(form),
                            headers: {
                                'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value
                            }
                        })
                        .then(response => response.json())  // レスポンスをJSONとして取得
                        .then(data => {
                            if (data.status === 'success') {
                                // 購入処理成功時
                                notificationBar.innerText = data.message;
                                notificationBar.style.backgroundColor = 'lightgreen';  // 成功メッセージ

                                // 通知バーを表示
                                notificationBar.style.display = 'block';

                                // 数秒後にスライドアウトアニメーションを適用
                                setTimeout(() => {
                                    notificationBar.classList.remove('slide-in');
                                    notificationBar.classList.add('slide-out');

                                    // アニメーション後に非表示にする
                                    setTimeout(() => {
                                        notificationBar.style.display = 'none';

                                        // フェードアウトアニメーションを適用
                                        mainContent.style.transition = 'opacity 1s ease-out';
                                        mainContent.style.opacity = 0;

                                        // アニメーション後にページ遷移
                                        setTimeout(() => {
                                            window.location.href = '/cart/checkout/complete/';  // リダイレクト先URL
                                        }, 1000);  // 1秒後にページ遷移
                                    }, 500);  // スライドアウトアニメーション後に非表示にする
                                }, 3000);  // 3秒後にスライドアウト開始
                            } else {
                                // 購入処理エラー時
                                notificationBar.innerText = data.message;
                                notificationBar.style.backgroundColor = 'lightcoral';  // エラーメッセージ

                                // 通知バーを表示
                                notificationBar.style.display = 'block';

                                // 数秒後にスライドアウトアニメーションを適用
                                setTimeout(() => {
                                    notificationBar.classList.remove('slide-in');
                                    notificationBar.classList.add('slide-out');
                                    
                                    // アニメーション後に非表示にする
                                    setTimeout(() => {
                                        notificationBar.style.display = 'none';
                                    }, 500);  // スライドアウトアニメーションの時間（500ms）後に非表示にする
                                }, 3000);  // 3秒後にスライドアウト
                            }
                        })
                        .catch(error => {
                            console.error('エラー:', error);
                        });
                    }, 1000);  // 新しいメッセージに変更するまでの時間（1秒）
                }, 2000);  // 「購入処理を実行中...」のスライドアウトを2秒後に開始
            } else {
                // ユーザーが「キャンセル」をクリックした場合
                console.log("購入がキャンセルされました。");
            }
        });
    }
});
