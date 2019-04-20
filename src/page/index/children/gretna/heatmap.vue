<template>
    <div id="heatmap">
    </div>
</template>

<script>
    /* eslint-disable */
    import * as d3 from 'd3'
    export default {
        name: "heatmap",
        props: {
            heatmapData: Object,
            size: Number
        },
        mounted() {
            // this.draw()
        },
        watch: {
            'heatmapData': function () {
                this.draw();
            },
            'atlas': function () {
                this.draw();
            }
        },
        methods: {
            draw: function () {
            // <path d="M250 150 L150 350 L350 350 Z" />

                // let data = d3.range(10);// (1) 生成一个10元素的数组
                let size = this.heatmapData.data.n,
                    list = this.heatmapData.data.list,
                    minV = this.heatmapData.data.min,
                    maxV = this.heatmapData.data.max;

                let a = d3.rgb(0,0,255),	//蓝色
                    b = d3.rgb(255,0,0);	//红色
                let color = d3.interpolateHslLong(a,b);
                let w = 500,
                    h = 500,
                    p = 40,//内边距
                    x = d3.scaleLinear().domain([0, size]).range([p, w - p]), //(2) 定义x和y比例尺
                    y = d3.scaleLinear().domain([0, size]).range([h - p, p]),
                    colorScale = d3.scaleLinear().domain([minV, maxV]).range([0, 1]);

//(3) 绘制SVG
                let svg = d3.select("#heatmap").append("svg")
                    .attr("id", "heatmap-svg")
                    .attr("width", w+110)
                    .attr("height", h);


                let border = svg.append("g");
                border.append("path")
                    .style("stroke","#000")
                    .attr('d','M '+ p + ' ' + p + ' ' +
                        'L '+ (w - p + 1) + ' ' + p + ' ' +
                        'L '+ (w - p + 1) + ' ' + (h - p - 1) + ' ' +
                        'L '+ p + ' ' + (h - p - 1) + ' Z')
                    .style("fill", color(colorScale(0)));
                // //(4) 给SVG添加分组，并设置样式类，样式见<style>标签中的设置
                let grid = svg.append("g");
                grid.selectAll(".grid")
                    .attr("class", "grid")
                    .data(list)
                    .enter().append("path")
                    .style("stroke-opacity",0.67)
                    .style("stroke","#fff")
                    // .attr('title',function (cell) {
                    //
                    // })
                    .attr('d',function (cell) {
                        return 'M '+ x(cell[1]) + ' ' + y(cell[0]) + ' ' +
                            'L '+ x(cell[1] + 1) + ' ' + y(cell[0]) + ' ' +
                            'L '+ x(cell[1] + 1) + ' ' + y(cell[0] + 1) + ' ' +
                            'L '+ x(cell[1]) + ' ' + y(cell[0] + 1) + ' Z';
                    })
                    .style("fill", function(cell) { return color(colorScale(cell[2])); })

                //定义一个线性渐变
                let defs = svg.append("defs");

                let linearGradient = defs.append("linearGradient")
                    .attr("id","linearColor")
                    .attr("x1","0%")
                    .attr("y1","100%")
                    .attr("x2","0%")
                    .attr("y2","0%");

                let stop = linearGradient
                    .selectAll("stop")
                    .data([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
                    .enter().append("stop")
                    .attr("offset",a => a + '%')
                    .style("stop-color",a => color(a/100.0).toString());
                //添加一个矩形，并应用线性渐变
                let colorRect = svg.append("rect")
                    .attr("x", w)
                    .attr("y", p)
                    .attr("width", 30)
                    .attr("height", h - p - p - 1)
                    .style("fill","url(#" + linearGradient.attr("id") + ")");
                //添加文字
                svg.append("text")
                    .attr("class","valueText")
                    .attr("x", w + 30)
                    .attr("y", h - p)
                    .attr("dy", "-0.3em")
                    .text(function(){
                        return '_';
                    });

                svg.append("text")
                    .attr("class","valueText")
                    .attr("x", w + 30)
                    .attr("y", p+2)
                    .attr("dy", "-0.3em")
                    .text(function(){
                        return '_';
                    });

                // min value text
                svg.append("text")
                    .attr("class","valueText")
                    .attr("x", w + 40)
                    .attr("y", h - p + 8)
                    .attr("dy", "-0.3em")
                    .text(function(){
                        return minV;
                    });

                // max value text

                svg.append("text")
                    .attr("class","valueText")
                    .attr("x", w + 40)
                    .attr("y", p + 9)
                    .attr("dy", "-0.3em")
                    .text(function(){
                        return maxV;
                    });
                if (maxV*minV<0) {
                    let pmap = d3.scaleLinear().domain([minV, maxV]).range([h-p, p])
                    svg.append("text")
                        .attr("class", "valueText")
                        .attr("x", w + 30)
                        .attr("y", pmap(0))
                        .attr("dy", "-0.3em")
                        .text(function () {
                            return '_';
                        });
                    svg.append("text")
                        .attr("class", "valueText")
                        .attr("x", w + 40)
                        .attr("y", pmap(0)+9)
                        .attr("dy", "-0.3em")
                        .text(function () {
                            return 0;
                        });
                    console.log(p, h - p, parseInt((p * maxV + (h - p) * minV) / (maxV - minV)))
                }
                this.transformSvg(document.getElementById('heatmap-svg'));
            },
            transformSvg: function (svgEl) {
                let svgString = new XMLSerializer().serializeToString(svgEl);
                let preface = '<?xml version="1.0" standalone="no"?>\r\n';
                let svg = new Blob([preface, svgString], {type: "image/svg+xml;charset=utf-8"});
                let canvas = document.createElement("canvas");
                canvas.width = 610;
                canvas.height = 500;
                let ctx = canvas.getContext("2d");
                let img = new Image();
                let url = URL.createObjectURL(svg);
                const size = this.size;
                img.onload = function() {
                    ctx.drawImage(img, 0, 0);
                    let png = canvas.toDataURL("image/png");
                    document.getElementById('heatmap').innerHTML = '<img src="'+png+'" width="'+(size*1.20)+'" height="'+size+'"/>';
                    URL.revokeObjectURL(png);
                };
                img.src = url;
            }
        }
    }
</script>

<style scoped>

</style>