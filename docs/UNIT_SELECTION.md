# Package selection in the 3D view

Each visible package now owns its raycast target and a visual unit index, including
bottle bodies/caps, jars, tubes and boxes. The old invisible box over an entire lot
has been removed. Cylinders use their actual body/cap meshes, without invisible
unit bounding boxes that would cover a neighboring visible rounded surface.
Decorative footprint planes are not raycast targets. Shelf-frame
hits select the rack rather than selecting a hidden product behind the frame.

Individual mode highlights only the selected package, fades its same-lot neighbors,
and keeps the map's status/geometry container mounted on orbit pointer-down.
Orbit input cancels camera animation without removing the locator banner, so the
canvas does not shift between pointer-down and pointer-up and misalign the ray.
and targets the camera at that package's position. The inspector has a package
selector and Previous/Next controls. Whole-lot mode is an explicit separate action;
size editing and lot placement remain scoped to that mode and existing role checks.
The stock quantity is labeled as total lot stock, not quantity of the selected glyph.

The model still stores inventory by SKU/lot/location. Up to twelve packages are
representative glyphs; their visual indices are not permanent serial numbers or
separate inventory records. Selecting a glyph does not split stock or independently
move one physical unit. Such operations would need unit/container identifiers and
an inventory movement model. The interface explains this distinction.
