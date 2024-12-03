document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item-unique");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question-unique");
        const answer = item.querySelector(".faq-answer-unique");
        const toggleBtn = item.querySelector(".faq-toggle-btn");

        question.addEventListener("click", () => {
            // Toggle visibility of the answer
            answer.classList.toggle("open");
            // Rotate the button arrow
            toggleBtn.classList.toggle("open");
        });
    });
});
