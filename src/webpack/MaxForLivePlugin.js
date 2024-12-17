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
                  .map(processLine);
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

function processLine(line) {
  const matcher = /^exports\.([a-z][_a-z0-9]+) = ([_a-z0-9]+);$/i
  const matches = line.match(matcher);
  if (matches === null) {
    return line;
  }
  const [ ,exportName, reference] = matches;
  if (exportName !== reference) {
    return line;
  }
  return line.replace(matcher,"maxJsObject.$1 = $2;")
}

module.exports = MaxForLivePlugin;
