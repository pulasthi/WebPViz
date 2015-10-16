function generateCheckList(list, initcolors) {

    var tabletop = "<table class='table table-striped' id='cluster_table' style='background-color: #EAEAEA; padding-top: 0px'>"
        + "<thead>"
        + "<tr class='headings'>"
        + "<th>"
        + "<input type='checkbox' id='check-all' disabled='true' class='flat'> Cluster"
        + "</th>"
        + "<th class='column-title'>Label</th>"
        + "<th class='column-title'>Size</th>"
        + "</tr>"
        + "</thead>"
        + "<tbody>"

    var tablerows = "";

    for (i = 0; i < list.length; i++) {
        tablerows += "<tr class='even pointer'>"
            + "<td class='a-center'>"
            + "<input type='checkbox' class='flat' name='table_records' checked value='" + i + "'>"
            + "<label class='color-box-label'>" + i + "</label> "
            + "<div class='input-group color-pic1' style='width: 15px;height: 15px; display: inline-flex; padding-left: 20px;padding-top: 2px'>"
            + "<input value='" + initcolors[i] + "' class='form-control' type='hidden' id='"+ i + "'>"
            + "<span class='input-group-addon'><i style='background-color: rgb(1, 343, 69);'></i></span>"
            + "</div>"
            + "</td>"
            + "<td class=' '>C" + i + "</span></td>"
            + "<td class=' '>121</td>"
            + "</tr>"
    }

    var tableend = "</tbody>"
        + "</table>"


    return tabletop + tablerows + tableend;
}
var clusterUrl;
var clusters;
var resultSetId;

var container, stats;
var camera, scene, renderer, sprite, colors = [], particles = [], material, controls, light;
var mesh;
var particleSystem;
var colorMap = {};
var resultData;
var timeSeriesData = [];
var heus = [0.05, 0.3, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];

var mouseX = 10, mouseY = 10;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var scene3d;
var colors = [];
var colorlist = [];

function visualize(resultSetUrl, resultSet, id){
    clusterUrl = resultSetUrl;
    clusters = resultSet.clusters;
    resultSetId = id;
    generateGraph();
    animate();
}

function visualizeTimeSeries(resultSetUrl, timeSeries, id){

    var resultSets = timeSeries.resultsets.length;
    for (var i = 0; i < resultSets.length; i++) {
        clusterUrl = "/resultssetall/" + resultSets[i].id;
        alert(clusterUrl)
        $.getJSON(clusterUrl, function(data){
        });
    }


    //    resultSetId = id;
    //    generateGraph();
    //animate();
}


function animate() {
    //setTimeout( function() {
    //
    //    requestAnimationFrame( animate );
    //
    //}, 1000 / 30 );
    requestAnimationFrame( animate );
    controls.update();
    stats.update();

    render();
    // updatePoints();
}

function render() {
    var camera = scene3d.getObjectByName('camera');
    renderer.render(scene3d, camera);
}
//TODO WInodow rezise does not work yet need to fix
function onWindowResize() {
    var width = $('#canvas3d').width();
    var height = $('#canvas3d').height();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    controls.handleResize();
    render();
}

function updatePoints(){
    for (var j in particles) {
        for (var i in particles[j].geometry.vertices) {
            particles[j].geometry.vertices[i].x += 0.001;
            particles[j].geometry.vertices[i].y  += 0.001
            particles[j].geometry.vertices[i].z  += 0.001
            particles[j].geometry.verticesNeedUpdate = true;
        }
    }
}

