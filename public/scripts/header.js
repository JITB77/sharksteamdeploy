document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    // Header element
    header.innerHTML = `
        <div class="header">
            <div class="header-item">
                <a href="/"><h1>Sharks To-Do</h1></a>
            </div>
            <div class="header-item" id="hi2">
                <a href="/tasks"><h2>Tasks</h2></a>
            </div>
        </div>
    `;

    // Footer element
    footer.innerHTML = `
        <div class="footer">
            <p>Sharks Co. (c) 2024</p>
        </div>
    `;
});
