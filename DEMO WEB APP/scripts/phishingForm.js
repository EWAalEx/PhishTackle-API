const linksList = document.querySelector("#links-list");
const urlListener = document.querySelector("#url-listener");
const phishingTextContainer = document.querySelector("#text-contents");

urls = [];

function createTag() {
    linksList.querySelectorAll("li").forEach(li => li.remove());
    urls.slice().reverse().forEach(tag => {
        let liTag = `<li>${tag} <i class="fa fa-times" onclick="remove(this, '${tag}')"></i></li>`;
        linksList.insertAdjacentHTML("afterbegin", liTag);
    });
}

function remove(element, tag) {
    let index = urls.indexOf(tag);
    urls = [...urls.slice(0, index), ...urls.slice(index + 1)];
    element.parentElement.remove();
}

function addTag(e) {
    if (e.key == "Enter") {
        let tag = e.target.value.replace(/\s+/g, ' ');
        if (tag.length > 1) {
            tag.split(',').forEach(tag => {
                tag.replace(/\s/g, "");
                if (!urls.includes(tag)) {
                    urls.push(tag);
                    createTag();
                }
            });
        }
        e.target.value = "";
    }
}

function parseUrls() {
    const regexPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gmi;
    if (phishingTextContainer.value.trim() != "") {
        const textToCheck = phishingTextContainer.value;
        const regexResponse = regexCheck(regexPattern, textToCheck);

        for (index in regexResponse) {
            let url = regexResponse[index][0]
            if (!urls.includes(url)) {
                urls.push(url);
                createTag();
            }
        }
        
        console.log(urls);

    }
}

//todo create JSON object from both fields

urlListener.addEventListener("keyup", addTag);

linksList.addEventListener("click", function () {
    urlListener.focus();
});