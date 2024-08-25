const { ConcatSource } = require("webpack-sources");
const { Compilation } = require("webpack");

class MaxForLivePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MaxForLivePlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "MaxForLivePlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          for (const chunk of compilation.chunks) {
            // only process initial chunk
            if (!chunk.canBeInitial()) {
              continue;
            }
            for (const file of chunk.files) {
              compilation.updateAsset(file, (old) => {
                const lines = old
                  .source()
                  .split(/\r?\n/)
                  .map((line) =>
                    line.replace(
                      /^exports(\.[a-z][_a-z0-9]+ = [_a-z0-9]+;)$/i,
                      "maxJsObject$1",
                    ),
                  );
                lines.unshift("var maxJsObject = this;");
                return new ConcatSource(lines.join("\n"));
              });
            }
          }
        },
      );
    });
  }
}

module.exports = MaxForLivePlugin;
