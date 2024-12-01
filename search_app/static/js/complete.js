window.addEventListener('load', function() {
    const mainContent = document.getElementById('main-content'); 
    // ページが完全に読み込まれたらフェードインアニメーションを適用
    mainContent.style.transition = 'opacity 1s ease-in';
    mainContent.style.opacity = 1;
});
