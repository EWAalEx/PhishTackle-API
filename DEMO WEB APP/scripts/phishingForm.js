const linksContainer = document.querySelector("#links-container");
const linksList = document.querySelector("#links-list");
const urlListener = document.querySelector("#url-listener");
const phishingTextContainer = document.querySelector("#text-contents");

urls = [];

jsonObject = {};

function resetForm() {
    phishingTextContainer.value = "";
    urls.length = 0;
    linksList.querySelectorAll("li").forEach(li => li.remove());
}

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
    }
}

function analyseForm() {

    if (urlListener.value != "") {
        if (confirm("Would you like to add your in-progress url to the list of analysable urls?")) {
            urlListener.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
        }
    }

    if (phishingTextContainer.value != "") {
        parseUrls();
    }

    if (phishingTextContainer.value != "" && urls != []) {
        
        jsonObject = {
            "name": "Demo WebApp Test Data",
            "urls": urls,
            "content": phishingTextContainer.value,
            "tag": "To Test"
        };

        analyseData(jsonObject);
    } else {
        createMinimalNotification("Analysis Error", "No data to check was provided.\nNo API call made!", 3500, "error");
    }
}


urlListener.addEventListener("keyup", addTag);

linksList.addEventListener("click", function () {
    urlListener.focus();
});
linksContainer.addEventListener("click", function () {
    urlListener.focus();
});