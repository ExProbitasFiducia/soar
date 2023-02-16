use std::collections::HashMap;
use string_cache::Atom;
use swc_core::ecma::{
    ast::{ImportDecl, NamedExport, Program},
    transforms::testing::test,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use serde::Deserialize;


#[derive(Deserialize, Default)]
#[serde(deny_unknown_fields)]
pub struct Import {
    #[serde()]
    pub specifier: String,
    #[serde()]
    pub mapping: String
}

#[derive(Deserialize, Default)]
#[serde(deny_unknown_fields)]
pub struct Scope {
    #[serde()]
    pub scope: String,
    #[serde()]
    pub mappings: Vec<Import>
}

#[derive(Deserialize, Default)]
#[serde(deny_unknown_fields)]
pub struct ImportMap {
    #[serde()]
    imports: Vec<Import>,
    #[serde()]
    scopes: Option<Vec<Scope>>
}

pub struct TransformVisitor {
    pub import_map: ImportMap,
}

impl TransformVisitor {
    fn new(
        import_map: ImportMap
    ) -> Self {
        Self { 
            import_map 
        }
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_import_decl(&mut self, decl: &mut ImportDecl) {
        decl.visit_mut_children_with(self);
        for Import { specifier, mapping } in &self.import_map.imports {
            if decl.src.value.starts_with(specifier) {
                decl.src = Box::new(Atom::from(
                    mapping.to_owned() + &decl.src.value[specifier.len()..]
                ).into());
                break;
            }
        }
    }
    
    fn visit_mut_named_export(&mut self, decl: &mut NamedExport) {
        decl.visit_mut_children_with(self);
        if let Some(src) = &decl.src {
            for Import { specifier, mapping } in &self.import_map.imports {
                if src.value.starts_with(specifier) {
                    decl.src = Some(Box::new(Atom::from(
                        mapping.to_owned() + &src.value[specifier.len()..]
                    ).into()));
                    break;
                }
            }
        }
    }
}

#[derive(Deserialize, Default)]
#[serde(deny_unknown_fields)]
pub struct TransformConfig {
    #[serde()]
    pub import_map: ImportMap
}

#[plugin_transform]
pub fn process_transform(
    program: Program,
    metadata: TransformPluginProgramMetadata
) -> Program {
    //let config: TransformConfig = serde_json::from_str(
    //    &metadata
    //        .get_transform_plugin_config()
    //        .expect("Could not get plogin config for transfor-imports")
    //)
    //    .expect("Failed to parse plugin config");
    program.fold_with(&mut as_folder(TransformVisitor::new(
    //    config.import_map
        ImportMap {
            imports: vec![Import {
                specifier: String::from("r"),
                mapping: String::from("react")
            }],
            scopes: None
        }
    )))
}

// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
test!(
    Default::default(),
    |_| as_folder(TransformVisitor::new()),
    boo,
    // Input codes
    r#"import { foo } from "bar.ts""#,
    // Output codes after transformed with plugin
    r#"import { foo } from "bar.js""#
);

test!(
    Default::default(),
    |_| as_folder(TransformVisitor::new()),
    hiss,
    // Input codes
    r#"export { foo } from "bar.ts""#,
    // Output codes after transformed with plugin
    r#"export { foo } from "bar.js""#
);
