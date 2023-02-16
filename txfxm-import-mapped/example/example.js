const { transform } = require("@swc/core");

(async () => {
    console.log(
        await transform(
            {
                jsc: {
                    parser: {
                        syntax: "typescript"
                    },
                    target: "es2022",
                    experimental: {
                        plugins: [
                            [
                                //require.resolve("../../transform-extension/transform_extension.wasm"),
                                require.resolve("../txfxm_import_mapped.wasm"),
                                {
                                }
                            ]
                        ]
                    }
                },
                swcrc: false
            }
        )
    );
})();
