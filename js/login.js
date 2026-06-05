// 登录页面脚本
// 账号和密码不做固定限制：只要用户填写完整即可进入选座页面。
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('请完整输入学号和密码');
            return;
        }

        try {
            localStorage.setItem('cinemaUsername', username);
        } catch (error) {
            // 本地存储不可用时不影响跳转。
        }

        window.location.href = 'seat.html';
    });
});
