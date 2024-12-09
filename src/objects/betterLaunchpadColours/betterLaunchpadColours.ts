import "core-js";
import type { Id } from "../../types";
import { log, ApiManager, getCount } from "../../util";
import { launchpadColourIndices } from "../../config";

autowatch = 1;
outlets = 3;

enum LightType {
  on,
  blink,
  pulse,
  off,
}

const apiMan = new ApiManager();

export function bang() {
  const numberOfTracks = getCount("live_set tracks");
  for (
    let trackIndex = 0;
    trackIndex < Math.min(8, numberOfTracks);
    trackIndex++
  ) {
    const numberOfClipSlots = getCount(
      `live_set tracks ${trackIndex} clip_slots`,
    );
    for (
      let clipSlotIndex = 0;
      clipSlotIndex < Math.min(8, numberOfClipSlots);
      clipSlotIndex++
    ) {
      const clipSlotId = `live_set tracks ${trackIndex} clip_slots ${clipSlotIndex} has_clip`;
      const clipId = `live_set tracks ${trackIndex} clip_slots ${clipSlotIndex} clip color_index`;
      const padIndex = getPadIndex(trackIndex, clipSlotIndex);
      const clipSlot = apiMan.make(clipSlotId, (hasClip) => {
        log(
          `Track ${trackIndex + 1} clip slot ${clipSlotIndex + 1} ${hasClip === 0 ? "is empty" : "has a clip"}`,
        );
        if (hasClip === 0) {
          clipSlot.killChildren();
          return;
        }
        const clip = clipSlot.add(clipId, (colourIndex) => {
          log(
            `Track ${trackIndex + 1} clip in slot ${clipSlotIndex + 1} has color index ${colourIndex} (pad index ${padIndex})`,
          );
          sendPadLightMidiMessage(
            LightType.on,
            padIndex,
            launchpadColourIndices[colourIndex],
          );
        });
        if (clip) {
          clip.start();
        }
      });
      log("starting to observe slots and clips");
      clipSlot.start();
    }
  }
}

function getPadIndex(trackIndex: number, clipSlotIndex: number) {
  return 80 - clipSlotIndex * 10 + trackIndex + 1;
}

function sendPadLightMidiMessage(
  lightType: LightType,
  position: number,
  colourIndex?: number,
) {
  switch (lightType) {
    case LightType.on:
      outlet(0, [144, position, colourIndex]);
      break;
    case LightType.blink:
      outlet(0, [144, position, 0]);
      outlet(1, [145, position, colourIndex]);
      break;
    case LightType.pulse:
      outlet(2, [146, position, colourIndex]);
      break;
    case LightType.off:
      outlet(0, [144, position, 0]);
      break;
  }
}
