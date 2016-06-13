
// once everything is loaded, we run our Three.js stuff.
function init() {                                       
	var imgPath = "./img/1.jpg";
    var input = document.getElementById('img-path');
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var renderer = new GlRenderer(20000, imgPath);
	hasWireframe = false;

	var controls = new function() {
		//uploadImage
        this['Upload Image'] = function() {
        	
        	input.addEventListener('change', function() {
        		var file = input.files[0];
        		var reader = new FileReader(); //???
        		reader.onload = function(e) {
        			// var start = new Date();
        			renderer.uploadImage(e.target.result, function(){
        				//renderTime(start);
        			});
        			renderer.render();

        		}
        		reader.readAsDataURL(file);

        		for(var i in gui.__controllers) {
        			gui.__controllers[i].updateDisplay();
        		}

        	});
        	input.click();
        };
        //vertex
        this['Vertex Cnt'] = 1000;

        this['Wireframe'] = function(){
        	hasWireframe = !hasWireframe;
        	//renderer.setWireframe(hasWireframe);
        }

        this['Render'] = function() {
        	//renderer.setVertexCnt( this['Vertex Cnt']);
        }
    };

    var gui = new dat.GUI();
    var vertexCntGui = gui.add(controls, 'Vertex Cnt', 100, 20000).step(100);
    vertexCntGui.onChange(function(value){
    	renderer.setVertexCnt(value);
    	renderer.render();
    })
    gui.add(controls, 'Upload Image');
    gui.add(controls, 'Wireframe');
    gui.add(controls, 'Render');


    function renderer () {
        renderer.render(function(){

        });
    }

}
window.onload = init;




