class ChristmasBg extends HTMLElement {
  constructor() {
    super();
    this.wind = Math.random() * 200 + 100;
    if (Math.random() < 0.5) this.wind = -this.wind;
  }

  wind: number;

  connectedCallback() {
    for (
      let i = 0;
      i < 100; //* Number of snowflakes here
      i++
    )
      setTimeout(
        () => {
          this.createSnowflake();
        },
        Math.floor(Math.random() * 200 + 300) * i,
      );
  }

  createSnowflake() {
    let snowflake: ChristmasSnowflake = document.createElement(
      "christmas-snowflake",
    ) as ChristmasSnowflake;
    snowflake
      ._bg(Math.random() * 2 + 0.75, Math.random() * 10 + 2, this.wind)
      .then(() => {
        setTimeout(
          () => {
            this.createSnowflake();
          },
          Math.floor(Math.random() * 3000 + 500),
        );
        snowflake.remove();
      });
    this.appendChild(snowflake);
  }
}

class ChristmasSnowflake extends HTMLElement {
  constructor() {
    super();
  }

  _bg(speed: number = 1, scale: number = 100, wind: number = 0): Promise<void> {
    this.classList.add(`variant${Math.floor(Math.random() * 10)}`);
    this.style.left = `calc(${Math.random() * 100}% - ${scale / 2}px)`;

    return new Promise((resolve, reject) => {
      this.style.height = this.style.width = `${scale}px`;
      let _keyframes: Keyframe[] = [
        { top: `${-scale}px`, transform: "none" },
        {
          top: "100%",
          transform: `rotate(${Math.random() * 3}turn)`,
        },
      ];
      if (wind != 0) {
        _keyframes[0]["transform"] = `translateX(${wind / 2}px)`;
        _keyframes[1]["transform"] =
          `translateX(${-wind / 2}px) ${_keyframes[1]["transform"]}`;
      }

      this.animate(_keyframes, {
        duration: Math.floor((Math.random() * 50000 + 30000) / speed),
        fill: "forwards",
      }).addEventListener("finish", () => {
        resolve();
      });
    });
  }
}

window.customElements.define("christmas-bg", ChristmasBg);
window.customElements.define("christmas-snowflake", ChristmasSnowflake);
