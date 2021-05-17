import * as dat from "../node_modules/dat.gui/build/dat.gui.module.js";


class GridToggles {
    constructor (camera) {
        console.log(camera);
        this.camera = camera;
        console.log(this.camera);

        var gui = new dat.GUI({ load: getPresetJSON(), preset: 'Preset1' });

        var cameraSettingsObject = {
            type1_boolean: false,
            type2_string: 'string',
            type3_number: 0,
            x_position: 13,
            y_position: 6,
            z_position: 14,
            fov: 55,
            Set_First_Person: function() {
                // camera.position.set(this.x_position,this.y_position,this.z_position);
                this.camera.fov = this.fov;
                this.camera.updateProjectionMatrix();
                // first person
                this.camera.position.set(13,6,14);
                this.camera.lookAt(13,0,-10)
            }.bind(this),
            Set_Third_Person: function () {

                this.camera.position.set(13, 16, 15);
                this.camera.lookAt(13,-220,15);
                // console.log(camera.position)
                // camera.fov = 120;
                // camera.updateProjectionMatrix();

            }.bind(this),
        };

        var gridSettingsObject = {
            grid_size: 7,
            grid_spacing: 2,
            ResetGrid: function () {
                const grid = new Grid(this.grid_size, this.grid_spacing, camera, models);
                scene.add(grid.group);

            },
        };

        console.log(cameraSettingsObject.x_position)

        // dat.GUI will modify colors in the format defined by their initial value.

        // saveValues: gui.remember must be executed before gui.add
        gui.remember(cameraSettingsObject);
        gui.remember(gridSettingsObject);

        // setController: boolean, string, number, function


        var cameraSettingsFolder = gui.addFolder('Camera Settings');
        cameraSettingsFolder.add(cameraSettingsObject, 'x_position', -100,100,1);
        cameraSettingsFolder.add(cameraSettingsObject, 'y_position', 6,50,1);
        cameraSettingsFolder.add(cameraSettingsObject, 'z_position', -100,100,1);
        cameraSettingsFolder.add(cameraSettingsObject, 'fov', 55, 120, 1);
        cameraSettingsFolder.add(cameraSettingsObject, 'Set_First_Person');
        cameraSettingsFolder.add(cameraSettingsObject, 'Set_Third_Person');

        // collapse folder1

        var gridSettingsFolder = gui.addFolder('Grid Settings');
        gridSettingsFolder.add(gridSettingsObject, 'grid_size', 1,30,1);
        gridSettingsFolder.add(gridSettingsObject, 'grid_spacing', 7);
        gridSettingsFolder.add(gridSettingsObject, 'ResetGrid');


        // presetJSON: created from pressing the gear.
        function getPresetJSON() {
        return {
            preset: 'Default',
            closed: false,
            remembered: {
            Default: {
                0: {
                type1_boolean: false,
                type2_string: 'string',
                type3_number: 0,
                },
                1: {
                string1: 'string1',
                string2: 'string2',
                },
            },
            Preset1: {
                0: {
                type1_boolean: true,
                type2_string: 'string123',
                type3_number: -2.2938689217758985,
                },
                1: {
                string1: 'string_2',
                string2: 'string_3',
                },
            },
            },
            folders: {
            FolderNameA: {
                preset: 'Default',
                closed: false,
                folders: {},
            },
            FolderNameB: {
                preset: 'Default',
                closed: false,
                folders: {},
            },
            FolderNameC: {
                preset: 'Default',
                closed: false,
                folders: {},
            },
            },
        };
        }
    }
}

export { GridToggles }