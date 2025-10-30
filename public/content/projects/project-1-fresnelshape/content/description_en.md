
https://youtu.be/yP-vO3BtxDc?si=SqRDtAp1biD-Qszg

## Background
We aim to let users naturally feel stiffness, shifting weight, and inertia when grasping objects in VR. Large grounded devices are bulky, and wearables struggle to balance size and output. Our approach changes the tilt of a small fingertip contact plane on the fly to intuitively convey object properties.

## Approach
Inside a small handheld device held between the thumb, index, and middle fingers, three small motors and force sensors rapidly change each fingertip contact plane (fin) within ±45°. By reading grip force and adapting the tilt to hand motion, the system expresses sensations such as stiffness/softness, shifting center of mass, and rotational inertia. The device (about 75×55×50 mm; 125 g) is self‑contained with battery, control, and sensors. Unity computes the angles from motion/force and synchronizes them with the HMD visuals. In our implementation, users grasp a bottle of water in VR and the tilt changes according to grip and motion.

## Benefits
Despite being small and lightweight, the device can convey the feeling that the properties of the grasped object “change over time.” With the simple motion of tilting a contact plane, it can compose multiple cues—stiffness, center‑of‑mass shift, and inertia—thereby breaking the trade‑off of “bulky device vs. single stimulus” and widening the experience space. Coupling visuals with haptic feedback enhances not only grasping but also the fun and plausibility of actions such as shaking and tilting.

## Outlook
We plan to evaluate the perceptibility of each function (stiffness, center‑of‑mass, inertia) in more detail and use the results to optimize the design and control. On the application side, we expect practical use as a compact option for delivering rich haptics in training tools, rehabilitation, and VR games.
