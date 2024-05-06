function regexCheck(pattern, text) {
    try {
        const array = [...text.matchAll(pattern)];
        return array;
    } catch (error) {
        return [`check failed error: ${error}`];
    }
}

function createMinimalNotification(title, message, timeout, theme){
    window.createNotification({
        showDuration: timeout,
        theme : theme,
        positionClass: "nfc-bottom-right"
    }) ({
        title: title,
        message: message
    });
}