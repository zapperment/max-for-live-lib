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

export function print_rgb_values() {
  const api = new LiveAPI("live_set");
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    for (let colIndex = 0; colIndex < 14; colIndex++) {
      api.goto(`live_set tracks ${colIndex} clip_slots ${rowIndex} clip`);
      const colourIndex = api.get("color_index");
      const colourRgb = api.get("color");
      const row = rowIndex + 1;
      const col = colIndex + 1;
      log(`${colourIndex},${colourRgb},${row},${col}`);
    }
  }
}

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

    // palette 5: named colours from Novation palette
    case 5:
      colourIndices[0] = 0; // black
      colourIndices[1] = 1; // dark grey / white half
      colourIndices[2] = 2; // grey
      colourIndices[3] = 3; // white

      colourIndices[8] = 8; // off white
      colourIndices[9] = 12; // cream

      colourIndices[11] = 97; // yellow
      colourIndices[12] = 125; // yellow half

      colourIndices[14] = 17; // dark yellow
      colourIndices[15] = 19; // dark yellow half

      colourIndices[16] = 96; // amber
      colourIndices[17] = 14; // amber half

      colourIndices[19] = 9; // orange
      colourIndices[20] = 11; // orange half

      colourIndices[22] = 84; // dark orange

      colourIndices[24] = 5; // red
      colourIndices[25] = 7; // red half

      colourIndices[32] = 53; // purple
      colourIndices[33] = 55; // purple half

      colourIndices[35] = 52; // violet

      colourIndices[40] = 37; // light blue
      colourIndices[41] = 39; // light blue half

      colourIndices[43] = 41; // blue
      colourIndices[44] = 43; // blue half

      colourIndices[46] = 49; // dark blue
      colourIndices[47] = 51; // dark blue half

      colourIndices[48] = 77; // aqua

      colourIndices[51] = 29; // mint
      colourIndices[52] = 31; // mint half

      colourIndices[56] = 87; // pale green
      colourIndices[57] = 89; // pale green half

      colourIndices[59] = 21; // green
      colourIndices[60] = 27; // green half
      break;

    // palette 6: hackable colours
    case 6:
      colourIndices[0] = 74;
      colourIndices[1] = 84;
      colourIndices[2] = 76;
      colourIndices[3] = 69;
      colourIndices[4] = 99;
      colourIndices[5] = 19;
      colourIndices[6] = 5;
      colourIndices[7] = 71;

      colourIndices[8] = 15;
      colourIndices[9] = 18;
      colourIndices[10] = 11;
      colourIndices[11] = 73;
      colourIndices[12] = 58;
      colourIndices[13] = 111;
      colourIndices[14] = 13;
      colourIndices[15] = 4;

      colourIndices[16] = 88;
      colourIndices[17] = 65;
      colourIndices[18] = 110;
      colourIndices[19] = 46;
      colourIndices[20] = 107;
      colourIndices[21] = 102;
      colourIndices[22] = 79;
      colourIndices[23] = 117;

      colourIndices[24] = 119;
      colourIndices[25] = 94;
      colourIndices[26] = 44;
      colourIndices[27] = 100;
      colourIndices[28] = 78;
      colourIndices[29] = 127;
      colourIndices[30] = 96;
      colourIndices[31] = 87;

      colourIndices[32] = 64;
      colourIndices[33] = 90;
      colourIndices[34] = 97;
      colourIndices[35] = 126;
      colourIndices[36] = 80;
      colourIndices[37] = 10;
      colourIndices[38] = 16;
      colourIndices[39] = 105;

      colourIndices[40] = 14;
      colourIndices[41] = 108;
      colourIndices[42] = 70;
      colourIndices[43] = 39;
      colourIndices[44] = 47;
      colourIndices[45] = 59;
      colourIndices[46] = 121;
      colourIndices[47] = 57;

      colourIndices[48] = 25;
      colourIndices[49] = 112;
      colourIndices[50] = 81;
      colourIndices[51] = 8;
      colourIndices[52] = 77;
      colourIndices[53] = 93;
      colourIndices[54] = 48;
      colourIndices[55] = 43;

      colourIndices[56] = 103;
      colourIndices[57] = 104;
      colourIndices[58] = 55;
      colourIndices[59] = 66;
      colourIndices[60] = 95;
      colourIndices[61] = 86;
      colourIndices[62] = 28;
      colourIndices[63] = 115;

    case 7:
      colourIndices[0] = 116;
      colourIndices[1] = 3;
      colourIndices[2] = 33;
      colourIndices[3] = 114;
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
