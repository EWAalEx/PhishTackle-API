function resetForm() {
    document.querySelector("#phishing-form").reset();
}

function regexCheck(pattern, text) {
    try {
        const array = [...text.matchAll(pattern)];
        return array;
    } catch (error) {
        return [`check failed error: ${error}`];
    }
}