import { RealTime } from "@webxdc/realtime";
import { Howl } from "howler";

import yoURL from "@sfx/yo.mp3";
import broURL from "@sfx/bro.mp3";

const YO = "Yo!";
const BRO = "Bro!";
type SoundType = typeof YO | typeof BRO;
const sounds = {
  [YO]: new Howl({ src: [yoURL] }),
  [BRO]: new Howl({ src: [broURL] }),
};
const realtime = new RealTime<null, { sound: SoundType }>({
  onPeersChanged: (_peers) => {},
  onPayload: (_peerId, payload) => sounds[payload.sound].play(),
});

function h(
  tag: keyof HTMLElementTagNameMap,
  attributes: Record<string, string> | null,
  ...children: (Node | string)[]
): HTMLElement {
  const element = document.createElement(tag);
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }
  element.append(...children);
  return element;
}

function sendSound(sound: SoundType) {
  realtime.sendPayload({ sound });
  const name = window.webxdc.selfName;
  const prefix = sound == BRO ? `${sound} - ` : "";
  window.webxdc.sendUpdate(
    { payload: null, notify: { "*": `${prefix}From ${name}` } },
    "",
  );
}

function main() {
  realtime.connect();
  const root = document.getElementById("app")!;
  const btnStyle = "background-color: ";
  const broBtn = h("button", { class: "btn", style: btnStyle + "orange" }, BRO);
  const yoBtn = h("button", { class: "btn", style: btnStyle + "purple" }, YO);
  broBtn.addEventListener("click", () => sendSound(BRO));
  yoBtn.addEventListener("click", () => sendSound(YO));
  root.append(
    h(
      "div",
      { style: "display: flex;flex-direction: column; height: 100vh" },
      broBtn,
      yoBtn,
    ),
  );
}

main();
