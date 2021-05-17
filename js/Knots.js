import * as THREE from '../node_modules/three/build/three.module.js';

const part = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshPhongMaterial({
	color: new THREE.Color(0.1,0.1,0.1),
	emmissive: new THREE.Color(1, 1, 0),
	emmissiveIntensity: 100,
	reflectivity: 1,
	shininess: 0.98,
}));

// Line
const line = part.clone();
line.add(part.clone().translateY(1));
line.add(part.clone().translateY(-1));

// Turn
const turn = part.clone();
turn.add(part.clone().translateX(1));
turn.add(part.clone().translateY(1));

// Down
const down = part.clone();
down.add(part.clone().translateY(-1));
down.add(part.clone().translateZ(-1));

// Up
const up = part.clone();
up.add(part.clone().translateY(-1));
up.add(part.clone().translateZ(1));

// Vertical
const vertical = part.clone();
vertical.add(part.clone().translateZ(1));
vertical.add(part.clone().translateZ(-1));

// Empty
const empty = null;

const Knots = {
	"pixelsize": "8",
	"voxelsize": "3",
	"tiles": [
		{
		"name": "down",
		"symmetry": "T",
		"mesh": down
		},
		{
		"name": "empty",
		"symmetry": "X",
		"mesh": empty
		},
		{
		"name": "line",
		"symmetry": "I",
		"mesh": line
		},
		{
		"name": "turn",
		"symmetry": "L",
		"mesh": turn
		},
		{
		"name": "up",
		"symmetry": "T",
		"mesh": up
		},
		{
		"name": "vertical",
		"symmetry": "X",
		"mesh": vertical
		}
	],
	"neighbors": [
		{
			"left": "down 1",
			"right": "down 3",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "down",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "down 1",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "down 2",
			"orientation": "horizontal"
		},
		{
			"left": "down 3",
			"right": "down 1",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "empty",
			"orientation": "horizontal"
		},
		{
			"left": "down 3",
			"right": "empty",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "line",
			"orientation": "horizontal"
		},
		{
			"left": "down 3",
			"right": "line",
			"orientation": "horizontal"
		},
		{
			"left": "down 1",
			"right": "line 1",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "turn",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "turn 3",
			"orientation": "horizontal"
		},
		{
			"left": "down 3",
			"right": "turn",
			"orientation": "horizontal"
		},
		{
			"left": "down 1",
			"right": "turn 1",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "up",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "up 1",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "up 2",
			"orientation": "horizontal"
		},
		{
			"left": "down 3",
			"right": "up",
			"orientation": "horizontal"
		},
		{
			"left": "down 3",
			"right": "up 1",
			"orientation": "horizontal"
		},
		{
			"left": "down 1",
			"right": "up 3",
			"orientation": "horizontal"
		},
		{
			"left": "down",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "down 3",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "empty",
			"right": "empty",
			"orientation": "horizontal"
		},
		{
			"left": "empty",
			"right": "line",
			"orientation": "horizontal"
		},
		{
			"left": "empty",
			"right": "turn",
			"orientation": "horizontal"
		},
		{
			"left": "empty",
			"right": "up",
			"orientation": "horizontal"
		},
		{
			"left": "empty",
			"right": "up 1",
			"orientation": "horizontal"
		},
		{
			"left": "empty",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "line",
			"right": "line",
			"orientation": "horizontal"
		},
		{
			"left": "line 1",
			"right": "line 1",
			"orientation": "horizontal"
		},
		{
			"left": "line",
			"right": "turn",
			"orientation": "horizontal"
		},
		{
			"left": "line 1",
			"right": "turn 1",
			"orientation": "horizontal"
		},
		{
			"left": "line",
			"right": "up",
			"orientation": "horizontal"
		},
		{
			"left": "line",
			"right": "up 1",
			"orientation": "horizontal"
		},
		{
			"left": "line 1",
			"right": "up 3",
			"orientation": "horizontal"
		},
		{
			"left": "line",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "turn",
			"right": "turn 2",
			"orientation": "horizontal"
		},
		{
			"left": "turn",
			"right": "turn 1",
			"orientation": "horizontal"
		},
		{
			"left": "turn 1",
			"right": "turn",
			"orientation": "horizontal"
		},
		{
			"left": "turn 1",
			"right": "turn 3",
			"orientation": "horizontal"
		},
		{
			"left": "turn",
			"right": "up 3",
			"orientation": "horizontal"
		},
		{
			"left": "up",
			"right": "turn",
			"orientation": "horizontal"
		},
		{
			"left": "up",
			"right": "turn 3",
			"orientation": "horizontal"
		},
		{
			"left": "up 3",
			"right": "turn",
			"orientation": "horizontal"
		},
		{
			"left": "turn 1",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "up 1",
			"right": "up 3",
			"orientation": "horizontal"
		},
		{
			"left": "up",
			"right": "up",
			"orientation": "horizontal"
		},
		{
			"left": "up",
			"right": "up 1",
			"orientation": "horizontal"
		},
		{
			"left": "up",
			"right": "up 2",
			"orientation": "horizontal"
		},
		{
			"left": "up 3",
			"right": "up 1",
			"orientation": "horizontal"
		},
		{
			"left": "up",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "up 3",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "vertical",
			"right": "vertical",
			"orientation": "horizontal"
		},
		{
			"left": "empty",
			"right": "down",
			"orientation": "vertical"
		},
		{
			"left": "empty",
			"right": "empty",
			"orientation": "vertical"
		},
		{
			"left": "empty",
			"right": "line",
			"orientation": "vertical"
		},
		{
			"left": "line",
			"right": "empty",
			"orientation": "vertical"
		},
		{
			"left": "empty",
			"right": "turn",
			"orientation": "vertical"
		},
		{
			"left": "turn",
			"right": "empty",
			"orientation": "vertical"
		},
		{
			"left": "up",
			"right": "empty",
			"orientation": "vertical"
		},
		{
			"left": "line",
			"right": "line",
			"orientation": "vertical"
		},
		{
			"left": "line",
			"right": "line 1",
			"orientation": "vertical"
		},
		{
			"left": "line",
			"right": "turn",
			"orientation": "vertical"
		},
		{
			"left": "turn",
			"right": "line",
			"orientation": "vertical"
		},
		{
			"left": "up",
			"right": "line",
			"orientation": "vertical"
		},
		{
			"left": "up 1",
			"right": "line",
			"orientation": "vertical"
		},
		{
			"left": "line",
			"right": "down",
			"orientation": "vertical"
		},
		{
			"left": "line 1",
			"right": "down",
			"orientation": "vertical"
		},
		{
			"left": "turn",
			"right": "down",
			"orientation": "vertical"
		},
		{
			"left": "turn 3",
			"right": "down",
			"orientation": "vertical"
		},
		{
			"left": "up",
			"right": "down",
			"orientation": "vertical"
		},
		{
			"left": "up",
			"right": "down 1",
			"orientation": "vertical"
		},
		{
			"left": "up",
			"right": "down 2",
			"orientation": "vertical"
		},
		{
			"left": "down",
			"right": "up",
			"orientation": "vertical"
		},
		{
			"left": "down",
			"right": "up 1",
			"orientation": "vertical"
		},
		{
			"left": "down",
			"right": "up 2",
			"orientation": "vertical"
		},
		{
			"left": "down",
			"right": "vertical",
			"orientation": "vertical"
		},
		{
			"left": "turn",
			"right": "turn",
			"orientation": "vertical"
		},
		{
			"left": "turn",
			"right": "turn 1",
			"orientation": "vertical"
		},
		{
			"left": "turn",
			"right": "turn 2",
			"orientation": "vertical"
		},
		{
			"left": "up",
			"right": "turn",
			"orientation": "vertical"
		},
		{
			"left": "up",
			"right": "turn 3",
			"orientation": "vertical"
		},
		{
			"left": "vertical",
			"right": "up",
			"orientation": "vertical"
		},
		{
			"left": "vertical",
			"right": "vertical",
			"orientation": "vertical"
		}
	],
	"subsets": [
		{
			"name": "dense knots",
			"tile": [
				{
					"name": "down",
					"symmetry": "T"
				},
				{
					"name": "line",
					"symmetry": "I"
				},
				{
					"name": "turn",
					"symmetry": "L"
				},
				{
					"name": "up",
					"symmetry": "T"
				},
				{
					"name": "vertical",
					"symmetry": "X"
				}
			]
		},
		{
			"name": "only turns",
			"tile": [
				{
					"name": "turn",
					"symmetry": "L"
				},
				{
					"name": "empty",
					"symmetry": "X"
				}
			]
		},
		{
			"name": "only lines",
			"tile": [
				{
					"name": "line",
					"symmetry": "I"
				}
			]
		},
		{
			"name": "layers",
			"tile": [
				{
					"name": "empty",
					"symmetry": "X"
				},
				{
					"name": "line",
					"symmetry": "I"
				},
				{
					"name": "turn",
					"symmetry": "L"
				},
			]
		}
	]
}

export { Knots };
