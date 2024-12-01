import "../../polyfills/fill";
import type { Id } from "../../types";
import { log, ApiManager } from "../../util";
import { launchpadColourIndices } from "../../config";

autowatch = 1;
outlets = 3;

enum LightType {
  on,
  blink,
  pulse,
  off,
}

export function observe_clip_slot_content() {}

const apiMan = new ApiManager();

export function make_managed_api() {
  apiMan.make(
    "live_set tracks 0 clip_slots 0 clip color_index",
    (message: string[]) => log(`Managed observation: ${message.join(" ")}`),
  );
}

export function kill_managed_api() {
  apiMan.kill("live_set tracks 0 clip_slots 0 clip color_index");
}

export function observe_selected_track() {
  observeSelectedTrack(
    (prevTrackIndex: number | null, trackIndex: number | null) => {
      log(`Track index changed from ${prevTrackIndex} to ${trackIndex}`);
      if (prevTrackIndex !== null) {
        // actually, we don't have to bother with turning pad lights off,
        // the control surface already does that
        //sendPadLightMidiMessage(LightType.off, 11 + prevTrackIndex);
      }
      if (trackIndex !== null) {
        sendPadLightMidiMessage(LightType.on, 11 + trackIndex, 80);
      }
    },
  );
}

export function print_track_colour(trackIndex: number) {
  // everything is zero based, tracks 0 gets us track 1
  const track = new LiveAPI(`live_set tracks ${trackIndex}`);
  // colour indices:
  // 0: salmon (upper-left of the palette)
  // 14: fire hydrant red (row 2, col 1)
  // 28: terracotta (row 3, col 1)
  // 69: eclipse (lower-right of the palette)
  log(`Track #${trackIndex + 1} colour index:`, track.get("color_index"));
}

export function observe_clips() {
  function createObserver(padIndex: number) {
    return (message: [string, number]) => {
      const [propName, value] = message;
      if (propName !== "color_index") {
        return;
      }
      log(`Got colour index ${value} from a clip to set on pad ${padIndex}`);
      sendPadLightMidiMessage(
        LightType.on,
        padIndex,
        launchpadColourIndices[value],
      );
    };
  }

  const api = new LiveAPI("live_set");
  const trackCount = api.getcount("tracks");
  for (let trackIndex = 0; trackIndex < Math.min(8, trackCount); trackIndex++) {
    api.goto(`live_set tracks ${trackIndex}`);
    const clipSlotCount = api.getcount("clip_slots");
    for (
      let clipSlotIndex = 0;
      clipSlotIndex < Math.min(8, clipSlotCount);
      clipSlotIndex++
    ) {
      api.goto(`live_set tracks ${trackIndex} clip_slots ${clipSlotIndex}`);
      const [hasClip] = api.get("has_clip");
      if (hasClip === 0) {
        continue;
      }
      const clip = new LiveAPI(
        createObserver(80 - clipSlotIndex * 10 + trackIndex + 1),
        `live_set tracks ${trackIndex} clip_slots ${clipSlotIndex} clip`,
      );
      clip.property = "color_index";
    }
  }
}

export function observe_clips_and_print_colour_index() {
  function onClipChangePrintColourIndex(message: any[]) {
    const [propName, value] = message;
    if (propName !== "color_index") {
      return;
    }
    log(`Got ${propName} from a clip: ${value}`);
  }

  const api = new LiveAPI("live_set");
  const trackCount = api.getcount("tracks");
  for (let trackIndex = 0; trackIndex < Math.min(8, trackCount); trackIndex++) {
    api.goto(`live_set tracks ${trackIndex}`);
    const clipSlotCount = api.getcount("clip_slots");
    for (
      let clipSlotIndex = 0;
      clipSlotIndex < Math.min(8, clipSlotCount);
      clipSlotIndex++
    ) {
      api.goto(`live_set tracks ${trackIndex} clip_slots ${clipSlotIndex}`);
      const [hasClip] = api.get("has_clip");
      if (hasClip === 0) {
        continue;
      }
      const clip = new LiveAPI(
        onClipChangePrintColourIndex,
        `live_set tracks ${trackIndex} clip_slots ${clipSlotIndex} clip`,
      );
      clip.property = "color_index";
    }
  }
}

export function print_clip_colours() {
  const api = new LiveAPI("live_set");
  const trackCount = api.getcount("tracks");
  log(`This live set has ${trackCount} tracks`);

  for (let trackIndex = 0; trackIndex < Math.min(8, trackCount); trackIndex++) {
    api.goto(`live_set tracks ${trackIndex}`);
    const clipSlotCount = api.getcount("clip_slots");
    log(`Track ${trackIndex + 1} has ${clipSlotCount} clip slots`);

    for (
      let clipSlotIndex = 0;
      clipSlotIndex < Math.min(8, clipSlotCount);
      clipSlotIndex++
    ) {
      api.goto(`live_set tracks ${trackIndex} clip_slots ${clipSlotIndex}`);

      // returns a number array for some reason
      const [hasClip] = api.get("has_clip");
      if (hasClip === 0) {
        log(
          `Clip slot ${clipSlotIndex + 1} in track ${trackIndex + 1} is empty`,
        );
        continue;
      }
      api.goto(
        `live_set tracks ${trackIndex} clip_slots ${clipSlotIndex} clip`,
      );
      const colourIndex = api.get("color_index");
      log(
        `Clip slot ${clipSlotIndex + 1} in track ${trackIndex + 1} has a clip with colour index ${colourIndex}`,
      );
    }
  }
}

