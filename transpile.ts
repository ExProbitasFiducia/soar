import { transform } from "../swc/bindings/binding_core_wasm/dist-deno/binding_core_wasm.js";

console.log({ transform });

console.log(
    await transform(
        "console.log(\"HELLO\");",
        {
            jsc: {
                parser: {
                    syntax: "typescript"
                },
                target: "es2022",
                experimental: {
                    plugins: [
                       ["file:///transform-extension", {}]
                    ]
                }
            },
            swcrc: false
        },
        {
            "file:///transform-extension": await Deno.readFile("./transform-extension/transform_extension.wasm")
        }
    )
);
