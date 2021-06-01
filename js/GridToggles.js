import * as dat from "../node_modules/dat.gui/build/dat.gui.module.js";


class GridToggles {
    constructor (camera, cameraController, grid) {
        this.camera = camera;
        this.cameraController = cameraController;
        this.grid = grid;

        var gui = new dat.GUI();

        var cameraSettingsObject = {
            type1_boolean: false,
            type2_string: 'string',
            type3_number: 0,
            x_position: 13,
            y_position: 6,
            z_position: 14,
            fov: 55,
            Set_First_Person: () => this.cameraController.toFirstPerson(),
            Set_Third_Person: () => this.cameraController.toThirdPerson(),
        };

        var gridSettingsObject = {
            grid_size: 14,
            grid_spacing: 2,
            ResetGrid: () => this.grid.updateSizeAndSpacing(gridSettingsObject.grid_size, gridSettingsObject.grid_spacing),
        };

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
        gridSettingsFolder.add(gridSettingsObject, 'grid_spacing', 1,30,1);
        gridSettingsFolder.add(gridSettingsObject, 'ResetGrid');
    }
}

export { GridToggles }