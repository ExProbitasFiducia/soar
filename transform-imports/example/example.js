const { transform } = require("@swc/core");

(async () => {
    console.log(
        await transform(
            "console.log(\"HELLO\");",
            {
                filename: "./test.js",
                jsc: {
                    parser: {
                        syntax: "typescript"
                    },
                    target: "es2022",
                    experimental: {
                        plugins: [
                            [
                                //require.resolve("../../transform-extension/transform_extension.wasm"),
                                require.resolve("../transform_imports.wasm"),
                                {
                                    import_map: {
                                        imports: [
                                            {
                                                specifier: "r",
                                                mapping: "react"
                                            }
                                        ]
                                    }
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
