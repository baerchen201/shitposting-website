class AmongUsBg extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    for (
      let i = 0;
      i < 50; //* Number of stars here
      i++
    )
      setTimeout(() => {
        this.createStar();
      }, Math.floor(Math.random() * 50 + 25) * i);

    for (
      let i = 0;
      i < 7; //* Limit of amogi here
      i++
    )
      setTimeout(() => {
        this.createAmogus();
      }, Math.floor(Math.random() * 10000 + 5000) * i);
  }

  createStar() {
    let star: AmongUsStar = document.createElement(
      "amongus-star"
    ) as AmongUsStar;
    star
      ._bg(
        Math.floor(Math.random() * 2250 + 3000),
        Math.floor(Math.random() * 1500 + 500),
        Math.floor(Math.random() * 2250 + 3000)
      )
      .then(() => {
        setTimeout(() => {
          this.createStar();
        }, Math.floor(Math.random() * 200 + 50));
        star.remove();
      });
    this.appendChild(star);
  }

  createAmogus() {
    let amogus: AmongUsAmogus = document.createElement(
      "amongus-amogus"
    ) as AmongUsAmogus;
    amogus
      ._bg(
        1.5,
        Math.random() * 100 + 50,
        "x-",
        (Math.random() * 0.75 + 0.2) * (Math.random() < 0.4 ? -1 : 1)
      )
      .then(() => {
        setTimeout(() => {
          this.createAmogus();
        }, Math.floor(Math.random() * 3000 + 500));
        amogus.remove();
      });
    this.appendChild(amogus);
  }
}

class AmongUsStar extends HTMLElement {
  constructor() {
    super();
  }

  _bg(fadein: number, duration: number, fadeout: number): Promise<void> {
    this.style.top = `${Math.random() * 100}%`;
    this.style.left = `${Math.random() * 100}%`;

    return this.blink(fadein, duration, fadeout);
  }

  blink(fadein: number, duration: number, fadeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.animate([{ opacity: "0" }, { opacity: "1" }], {
        easing: "ease-out",
        duration: fadein,
        fill: "forwards",
      }).addEventListener("finish", () => {
        setTimeout(() => {
          this.animate([{ opacity: "1" }, { opacity: "0" }], {
            easing: "ease-out",
            duration: fadeout,
            fill: "forwards",
          }).addEventListener("finish", () => {
            resolve();
          });
        }, duration);
      });
    });
  }
}

class AmongUsAmogus extends HTMLElement {
  constructor() {
    super();
  }

  _bg(
    speed: number = 1,
    scale: number = 100,
    direction: "x+" | "x-" | "y+" | "y-" = "x+",
    rspeed: number = 1
  ): Promise<void> {
    this.style.top =
      direction.charAt(0) == "x"
        ? `calc(${Math.random() * 100}% - ${scale / 2}px)`
        : "";
    this.style.left =
      direction.charAt(0) == "y"
        ? `calc(${Math.random() * 100}% - ${scale / 2}px)`
        : "";

    return this.anim(speed, scale, direction, rspeed);
  }

  anim(
    speed: number = 1,
    scale: number = 100,
    direction: "x+" | "x-" | "y+" | "y-" = "x+",
    rspeed: number = 1
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.style.height = this.style.width = `${scale}px`;
      this.animate(
        [
          {
            transform: "rotate(0)",
          },
          {
            transform: "rotate(360deg)",
          },
        ],
        {
          duration: Math.floor(
            Math.abs((Math.random() * 1250 + 1250) / rspeed)
          ),
          iterations: Infinity,
          direction: rspeed > 0 ? "normal" : "reverse",
        }
      );
      let _b = `${-scale}px`;
      let _anim: Keyframe[];
      switch (direction) {
        case "x+":
          _anim = [{ left: _b }, { left: "100%" }];
          break;
        case "x-":
          _anim = [{ left: "100%" }, { left: _b }];
          break;
        case "y+":
          _anim = [{ top: _b }, { top: "100%" }];
          break;
        case "y-":
          _anim = [{ top: "100%" }, { top: _b }];
          break;

        default:
          _anim = [];
          break;
      }

      this.animate(_anim, {
        duration: Math.floor((Math.random() * 50000 + 30000) / speed),
        fill: "forwards",
      }).addEventListener("finish", () => {
        resolve();
      });
    });
  }
}

window.customElements.define("amongus-bg", AmongUsBg);
window.customElements.define("amongus-star", AmongUsStar);
window.customElements.define("amongus-amogus", AmongUsAmogus);
