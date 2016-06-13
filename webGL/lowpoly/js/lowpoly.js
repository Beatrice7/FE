 // once everything is loaded, we run our Three.js stuff.
    function init() {

        var stats = initStats();
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();
        var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 10);
        camera.position.set(0, 0, 5);
        scene.add(camera);

        // create a render and set the size
        var renderer = new THREE.WebGLRenderer({
            // antialias: false
            antialias: true
        });
        //
        var renderPass = new THREE.RenderPass(scene, camera);

        var edgeShader = new THREE.ShaderPass(THREE.EdgeShader);

        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;

        var composer = new THREE.EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(edgeShader);
        composer.addPass(effectCopy);

        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        // vars  
        var input = document.getElementById('img-path');
          
        var maxVertexCnt = 2000;
        var hasWireframe = false;
        var renderSize;
        var srcImg;
        var srcPixelColorData;
        var vertices;

        var srcImgMesh;

        var faceMesh = null;
        var faceMaterial = new THREE.MeshBasicMaterial({
                vertexColors: THREE.FaceColors,
                color: 0xffffff
            });

        var wireframeMesh = null;
        var wireframeMaterial = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0x0e00ee
            }); 

        

        var controls = new function () {
            this['Upload Image'] = function() {
                input.addEventListener('change', function() {
                    var file = input.files[0];
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        srcImg = new Image();
                        srcImg.src = e.target.result;
                        srcImg.onload = function(){
                            renderSize = getRenderSize(e.target.result);
                            uploadImage(e.target.result);
                            getSrcPixel();
                        }
                        
                    } 
                    reader.readAsDataURL(file);

                    for(var i in gui.__controllers) {
                        gui.__controllers[i].updateDisplay();
                    }
                });
                input.click();               
            };
            //vertex
            this['Vertex Cnt'] = 2000;

            this['Wireframe'] = function(){
                hasWireframe = !hasWireframe;
                renderTriangles();
            }

            this['Render'] = function() {
                renderImg(srcImg.src);
            }

        };

        var gui = new dat.GUI();
        var vertexCntGui = gui.add(controls, 'Vertex Cnt', 1000, 5000).step(100);
        vertexCntGui.onChange(function(value){
            setVertexCnt(value);
        })
        gui.add(controls, 'Upload Image');
        gui.add(controls, 'Wireframe');
        gui.add(controls, 'Render');

        function setVertexCnt(cnt) {
            maxVertexCnt = cnt;
        }

        function initStats() {

            var stats = new Stats();

            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            document.getElementById("Stats-output").appendChild(stats.domElement);

            return stats;
        }

        function getRenderSize(src) {
            if(src !== srcImg.src){
                srcImg.removeAttribute("width");
                srcImg.removeAttribute("height");
                srcImg.src = src;
            }

            var iw = srcImg.width;
            var ih = srcImg.height;

            var cw = window.innerWidth;
            var ch = window.innerHeight;

            if (cw / ch > iw / ih) {
            /* |----------------------|
             * |    |************|    |
             * |    |************|    |
             * |    |************|    |
             * |    |************|    |
             * |----------------------|
             */
            // clip left and right part of the canvas
            var w = Math.floor(ch / ih * iw); //这里的意思就是按照高度扩大到与canvas相同，从而按照原图的比例扩大宽度， 
                                              //我这里的要求是不扩大载入的图片,后期改！
                                              var h = ch;
            var ow = Math.floor((cw - w) / 2); // offset 两边各自剪裁掉多少
            var oh = 0;
            } else {
                /* |----------------------|
                 * |                      |
                 * |----------------------|
                 * |**********************|
                 * |**********************|
                 * |----------------------|
                 * |                      |
                 * |----------------------|
                 */
                // clip top and bottom part of the canvas
                var w = cw;
                var h = Math.floor(cw / iw * ih);
                var ow = 0;
                var oh = Math.floor((ch - h) / 2);
            }

            return {
                w: w,
                h: h,
                dw: Math.floor(ow - cw / 2), //不懂，应该是个负数？？？
                dh: Math.floor(oh - ch / 2),
                ow: ow,
                oh: oh
            };
            
        }

        function getSrcPixel(){
            var canvas = document.createElement('canvas');
            canvas.width = srcImg.width;
            canvas.height = srcImg.height;
            var context = canvas.getContext('2d');
            context.drawImage(srcImg, 0, 0, srcImg.width, srcImg.height);
            var srcPixelData = context.getImageData(0, 0, srcImg.width, srcImg.height);
            srcPixelColorData = srcPixelData.data; 
        }

        //这个函数是为了显示原图
        function uploadImage(src){
            var planeGeometry = new THREE.PlaneGeometry(renderSize.w, renderSize.h, 1, 1);
    
            var texture = THREE.ImageUtils.loadTexture(src);
            var planeMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });

            if(faceMesh){
                scene.remove(faceMesh);
                faceMesh = null;
            }
            if(srcImgMesh){
                scene.remove(srcImgMesh);
                srcImgMesh = null;
            }
            srcImgMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            srcImgMesh.position.z = 1;
            
            scene.add(srcImgMesh);
        }

        function renderImg(src) {
            var startTime = new Date();
            composer.render();
            var gl = renderer.getContext();
            var pixels = new Uint8Array(renderSize.w * renderSize.h * 4);
            gl.readPixels(renderSize.ow, renderSize.oh, renderSize.w, renderSize.h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            getEdgePoint(pixels);

            triangles = Delaunay.triangulate(vertices); //triangls里面存的是角点的索引
            renderTriangles();
            var endTime = new Date();
            var time = parseFloat((endTime - startTime) / 1000, 3);
            console.log('Render time: ' + time + ' seconds');
            // render(); //这里如果不写，则显示的是composer之后的样子；写了就是渲染好了的low-poly风格了。
        }
 
        function getEdgePoint(pixels) {
            vertices = [[0,0], [0, 1], [1, 0], [1, 1]];
            var width  = renderSize.w;
            var height = renderSize.h;
            var data = pixels;
            var len = width * height;
            var loops = 0;
            var edgeCnt = Math.floor(maxVertexCnt * 0.95);
            var maxLoop = maxVertexCnt * 100;
            var i = 4; //因为verteices已经存了四个角点
            //随机取点
            for(; i < edgeCnt && loops < maxLoop; i++, loops++){
                var id = Math.floor(Math.random() * len);
                var x = id % width;
                var y = Math.floor(id / width);
                var red = pixels[id << 2];
          
                if(red > 80){
                    vertices.push([x / width, y / height]);
                }else{
                    i--;
                }
            }

            for(; i < maxVertexCnt; i++){
                var rx = Math.random();
                var ry = Math.random();
                vertices.push([rx, ry]);
            }
            
        }

        function renderTriangles() {
            //face mesh
            var geo = new THREE.Geometry();
            var len = triangles.length;
            var fid = 0;
            var iwn = srcImg.width;
            var ihn = srcImg.height;

            for(var i = len - 1; i > 2; i -= 3){
                //第i个三角形三个点的坐标
                var ip0 = triangles[i],
                    ip1 = triangles[i - 1],
                    ip2 = triangles[i - 2];
                var x0 = vertices[ip0][0] * renderSize.w + renderSize.dw,
                    y0 = vertices[ip0][1] * renderSize.h + renderSize.dh,
                    x1 = vertices[ip1][0] * renderSize.w + renderSize.dw,
                    y1 = vertices[ip1][1] * renderSize.h + renderSize.dh,
                    x2 = vertices[ip2][0] * renderSize.w + renderSize.dw,
                    y2 = vertices[ip2][1] * renderSize.h + renderSize.dh;
                //color
                var cx = Math.floor((vertices[ip0][0] + vertices[ip1][0] + vertices[ip2][0]) / 3 * iwn);
                var cy = ihn - Math.floor((vertices[ip0][1] + vertices[ip1][1] + vertices[ip2][1]) / 3 * ihn);
                cx = Math.min(iwn, Math.max(0, cx - 1));
                cy = Math.min(ihn, Math.max(0, cy - 1));
    
               var id = (cy * iwn + cx) * 4;
               var rgb = 'rgb(' + srcPixelColorData[id] + ', ' + srcPixelColorData[id + 1]
                + ', ' + srcPixelColorData[id + 2] + ')';
                
                geo.vertices.push(new THREE.Vector3(x0, y0, 1));
                geo.vertices.push(new THREE.Vector3(x1, y1, 1));
                geo.vertices.push(new THREE.Vector3(x2, y2, 1));
                geo.faces.push(new THREE.Face3(len - i - 1, len - i, len - i + 1));
                geo.faces[fid++].color = new THREE.Color(rgb);
               // console.log(rgb);

            }
           // console.log(geo);
            if(faceMesh){
                scene.remove(faceMesh);
                faceMesh = null;
            }
            if(srcImgMesh){
                scene.remove(srcImgMesh);
                srcImgMesh = null;
            }
            
            //scene.remove(imgMesh);
            faceMesh = new THREE.Mesh(geo, faceMaterial);
            scene.add(faceMesh);
            if(wireframeMesh){
                scene.remove(wireframeMesh);
                wireframeMesh = null;
            }
            wireframeMesh = new THREE.Mesh(geo, wireframeMaterial);
            wireframeMesh.position.z = 2;
            if(!hasWireframe){
                wireframeMesh.visible = false;
            }
            scene.add(wireframeMesh);

        }

        function render() {
            stats.update();
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            // composer.render();
        }

        render();
    }

    window.onload = init;