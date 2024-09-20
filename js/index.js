"use strict";
window.addEventListener("load", () => {
    document.getElementById("google").addEventListener("keypress", (e) => {
        console.log(e);
        if (e.key == "Enter") {
            let url = new URL("https://google.com/search");
            url.searchParams.set("q", e.target.value);
            if (e.ctrlKey)
                window.open(url, "_blank");
            else
                location.href = url.toString();
        }
    });
    window.addEventListener("focus", () => {
        if (is_april_fools() || Math.random() < 0.04) {
            let aud = document.createElement("audio");
            aud.src = "aud/vineboom.ogg";
            document.body.appendChild(aud);
            let img = document.createElement("img");
            img.src = "img/an871k4o1sn51.png";
            img.classList.add("funny");
            aud.addEventListener("ended", () => {
                try {
                    img.outerHTML = "";
                }
                catch (_a) { }
                aud.outerHTML = "";
            });
            aud
                .play()
                .then(() => {
                document.body.appendChild(img);
            })
                .catch(() => {
                aud.dispatchEvent(new Event("ended"));
            });
        }
    });
});
function is_april_fools() {
    let d = new Date();
    return d.getDate() == 1 && d.getMonth() == 4;
}
