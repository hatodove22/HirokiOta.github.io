# UMotion — Robust full‑body motion from wearables only

## Background
We aim to reconstruct human motion accurately even when cameras are hard to use. Our goal is stable pose estimation over long periods using only small, body‑mounted sensors.

## Approach
We simultaneously acquire orientation/acceleration and inter‑sensor distance from sensors attached to the limbs and waist. By fusing these with uncertainty and continuously correcting drift, we recover stable pose and position over time. Estimating each user’s body parameters at initialization yields more natural motion.

## Benefits
Both angular errors and positional drift are reduced. In particular, using distance resolves poses that are hard to distinguish with orientation and acceleration alone, and sensor data becomes more stable. In experiments, mean distance error dropped from about 9 cm to about 2.4 cm, and acceleration jitter settled quickly—overall moving toward “less shaky and less mistaken.” With a self‑built prototype from off‑the‑shelf parts, we confirmed effectiveness on real motions, indicating near real‑time, smooth motion reconstruction even where cameras are impractical.

## Contribution
We mainly developed the wearable sensor device. A newly designed, lightweight module weighs about 30 g.
