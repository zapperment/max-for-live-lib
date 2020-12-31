const { ConcatSource } = require("webpack-sources");
const { Compilation } = require("webpack");

// https://docs.cycling74.com/max8/vignettes/jsbasic#Special_Function_Names
const specialFuncs = [
  "bang",
  "loadbang",
  "getvalueof",
  "setvalueof",
  "save",
  "notifydeleted",
];
const specialFuncsDefToAny = ["msg_int", "msg_float", "list"];

function specialFunction(chunkName, funcName, defaultToAnything = false) {
  const str = defaultToAnything
    ? `
  
function ${funcName}() {
  if (typeof ${chunkName}.${funcName} !== 'function') {
    if (typeof ${chunkName}.anything === 'function') {
      return ${chunkName}.anything.apply(null, arguments);
    }
    return;
  }
  return ${chunkName}.${funcName}.apply(null, arguments);
}

  `
    : `
  
function ${funcName}() {
  if (typeof ${chunkName}.${funcName} !== 'function') {
    return;
  }
  return ${chunkName}.${funcName}.apply(null, arguments);
}
  
  `;
  return str.trim();
}

function specialFunctions(chunkName) {
  return [
    specialFuncs
      .map((funcName) => specialFunction(chunkName, funcName))
      .join("\n\n"),
    specialFuncsDefToAny
      .map((funcName) => specialFunction(chunkName, funcName, true))
      .join("\n\n"),
  ].join("\n\n");
}

class MaxForLivePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("BannerPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "MaxForLivePlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          for (const chunk of compilation.chunks) {
            // only add to initial chunk
            if (!chunk.canBeInitial()) {
              continue;
            }
            for (const file of chunk.files) {
              compilation.updateAsset(
                file,
                (old) =>
                  new ConcatSource(
                    old,
                    "\n" +
                      `

autowatch = ${chunk.name}.autowatch || 0;
inlets = ${chunk.name}.inlets || 1;
outlets = ${chunk.name}.outlets || 1;

${specialFunctions(chunk.name)}

                                `.trim()
                  )
              );
            }
          }
        }
      );
    });
  }
}

module.exports = MaxForLivePlugin;