// function for testing colours on the launchpad
export function light_em_up(palette: number) {
  let colourIndices = new Array(64).fill(0);
  switch (palette) {
    // palette 1 shows the launchpad colours in the order of their indices (1/2)
    case 1:
      colourIndices = colourIndices.map((_, index) => index);
      break;

    // palette 2 shows the launchpad colours in the order of their indices (2/2)
    case 2:
      colourIndices = colourIndices.map((_, index) => index + 64);
      break;

    // palette 3: custom assigment Live colours -> Launchpad colours (left side)
    case 3:
      colourIndices[0] = 56; // salmon
      colourIndices[1] = 61; // frank orange
      colourIndices[2] = 100; // dirty gold
      colourIndices[3] = 73; // lemonade
      colourIndices[4] = 85; // lime
      colourIndices[5] = 87; // highlighter green
      colourIndices[6] = 88; // bianchi
      colourIndices[7] = 28; // turquoise

      colourIndices[8] = 106; // fire hydrant red
      colourIndices[9] = 127; // tangerine
      colourIndices[10] = 117; // sand
      colourIndices[11] = 14; // sunshine yellow
      colourIndices[12] = 86; // terminal green
      colourIndices[13] = 19; // forest
      colourIndices[14] = 65; // tiffany blue
      colourIndices[15] = 68; // cyan

      colourIndices[16] = 105; // terracotta
      colourIndices[17] = 107; // light salmon
      colourIndices[18] = 8; // whiskey
      colourIndices[19] = 73; // canary
      colourIndices[20] = 113; // primrose
      colourIndices[21] = 16; // wild willow
      colourIndices[22] = 24; // dark sea green
      colourIndices[23] = 114; // honeydew

      colourIndices[24] = 2; // dusty pink
      colourIndices[25] = 105; // barley corn
      colourIndices[26] = 118; // pale oyster; difficult
      colourIndices[27] = 110; // dark khaki
      colourIndices[28] = 18; // pistachio
      colourIndices[29] = 102; // dollar bill
      colourIndices[30] = 89; // neptune
      colourIndices[31] = 89; // nepal

      colourIndices[32] = 121; // medium carmine
      colourIndices[33] = 83; // red ochre
      colourIndices[34] = 71; // coffee
      colourIndices[35] = 15; // durian yellow
      colourIndices[36] = 19; // pomelo green
      colourIndices[37] = 27; // apple
      colourIndices[38] = 65; // aquamarine
      colourIndices[39] = 68; // sea blue
      break;

    // palette 4: custom assigment Live colours -> Launchpad colours (right side)
    case 4:
      colourIndices[0] = 91; // sky blue
      colourIndices[1] = 92; // sapphire
      colourIndices[2] = 40; // periwinkle
      colourIndices[3] = 82; // orchid
      colourIndices[4] = 58; // magenta
      colourIndices[5] = 3; // white

      colourIndices[8] = 39; // cerulean
      colourIndices[9] = 43; // united nations blue
      colourIndices[10] = 93; // amtethyst
      colourIndices[11] = 70; // iris
      colourIndices[12] = 53; // flamingo
      colourIndices[13] = 2; // aluminum

      colourIndices[16] = 114; // pale turquoise
      colourIndices[17] = 118; // periwinkle
      colourIndices[18] = 2; // fog
      colourIndices[19] = 39; // dull lavender
      colourIndices[20] = 119; // whisper
      colourIndices[21] = 118; // silver chalice

      colourIndices[24] = 36; // polo blue
      colourIndices[25] = 40; // vista blue
      colourIndices[26] = 2; // amethyst smoke
      colourIndices[27] = 118; // lilac
      colourIndices[28] = 70; // turkish rose
      colourIndices[29] = 117; // steel

      colourIndices[32] = 104; // cosmic cobalt
      colourIndices[33] = 112; // sapphire
      colourIndices[34] = 71; // plump purple
      colourIndices[35] = 70; // purpureus
      colourIndices[36] = 55; // fuchsia rose
      colourIndices[37] = 103; // eclipse
      break;
  }
  let padIndex = 0;
  for (let row = 80; row >= 10; row -= 10) {
    for (let col = 1; col <= 8; col++) {
      log(row, col, padIndex, colourIndices[padIndex]);
      sendPadLightMidiMessage(
        LightType.on,
        row + col,
        colourIndices[padIndex++],
      );
    }
  }
}

function getTrackIndex(trackToFind: any) {
  const liveSet = new LiveAPI("live_set");
  const trackCount = liveSet.getcount("tracks");

  for (let i = 0; i < trackCount; i++) {
    const track = new LiveAPI(`live_set tracks ${i}`);
    if (track.id === trackToFind.id) {
      return i;
    }
  }
  return null;
}

function getSelectedTrackIndex() {
  const selectedTrack = new LiveAPI("live_set view selected_track");
  return getTrackIndex(selectedTrack);
}

function observeSelectedTrack(
  callback: (prevTrackIndex: number | null, trackIndex: number | null) => void,
) {
  let prevTrackIndex: number | null = null;
  const songView = new LiveAPI((value: any) => {
    if (value.length !== 3 || value[0] !== "selected_track") {
      return;
    }
    const id: Id = value.slice(1);
    const track = new LiveAPI(id);
    const [trackName] = track.get("name");
    const trackIndex = getTrackIndex(track);
    log("selected track:", trackName, trackIndex);
    callback(prevTrackIndex, trackIndex);
    prevTrackIndex = trackIndex;
  }, "live_set view");
  songView.property = "selected_track";
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
