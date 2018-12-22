<template>
    <div id="heatmap">
        <svg id="heatmap-svg"></svg>
    </div>
</template>

<script>
    /* eslint-disable */
    import * as d3 from 'd3'
    export default {
        name: "heatmap",
        props: {
            heatmapData: Object
        },
        mounted() {
            // this.draw()
        },
        watch: {
            'heatmapData': function () {
                document.getElementById('heatmap-svg').innerHTML='';
                this.draw();
            }
        },
        methods: {
            draw: function () {
            // <path d="M250 150 L150 350 L350 350 Z" />

                var data = d3.range(10);// (1) 生成一个10元素的数组
                let size = this.heatmapData.data.n,
                    list = this.heatmapData.data.list,
                    minV = this.heatmapData.data.min,
                    maxV = this.heatmapData.data.max;

                var a = d3.rgb(0,0,255),	//蓝色
                    b = d3.rgb(255,0,0);	//红色
                var color = d3.interpolateHslLong(a,b);
                var w = 500,
                    h = 500,
                    p = 40,//内边距
                    x = d3.scaleLinear().domain([0, size]).range([p, w - p]), //(2) 定义x和y比例尺
                    y = d3.scaleLinear().domain([0, size]).range([h - p, p]),
                    colorScale = d3.scaleLinear().domain([minV, maxV]).range([0, 1]);

//(3) 绘制SVG
                var svg = d3.select("#heatmap-svg")
                    .attr("width", w+100)
                    .attr("height", h);


                var border = svg.append("g");
                border.append("path")
                    .style("stroke","#000")
                    .attr('d','M '+ p + ' ' + p + ' ' +
                        'L '+ (w - p + 1) + ' ' + p + ' ' +
                        'L '+ (w - p + 1) + ' ' + (h - p - 1) + ' ' +
                        'L '+ p + ' ' + (h - p - 1) + ' Z')
                    .style("fill", color(0));

//(4) 给SVG添加分组，并设置样式类，样式见<style>标签中的设置
                var grid = svg.append("g");
                grid.selectAll(".grid")
                    .attr("class", "grid")
                    .data(list)
                    .enter().append("path")
                    .style("stroke-opacity",0.67)
                    .style("stroke","#fff")
                    .attr('d',function (cell) {
                        return 'M '+ x(cell[1]) + ' ' + y(cell[0]) + ' ' +
                            'L '+ x(cell[1] + 1) + ' ' + y(cell[0]) + ' ' +
                            'L '+ x(cell[1] + 1) + ' ' + y(cell[0] + 1) + ' ' +
                            'L '+ x(cell[1]) + ' ' + y(cell[0] + 1) + ' Z';
                    })
                    .style("fill", function(cell) { return color(colorScale(cell[2])); })

                //定义一个线性渐变
                var defs = svg.append("defs");

                var linearGradient = defs.append("linearGradient")
                    .attr("id","linearColor")
                    .attr("x1","0%")
                    .attr("y1","100%")
                    .attr("x2","0%")
                    .attr("y2","0%");

                var stop = linearGradient
                    .selectAll("stop")
                    .data([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
                    .enter().append("stop")
                    .attr("offset",a => a + '%')
                    .style("stop-color",a => color(a/100.0).toString());
                //添加一个矩形，并应用线性渐变
                var colorRect = svg.append("rect")
                    .attr("x", w)
                    .attr("y", p)
                    .attr("width", 30)
                    .attr("height", h - p - p - 1)
                    .style("fill","url(#" + linearGradient.attr("id") + ")");
                //添加文字
                var minValueText = svg.append("text")
                    .attr("class","valueText")
                    .attr("x", w + 30)
                    .attr("y", h - p + 5)
                    .attr("dy", "-0.3em")
                    .text(function(){
                        return minV;
                    });

                var maxValueText = svg.append("text")
                    .attr("class","valueText")
                    .attr("x", w + 30)
                    .attr("y", p + 6)
                    .attr("dy", "-0.3em")
                    .text(function(){
                        return maxV;
                    });
                // var svgData = document.getElementById('heatmap-svg').outerHTML;
                // var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
                // var svgUrl = URL.createObjectURL(svgBlob);
                // window.open(svgUrl);
                this.saveSvg(document.getElementById('heatmap-svg'), 'heatmap');
            },
            saveSvg: function (svgEl, name) {
                svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                var svgData = svgEl.outerHTML;
                var preface = '<?xml version="1.0" standalone="no"?>\r\n';
                var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
                var svgUrl = URL.createObjectURL(svgBlob);
                var downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = name;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }
    }
</script>

<style scoped>

</style>