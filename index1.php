<!DOCTYPE html>
<html>
<head>
    <title>Color Graph</title>
    <style>
        canvas {
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <h2>Color Graph</h2> 
    <form id="graphForm">
        <label for="graph">Enter graph matrix:</label><br>
        <textarea id="graph" name="graph" rows="5" cols="30"></textarea><br><br>
        <input type="button" value="Color Graph" onclick="colorGraph()">
    </form>

    <canvas id="graphCanvas" width="400" height="300"></canvas>

    <script>
        function colorGraph() {
            var graphInput = document.getElementById('graph').value;
            var graphArray = graphInput.trim().split("\n").map(row => row.split(","));

            // Đảm bảo ma trận là vuông (có số hàng bằng số cột)
            var numVertices = graphArray.length;
            for (var i = 0; i < numVertices; i++) {
                if (graphArray[i].length !== numVertices) {
                    alert("Invalid input! Matrix must be square.");
                    return;
                }
            }

            var colors = new Array(numVertices).fill(0);

            // Tô màu cho từng đỉnh
            for (var i = 1; i < numVertices; i++) {
                var available = new Array(numVertices + 1).fill(true);

                // Duyệt qua các đỉnh kề và đánh dấu màu đã sử dụng
                for (var j = 0; j < numVertices; j++) {
                    if (graphArray[i][j] == 1 && colors[j] != 0) {
                        available[colors[j]] = false;
                    }
                }

                // Tìm màu đầu tiên có thể sử dụng
                for (var c = 1; c <= numVertices; c++) {
                    if (available[c]) {
                        colors[i] = c;
                        break;
                    }
                }
            }

            // Vẽ đồ thị với màu tương ứng và đường nối giữa các đỉnh
            var canvas = document.getElementById('graphCanvas');
            var ctx = canvas.getContext('2d');
            var vertexRadius = 20;
            var vertexSpacing = 50;
            var xOffset = 50;
            var yOffset = 50;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < numVertices; i++) {
                var color = colors[i];
                var x = xOffset + (i % 3) * vertexSpacing;
                var y = yOffset + Math.floor(i / 3) * vertexSpacing;

                // Vẽ đỉnh
                ctx.beginPath();
                ctx.arc(x, y, vertexRadius, 0, 2 * Math.PI);
                ctx.fillStyle = getColor(color);
                ctx.fill();
                ctx.stroke();

                // Vẽ số của đỉnh
                ctx.fillStyle = '#000';
                ctx.fillText(i.toString(), x, y);

                // Vẽ đường nối giữa các đỉnh
                for (var j = 0; j < numVertices; j++) {
                    if (graphArray[i][j] == 1) {
                        var x2 = xOffset + (j % 3) * vertexSpacing;
                        var y2 = yOffset + Math.floor(j / 3) * vertexSpacing;

                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                }
            }
        }

        // Hàm chuyển đổi số màu thành màu tương ứng
        function getColor(color) {
            switch (color) {
                case 1:
                    return '#ffcccc'; // Màu đỏ nhạt
                case 2:
                    return '#ccffcc'; // Màu xanh nhạt
                case 3:
                    return '#ccccff'; // Màu lam nhạt
                // Thêm màu khác tùy thuộc vào số lượng màu bạn cần
                default:
                    return '#ffffff'; // Màu trắng
            }
        }
    </script>
</body>
</html>
