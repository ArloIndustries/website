# 3D models

## node.stl (not committed yet)

Drop the real sensor-node model here as **`node.stl`**.

The hero animation (`components/defense-grid.tsx`) fetches `/models/node.stl`
on load:

- If the file exists, every sensor node in the scene renders the STL
  (auto-centered, rotated Z-up → Y-up, and scaled to ~1.7 scene units).
- If it does not exist, a procedural placeholder (tripod + hex body + sensor
  head) is rendered instead. No code change is needed when you add the file.

Binary and ASCII STL both work. Keep it reasonably light (< ~5 MB) since it
ships to every visitor; decimate the mesh if the source file is heavy.
