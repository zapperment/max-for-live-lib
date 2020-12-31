const { ConcatSource } = require("webpack-sources");
const { Compilation } = require("webpack");

const reservedProps = ["autowatch", "inlets", "outlets"];

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
              compilation.updateAsset(file, (old) => {
                // PH 2020-12-31:
                // This is admittedly brittle: We need to figure out the
                // properties of the exported library object. To do this,
                // we go through the chunk's source code line by line and
                // parse the first line that defines exports. If subsequent
                // versions of webpack produce different boilerplate code,
                // this may break. I couldn't find a more robust way to
                // do this.
                const additionalCodeChunks = old
                  .source()
                  .split(/\r?\n/)
                  .filter((line) => line.match(/^exports\..+ = void 0;$/))[0]
                  .match(/exports.[_a-z0-9]+/gi)
                  .map((m) => m.replace(/^exports\.([_a-z0-9]+)$/i, "$1"))
                  .map((exp) =>
                    reservedProps.includes(exp)
                      ? `${exp} = ${chunk.name}.${exp};`
                      : `function ${exp}() {
  return ${chunk.name}.${exp}.apply(null, arguments);
}`
                  );
                return new ConcatSource(
                  old,
                  `\n${additionalCodeChunks.join("\n\n")}`
                );
              });
            }
          }
        }
      );
    });
  }
}

module.exports = MaxForLivePlugin;
