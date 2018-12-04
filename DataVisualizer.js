class DataVisualizer {
    constructor({
        baseMapURL,
        dataMapURL,
        width,
        height,
        dataDepth,
    }) {
        this.baseMapURL = baseMapURL;
        this.dataMapURL =  dataMapURL;
        this.width = width;
        this.height = height;
        this.dataDepth = dataDepth;
    }

    async init() {
        this.scene = new THREE.Scene();
        // camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 50, 50);
        // renderer
        const rendererOptions = {
            antialias: true,
        };
        this.renderer = new THREE.WebGLRenderer(rendererOptions);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // set up lights
        this.setupLights();

        function threshold(value, thresholdValue){
            if(value < thresholdValue) {
                return undefined;
            }else{
                return value;
            }
        }

        function f(x) {
            return Math.max(0, Math.min(1, Math.exp(x * 2) / 2.2 - 1));
        }

        // array of rows of values
        const imageData = await getImageData(this.dataMapURL, 0.1);
        const data = imageData.map(row => row.map(([r,g,b,a]) => threshold(f(1 - r / 255)), 0.25));
        const dataWidth  = data.length;
        const dataHeight =  data[0] ? data[0].length : 0;

        // add it to the html
        document.body.appendChild(this.renderer.domElement);

        const materials = DataVisualizer.createMaterialPalette(10);

        const mergedGeometry = new THREE.Geometry();

        for(let j = 0; j < data.length; j++) {
            const row = data[j];
            for(let i = 0; i < row.length; i++) {    
                const value = row[i];
                if(value === undefined)
                    continue;
                const cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
                const cube = new THREE.Mesh(cubeGeometry);
                cube.applyMatrix(new THREE.Matrix4().makeTranslation(i - dataWidth / 2, 0.5, j - dataHeight / 2));
                cube.applyMatrix(new THREE.Matrix4().makeScale(1, 10 * value, 1));
                for(let k = 0; k < cubeGeometry.faces.length; k++){
                    cubeGeometry.faces[k].materialIndex = Math.round((1 - value) * (materials.length - 1));
                }
                mergedGeometry.merge(cubeGeometry, cube.matrix);
            }
        }

        const mergedMesh = new THREE.Mesh(mergedGeometry, materials);
        const map = createMap({
            width: this.width,
            height: this.height,
            url: this.baseMapURL
        });
        this.scene.add(map);
        this.scene.add(mergedMesh);

        this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.animate();
        console.log('DataVisualizer inited');
    }

    static createMaterialPalette(count){
        const  materials = [];
        for(let i = 0; i < count; i++ ){
            const material = new THREE.MeshPhongMaterial();
            const colorComponent = Math.round(i / count  * 255);
            material.color = new THREE.Color(`rgb(255, ${colorComponent}, 0)`);
            material.transparent = true;
            material.opacity = 0.5;
            materials.push(material);
        }
        return materials;
    }

    setupLights(){
        const lights = [];
        const light1 = new THREE.PointLight(0xffffff, 0.5, 0);
        light1.position.set(0,200,0);
        lights.push(light1);
        const light2 = new THREE.PointLight(0xffffff, 0.5, 0);
        light2.position.set(100,100,0);
        lights.push(light2);
        const light3 = new THREE.PointLight(0xffffff, 0.5, 0);
        light3.position.set(-100,-200,-100);
        lights.push(light3);
        for(let i = 0; i < lights.length; i++ ){
            this.scene.add(lights[i]);
        }
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        // put your objects to draw here
        this.control.update();
        requestAnimationFrame(() => this.animate());
    }
}