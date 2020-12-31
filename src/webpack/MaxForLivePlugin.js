const { ConcatSource } = require("webpack-sources");
const { Compilation } = require("webpack");

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

function bang() {
    if (typeof ${chunk.name}.bang !== 'function') {
        return;
    }
    return ${chunk.name}.bang.apply(null, arguments);
}

function anything() {
    if (typeof ${chunk.name}.anything !== 'function') {
        return;
    }
    return ${chunk.name}.anything.apply(null, arguments);
}

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
