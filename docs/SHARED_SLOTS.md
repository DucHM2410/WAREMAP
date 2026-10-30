# Shared compartment placement

A location is still branch + rack + level + bin. Each SKU/lot keeps separate
quantity, expiry and label. A single SKU/lot still cannot span multiple locations.

Measured lots now reserve rectangular footprints based on package dimensions,
quantity and allowed layers. A first-fit allocator places automatic regions around
explicit positions. Coordinates are cm from the front-left of the compartment.
Vertical offsets derive from a support lot, never from an arbitrary floating height.
Supports must be box-shaped and both lots must allow stacking. Bounds, footprint
containment, overlaps, dependency cycles and shelf clearance are checked.

Stock roles can use nine position presets, select a support lot, or change their
own lot's layer count. Stacking changes require physical packaging/load approval.
Changing a lower lot cannot leave a dependent upper lot unsupported. Putaway uses
the same layout checks and preserves existing placement when replenishing a lot.

The 3D view shows up to 12 representative storage units per lot, in rows and layers.
It never claims to render every unit. Unmeasured lots retain conservative equal
regions, cannot receive explicit placements, and do not report verified free area.
The overhead compartment diagram has a separate view for each occupied height.
Free base area is an estimate; its shape, access and load still need physical checks.
This is not a general packing optimizer or a structural load certification.

Demo: A3 / level 1 / bin 3 contains four boxes: front-left base, a supported upper
box, a rear box, and a front-right box. Search DEMO-BABY-12 or DEMO-COS-12 and
choose 'Xem toàn ô'. Sample migration v3 appends examples only alongside demo
stock, without moving existing products or sharing an occupied non-demo slot.
'Nhập thêm vào ô' carries the chosen location into QR putaway, without writing stock
until the final confirmation succeeds.
