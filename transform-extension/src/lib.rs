use string_cache::Atom;
use swc_core::ecma::{
    ast::{ImportDecl, NamedExport, Program},
    transforms::testing::test,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html

    fn visit_mut_import_decl(&mut self, decl: &mut ImportDecl) {
        decl.visit_mut_children_with(self);
        decl.src = Box::new(
            Atom::from(decl.src.value.replace(".ts", ".js")).into()
        );
    }
    
    fn visit_mut_named_export(&mut self, decl: &mut NamedExport) {
        decl.visit_mut_children_with(self);
        match &decl.src {
            Some(src) => {
                decl.src = Some(Box::new(
                    Atom::from(src.value.replace(".ts", ".js")).into()
                ));
            },
            None => ()
        }
    }

}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually
/// if plugin need to handle low-level ptr directly via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8, ast_ptr_len: i32,
///     unresolved_mark: u32, should_enable_comments_proxy: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */`
///
/// This requires manual handling of serialization / deserialization from ptrs.
/// Refer swc_plugin_macro to see how does it work internally.
#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor))
}

// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    boo,
    // Input codes
    r#"import { foo } from "bar.ts""#,
    // Output codes after transformed with plugin
    r#"import { foo } from "bar.js""#
);

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    hiss,
    // Input codes
    r#"export { foo } from "bar.ts""#,
    // Output codes after transformed with plugin
    r#"export { foo } from "bar.js""#
);
