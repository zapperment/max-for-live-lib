import AutoFallbackManager from "./AutoFallbackManager";

autowatch = 1;
inlets = 1;
outlets = 1;

const autoFallbackMan = new AutoFallbackManager(outlet);

export function bang() {
  autoFallbackMan.start();
}

export function stop() {}
