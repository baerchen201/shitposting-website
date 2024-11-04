class youtubeVideo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let thumbnail: HTMLImageElement = document.createElement("img");
    let channel_icon: HTMLImageElement = document.createElement("img");
    let title: HTMLSpanElement = document.createElement("span");
    let channel: HTMLSpanElement = document.createElement("span");

    let data_id: string | null = this.getAttribute("data-id");
    let data_thumbnail: string | null = this.getAttribute("data-thumbnail");
    let data_channel_icon: string | null =
      this.getAttribute("data-channel-icon");
    let data_title: string | null = this.getAttribute("data-title");
    let data_channel: string | null = this.getAttribute("data-channel");

    if (!data_id)
      throw new Error(
        `Empty attribute data-id for youtube-video object ${this}`
      );
    if (!data_thumbnail) data_thumbnail = "img/youtube-thumbnail.svg";
    if (!data_channel_icon) data_channel_icon = "img/youtube-channel-icon.svg";
    if (!data_title) data_title = "";
    if (!data_channel) data_channel = "";

    let anchor: HTMLAnchorElement = document.createElement("a");
    anchor.href = `https://youtu.be/${data_id}`;
    anchor.title = `Watch ${data_title ? data_title : "video"} on YouTube`;
    this.appendChild(anchor);

    thumbnail.src = data_thumbnail
      .replace("%id", data_id)
      .replace("%s", `https://img.youtube.com/vi/${data_id}/`);
    channel_icon.src = data_channel_icon;
    title.innerText = data_title;
    channel.innerText = data_channel;

    anchor.appendChild(thumbnail);
    anchor.appendChild(channel_icon);
    anchor.appendChild(title);
    anchor.appendChild(channel);
  }
}
class youtubeTrack extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let image: HTMLImageElement = document.createElement("img");
    let title: HTMLSpanElement = document.createElement("span");
    let composer: HTMLSpanElement = document.createElement("span");

    let data_id: string | null = this.getAttribute("data-id");
    let data_image: string | null = this.getAttribute("data-image");
    let data_title: string | null = this.getAttribute("data-title");
    let data_composer: string | null = this.getAttribute("data-composer");

    if (!data_id)
      throw new Error(
        `Empty attribute data-id for youtube-track object ${this}`
      );
    if (!data_image) data_image = "img/youtube-thumbnail.svg";
    if (!data_title) data_title = "";
    if (!data_composer) data_composer = "";

    let anchor: HTMLAnchorElement = document.createElement("a");
    anchor.href = `https://youtu.be/${data_id}`;
    anchor.title = `Listen to ${data_title ? data_title : "track"} on YouTube`;
    this.appendChild(anchor);

    image.src = data_image
      .replace("%id", data_id)
      .replace("%s", `https://img.youtube.com/vi/${data_id}/`);
    title.innerText = data_title;
    composer.innerText = data_composer;

    anchor.appendChild(image);
    anchor.appendChild(title);
    anchor.appendChild(composer);
  }
}

window.customElements.define("youtube-video", youtubeVideo);
window.customElements.define("youtube-track", youtubeTrack);

