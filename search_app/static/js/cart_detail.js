

// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.update-quantity').forEach(button => {
//         button.addEventListener('click', function (event) {
//             event.preventDefault(); // フォームのデフォルト動作を防ぐ

//             // ボタンからデータを取得
//             const cartItemId = this.getAttribute('data-cart-item-id'); // アイテムID
//             const action = this.getAttribute('data-action'); // 増加 or 減少
//             const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value; // CSRFトークン

//             console.log('Cart Item ID:', cartItemId, 'Action:', action); // デバッグ用

//             // 非同期リクエストを送信
//             fetch(`/cart/update-quantity/${cartItemId}/`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': csrfToken // CSRFトークンを設定
//                 },
//                 body: JSON.stringify({ action: action }) // アクションを送信
//             })
//                 .then(response => {
//                     if (!response.ok) {
//                         return response.text().then(text => { throw new Error(text); });
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     if (data.quantity) {
//                         // 数量を更新
//                         const quantityElement = document.querySelector(`#quantity-${cartItemId}`);
//                         if (quantityElement) {
//                             quantityElement.textContent = `${data.quantity}個`;
//                         }
//                     }

//                     if (data.total_price) {
//                         // 合計金額を更新
//                         const totalPriceElement = document.querySelector('#total-price');
//                         if (totalPriceElement) {
//                             totalPriceElement.textContent = `合計金額: ${data.total_price.toLocaleString()}円`;
//                         }
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//         });
//     });
// });


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
