/* ============================================================
   3D model library — model registry.

   To add a part:
   1. Export the part as STL (millimeters).
   2. Rename the file: all lowercase, dashes instead of spaces.
      Example: "Main AssemblyV2.stl" -> "main-assembly-v2.stl"
   3. Copy the file into the models/ folder.
   4. Add one entry to the list below.

   Rules:
   - The "file" value must match the real file name EXACTLY,
     including capital letters. GitHub Pages is case-sensitive.
   - No spaces in file names.

   Fields:
   - file:     path to the STL, relative to the site root
   - name:     display name
   - material: short spec line (shown in orange)
   - desc:     one or two sentences about the part

   The first entry in the list loads automatically.
   ============================================================ */

window.MODELS = [
  {
    file: "models/main-assembly-v2.stl",
    name: "UAV Capstone — Main Assembly V2",
    material: "RPI capstone · Siemens NX",
    desc: "Full assembly of the fixed-wing UAV from my RPI capstone (project AO-101): wing, fuselage, and tail group."
  },
  {
    file: "models/stand.stl",
    name: "Stand",
    material: "PLA · 0.20 mm layers",
    desc: "Two-tier stand with corner posts, rails, and flat decks. Modeled at 210 × 180 × 187 mm."
  }
];
