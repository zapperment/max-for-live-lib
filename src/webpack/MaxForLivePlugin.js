const { ConcatSource } = require("webpack-sources");
const { Compilation } = require("webpack");

class MaxForLivePlugin {
    constructor({ objectName }) {
        this.objectName = objectName;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap("BannerPlugin", compilation => {
			compilation.hooks.processAssets.tap({
                name: "MaxForLivePlugin",
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
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
                            old => new ConcatSource(old, "\n" + `

autowatch = ${this.objectName}.autowatch || 0;
inlets = ${this.objectName}.inlets || 1;
outlets = ${this.objectName}.outlets || 1;

function bang() {
    if (typeof ${this.objectName}.bang !== 'function') {
        return;
    }
    return ${this.objectName}.bang.apply(null, arguments);
}

function anything() {
    if (typeof ${this.objectName}.anything !== 'function') {
        return;
    }
    return ${this.objectName}.anything.apply(null, arguments);
}

                                `.trim())

                        );
                    }
                }
            })
        })
    }
}

module.exports = MaxForLivePlugin;
