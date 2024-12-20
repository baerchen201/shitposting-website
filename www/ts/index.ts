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
        `Empty attribute data-id for youtube-video object ${this}`,
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
        `Empty attribute data-id for youtube-track object ${this}`,
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

// TODO: Add *proper* mobile detection
const MOBILE: boolean = new URLSearchParams(location.search).has("mobile");
if (MOBILE) document.children[0].classList.add("mobile");

window.addEventListener("load", () => {
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

  let video_list = document.getElementById("videos") as HTMLDivElement;
  if (!MOBILE && video_list.children.length % 2 != 0)
    video_list.classList.add("odd");

  let _v = video_list.children;
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
    "emoji-history",
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

  let videos = document.getElementsByTagName("video");
  Array.from(videos).forEach((e: HTMLVideoElement) => {
    if (e.hasAttribute("tryautoplay"))
      e.play().catch(() => {
        console.warn("Failed to start playing video", e);
      });
  });
});

window.addEventListener("pageshow", () => {
  if (location.hash) {
    let heads: HTMLHeadingElement[] = Array.from(document.body.children).filter(
      (e: Element) => {
        return e.tagName.match(/h[1-6]/i);
      },
    ) as HTMLHeadingElement[];
    const _CHARS = Array.from("abcdefghijklmnopqrstuvwxyz-_1234567890 ");

    let scroll_queue: number[][] = [];
    heads.forEach((head: HTMLHeadingElement) => {
      if (
        location.hash ==
        "#" +
          ((i: string) => {
            let out: string[] = Array.from(i.trim().toLowerCase());
            out.forEach((e: string, i: number) => {
              if (!_CHARS.includes(e)) out[i] = "";
            });
            let _ = out.join("").trim().replace(/ /g, "+");
            console.info(i.trim() + ":", _);
            return _;
          })(head.innerHTML)
      ) {
        let _: boolean = false,
          elements: HTMLElement[] = [];
        Array.from(document.body.children).forEach((e: Element, i: number) => {
          if (e == head) {
            _ = true;
          } else if (e.tagName.toUpperCase() == "HR") {
            _ = false;
          }
          if (_) elements.push(e as HTMLElement);
        });
        let highlight = document.createElement("div");
        highlight.classList.add("highlight");
        let dim: number[] = [
          Number.MAX_VALUE,
          Number.MAX_VALUE,
          Number.MIN_VALUE,
          Number.MIN_VALUE,
        ];
        elements.forEach((e: HTMLElement) => {
          let _dim = [
            e.offsetTop,
            e.offsetLeft,
            e.offsetTop + e.offsetHeight,
            e.offsetLeft + e.offsetWidth,
          ];
          if (
            _dim.every((e: number, i: number) => {
              return e == 0;
            })
          )
            return console.log(false);
          _dim.forEach((e: number, i: number) => {
            if (i < 2) {
              if (e < dim[i]) dim[i] = e;
            } else if (e > dim[i]) dim[i] = e;
          });
        });
        highlight.style.top = `${dim[0] + document.body.offsetTop}px`;
        highlight.style.left = `${dim[1] + document.body.offsetLeft}px`;
        highlight.style.height = `${dim[2] - dim[0]}px`;
        highlight.style.width = `${dim[3] - dim[1]}px`;
        document.body.insertBefore(highlight, elements[0]);
        scroll_queue.push(dim);
      }
    });
    let _ = (i: number, j: boolean = false) => {
        return j ? i * 500 + 600 : i * 500;
      },
      _scroll = (e: number[]) => {
        scrollTo({ top: e[0], behavior: "smooth" });
      };
    scroll_queue.forEach((e: number[], i: number) => {
      if (scroll_queue.length == 1) return _scroll(e);

      if (i == 0) {
        setTimeout(
          () => {
            _scroll(e);
          },
          _(scroll_queue.length, true),
        );
        return _scroll(e);
      }

      setTimeout(() => {
        _scroll(e);
      }, _(i));
    });
  }
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