window.addEventListener("load", () => {
  // TODO: Add *proper* mobile detection
  const MOBILE: boolean = new URLSearchParams(location.search).has("mobile");
  if (MOBILE) document.children[0].classList.add("mobile");

  window.addEventListener("focus", () => {
    if (is_april_fools() || Math.random() < 0.04) {
      let aud = document.createElement("audio");
      aud.src = "aud/vineboom.ogg";
      document.body.appendChild(aud);

      let img = document.createElement("img");
      img.src = "img/Red_Amogus.png";
      img.classList.add("jumpscare");

      aud.addEventListener("ended", () => {
        try {
          img.outerHTML = "";
        } catch {}
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

  // Change all links to open in new tabs unless specified otherwise
  let links = document.getElementsByTagName("a");
  for (let i = 0; i < links.length; i++) {
    const e = links[i];
    if (!e.target) e.target = "_blank";
  }

  let videos = document.getElementById("videos") as HTMLDivElement;
  if (!MOBILE && videos.children.length % 2 != 0) videos.classList.add("odd");

  let _v = videos.children;
  for (let i = 0; i < _v.length; i++) {
    const video = _v[i];
    let _i = video.getElementsByTagName("img");
    let thumbnail = _i[0] as HTMLImageElement,
      channel_image = _i[1] as HTMLImageElement;
    thumbnail.alt = "< Video Thumbnail >";
    channel_image.alt = "< Channel icon >";
  }

  let emoji = document.getElementById("emoji") as HTMLImageElement;
  let emoji_history = document.getElementById(
    "emoji-history"
  ) as HTMLDivElement;

  let _override: { src: string; alt: string } | null = null;
  emoji_history.addEventListener("click", (e: MouseEvent) => {
    if (!e.target || (e.target as HTMLElement).tagName.toLowerCase() != "img")
      return console.log("Invalid element clicked", e.target);
    let t: HTMLImageElement = e.target as HTMLImageElement;
    _override = { src: t.src, alt: t.alt };
    emoji.dispatchEvent(new MouseEvent("click", {}));
  });
  emoji.addEventListener("click", (e: MouseEvent) => {
    if (emoji.classList.contains("lock")) return;

    if (e.isTrusted) {
      let h = document.createElement("img");
      h.src = emoji.src;
      h.alt = emoji.alt;
      for (let i = 0; i < emoji_history.children.length; i++) {
        try {
          const e = emoji_history.children[i] as HTMLImageElement;
          if (e.src == h.src) e.remove();
        } catch {}
      }
      emoji_history.appendChild(h);
    }

    let col: string = rand_choice(EMOJI_COLORS),
      n: string = rand_choice(EMOJI_NAMES);
    if (!_override) {
      emoji.src = `bluemoji/${col}/${n}.png`;
      emoji.alt = `< [${col.toUpperCase()} - ${
        n.charAt(0).toUpperCase() + n.replace(/-/g, " ").substring(1)
      }] Emoji Shuffler >`;
    } else {
      emoji.src = _override.src;
      emoji.alt = _override.alt;
      _override = null;
      return;
    }
    emoji.classList.add("lock");
  });
  emoji.addEventListener("load", () => {
    setTimeout(() => {
      emoji.classList.remove("lock");
    }, 20);
  });
  emoji.dispatchEvent(new MouseEvent("click", {}));
});

function is_april_fools(): boolean {
  let d = new Date();
  return (
    (d.getDate() == 1 && d.getMonth() == 4) ||
    new URLSearchParams(location.search).has("april_fools")
  );
}

function rand_choice(list: any[]): any {
  return list[Math.floor(Math.random() * list.length)];
}

const EMOJI_NAMES: string[] = [
    "angry-teeth-emoticon",
    "annoyed",
    "appalled",
    "blank-smile",
    "can't-look-and-too-scared",
    "can't-unsee-this",
    "checking-out",
    "contented-grin",
    "cookie-muncher",
    "crazy-in-love-with-tongue-out",
    "crazy-wide-eyed-smile",
    "cringed",
    "desperate",
    "devious",
    "displeased",
    "double-thumbs-up",
    "drool",
    "dumbfound",
    "eye-brow-lift-smile",
    "face-palm",
    "face-with-open-mouth",
    "fist-shaking-old-man",
    "fountains-of-tears",
    "freaked-out",
    "frowny-face-emoticon",
    "frustrated",
    "give-me-a-hug",
    "goofy",
    "got-someting-in-mind",
    "grinning-face-with-sweat",
    "growling-mad-smiley",
    "happy-and-cheering",
    "happy-big-grin",
    "holding-it-in",
    "holding-its-breath-clearly-innocent",
    "hot-face",
    "huge-grin",
    "impressed-with-stars-in-eyes",
    "in-love",
    "in-shock",
    "innocent-and-pretty",
    "instant-regret-with-hands-on-head",
    "kiss",
    "laughing-squinting-face",
    "love-from-the-heart",
    "making-an-argument",
    "missing-teeth-silly",
    "mouth-open-in-rage",
    "nerd-glasses",
    "nothing-seems-right",
    "offering-a-rose",
    "ok-sign",
    "ooh-face",
    "oops-i-did-it-again",
    "party",
    "pearly-whites-smiley",
    "pleading-face",
    "pointing-and-laughing-in-tears",
    "praying-please",
    "punched-in-face-black-eye-smiley",
    "putting-tongue-out",
    "quivering-lip",
    "raised-eyebrow",
    "red-lips-smack-kiss",
    "roaring-angry-beast",
    "sad-and-silently-crying",
    "sad",
    "salute",
    "scared-and-defending",
    "seasick-smiley",
    "secret-keep-quiet-hush-mewing",
    "sexy-biting-lip",
    "shock",
    "shy",
    "sleepy-and-yawning",
    "smiling-face-with-sunglasses",
    "suspicious-big-eye",
    "suspicious-heavy-lidded",
    "tearing-up",
    "thinking-face",
    "thumbs-up",
    "tongue-out",
    "troll-face",
    "unamused-face",
    "uncertain-_-shrug",
    "unimpressed",
    "very-touched",
    "wacky-face",
    "waving-hello",
    "wearing-shades",
    "weary-face",
    "wink",
    "woozy-face",
    "zany",
  ],
  EMOJI_COLORS: string[] = [
    "black",
    "blue",
    "green",
    "pink",
    "red",
    "teal",
    "violet",
    "white",
    "yellow",
  ];