//function generateGraph() {
//    renderer = null;
//    particles = [];
//    colors = [];
//    controls = null;
//
//    var canvasWidth = $('#canvas3d').width();
//    var canvasHeight = $('#canvas3d').height();
//    //new THREE.Scene
//    scene3d = new THREE.Scene();
//    stats = new Stats();
//    //set the scene
//    var canvas3d = $('#canvas3d');
//    //new THREE.WebGLRenderer
//    renderer = new THREE.WebGLRenderer({canvas: canvas3d.get(0), antialias: true});
//    renderer.setSize(canvasWidth, canvasHeight);
//    renderer.setClearColor(0x121224, 1);
//
//    //new THREE.PerspectiveCamera
//    var camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 10000);
//    camera.name = 'camera';
//    camera.position.set(1,1,1);
//    scene3d.add(camera);
//    //removeclusters.push("1")
//    // new THREE.TrackballControls
//    controls = new THREE.OrbitControls(camera, renderer.domElement);
//    var cluster
//
//    var geometry = [];
//    for (var i = 0; i < clusters.length; i++) {
//        geometry.push(new THREE.Geometry());
//        colors.push(new Array());
//        particles.push(new Array());
//    }
//    var hsl;
//    var sections = [];
//    //TODO try to make the loop here not dependent on the fact that row[4] starts from 0
//    //for (var i in resultData.data) {
//    //    var row = resultData.data[i]
//    //    if(!(typeof row[4] === 'undefined')) {
//    //
//    //        if (geometry.length == row[4]) {
//    //            geometry.push(new THREE.Geometry());
//    //            colors.push(new Array());
//    //        }
//    //        hsl = [heus[row[4]], 1, 0.8];
//    //        var vertex = new THREE.Vector3();
//    //        vertex.x = row[1] * 10;
//    //        vertex.y = row[2] * 10;
//    //        vertex.z = row[3] * 10;
//    //
//    //        geometry[row[4]].vertices.push(vertex);
//    //
//    //        if (sections.indexOf(row[4]) == -1)
//    //            sections.push(row[4]);
//    //
//    //        colors[row[4]].push(new THREE.Color(0xffffff).setHSL(hsl[0], hsl[1], hsl[2]));
//    //      //  setupTween(geometry[row[4]].vertices.length, vertex.x,vertex.y,vertex.z, row[4])
//    //    }
//    //}
//    $.getJSON(clusterUrl, function(data){
//        for (var i = 0; i < clusters.length; i++) {
//            var clusterdata = data.clusters[i];
//            var clusterid = clusterdata.clusterid;
//
//            hsl = [heus[clusterid], 1, 0.8];
//
//            for (var k in clusterdata.points) {
//                var p = clusterdata.points[k];
//
//                //var hsl = [heus[data.cid], 1, 0.8];
//                var vertex = new THREE.Vector3(p.x * 10, p.y * 10, p.z * 10);
//                geometry[clusterid].vertices.push(vertex);
//
//                //TODO can cchange this
//                if (sections.indexOf(clusterid) == -1)
//                    sections.push(clusterid);
//
//                colors[clusterid].push(new THREE.Color(0xffffff).setHSL(hsl[0], hsl[1], hsl[2]));
//
//            }
//        }
//        for(var i in geometry){
//            colorlist.push(colors[i][0].getHexString());
//            geometry[i].colors = colors[i];
//            particles[i] =  new THREE.PointCloud(geometry[i], material);
//            scene3d.add(particles[i]);
//
//        }
//        window.document.getElementById("cluster_table_div").innerHTML = generateCheckList(sections,colorlist);
//        stats.domElement.style.position = 'absolute';
//        document.getElementById("stats").appendChild(stats.domElement);
//        window.addEventListener('resize', onWindowResize, false);
//        $('.color-pic1').colorpicker();
//        render();
//        animate();
//    });
//
//
//    material = new THREE.PointCloudMaterial({
//        size: 0.003,
//        map: sprite,
//        vertexColors: THREE.VertexColors,
//        transparent: true
//    });
//    material.color.setHSL(1.0, 1, 1);
//    //for(var i in geometry){
//    //    colorlist.push(colors[i][0].getHexString());
//    //    geometry[i].colors = colors[i];
//    //    particles.push( new THREE.PointCloud(geometry[i], material));
//    //    scene3d.add(particles[i]);
//    //
//    //}
//
//    animate();
//
//}

function generateTimeSeries(index) {
    renderer = null;
    particles = [];
    colors = [];
    controls = null;

    var canvasWidth = $('#canvas3d').width();
    var canvasHeight = $('#canvas3d').height();
    //new THREE.Scene
    scene3d = new THREE.Scene();
    stats = new Stats();
    //set the scene
    var canvas3d = $('#canvas3d');
    //new THREE.WebGLRenderer
    renderer = new THREE.WebGLRenderer({canvas: canvas3d.get(0), antialias: true});
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x121224, 1);

    //new THREE.PerspectiveCamera
    var camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 10000);
    camera.name = 'camera';
    camera.position.set(1,1,1);
    scene3d.add(camera);
    //removeclusters.push("1")
    // new THREE.TrackballControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    var cluster

    var geometry = [];
    var hsl;
    var sections = [];
    //TODO try to make the loop here not dependent on the fact that row[4] starts from 0
    for (var i in timeSeriesData[index].data) {
        var row = timeSeriesData[index].data[i]
        if(!(typeof row[4] === 'undefined')) {

            if (geometry.length == row[4]) {
                geometry.push(new THREE.Geometry());
                colors.push(new Array());
            }
            hsl = [heus[row[4]], 1, 0.8];
            var vertex = new THREE.Vector3();
            vertex.x = row[1] * 10;
            vertex.y = row[2] * 10;
            vertex.z = row[3] * 10;

            geometry[row[4]].vertices.push(vertex);

            if (sections.indexOf(row[4]) == -1)
                sections.push(row[4]);

            colors[row[4]].push(new THREE.Color(0xffffff).setHSL(hsl[0], hsl[1], hsl[2]));
            //  setupTween(geometry[row[4]].vertices.length, vertex.x,vertex.y,vertex.z, row[4])
        }
    }


    material = new THREE.PointCloudMaterial({
        size: 0.003,
        map: sprite,
        vertexColors: THREE.VertexColors,
        transparent: true
    });
    material.color.setHSL(1.0, 1, 1);
    for(var i in geometry){
        colorlist.push(colors[i][0].getHexString());
        geometry[i].colors = colors[i];
        particles.push( new THREE.PointCloud(geometry[i], material));
        scene3d.add(particles[i]);

    }
    window.document.getElementById("cluster_table_div").innerHTML = generateCheckList(sections,colorlist);
    stats.domElement.style.position = 'absolute';
    document.getElementById("stats").appendChild(stats.domElement);
    window.addEventListener('resize', onWindowResize, false);
    $('.color-pic1').colorpicker();
    render();
    animate();

}

function removeSection(id){
    scene3d.remove(particles[id]);
}

function addSection(id){
    scene3d.add(particles[id]);
}

function recolorSection(id, color){
    colorlist[id] = color;
    for(var i in colors[id]){
        colors[id][i] = new THREE.Color(color);
    }
    particles[id].geometry.colors = colors[id];
    particles[id].geometry.colorsNeedUpdate = true;
}