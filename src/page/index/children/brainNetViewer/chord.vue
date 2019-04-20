<template>
    <div id="chord">
    </div>
</template>

<script>
    /* eslint-disable */
    import * as d3 from 'd3'
    import { aal90label, Brodmann82label, CustomROI6label, DesikanKilliany68label, Dos160label, Fair34label, HOA112label, LPBA56label } from '../data-index'
    const emptyMat = new Array(90)
    for (let i = 0; i < emptyMat.length; i++) {
        emptyMat[i] = new Array(emptyMat.length).fill(0)
        emptyMat[i][i] = 1
    }
    export default {
        name: "chord",
        props: {
            matrix: Array,
            atlas: String,
            size: Number
        },
        mounted() {
            this.draw();
            const ribbons = this.ribbons
            // setTimeout(function () {
            //     emptyMat.forEach((arr,i)=>arr[i+45%emptyMat.length] = 1)
            //     ribbons.remove()
            // },5*1000)
        },
        watch: {
            'matrix': function () {
                this.draw();
            },
            'atlas': function () {
                this.draw();
            }
        },
        data() {
            return {
                chordsize: 1000,
                label: aal90label,
                ribbons: null
            }
        },
        methods: {
            draw: function () {
                document.getElementById('chord').innerHTML = ''
                if (this.chordData === null || this.chordData === '') return;
                let labelList = this.label;
                // let matrix = this.matrix;
                let matrix = emptyMat;
                // console.log(matrix)
                // var svg = d3.select(this.$el), // 获取svg元素
                this.chordsize = matrix.length < 100 ? 1000 : matrix.length * 16;
                var svg = d3.select("#chord").append('svg')
                        .attr("id","chord-svg")
                        .attr("width",this.chordsize)
                        .attr("height",this.chordsize), // 获取svg元素
                    width = +svg.attr("width"), // 获取svg元素的宽度
                    height = +svg.attr("height"), //   获取svg元素的高度
                    // 计算外半径尺寸，这里取svg画布的宽、高的最小值的一半，减去40，表示两边留有余地；
                    outerRadius = Math.min(width, height) * 0.5 - 120,
                    // 计算内半径尺寸
                    innerRadius = outerRadius - 30;

                // 定义数值的格式化函数
                var chord = d3.chord()
                    // 设置弦片段之间的间隔角度，即chord diagram 图中组成外层圆圈的各个弧段之间的角度
                    .padAngle(0.01)
                    // 设置数据矩阵matrix 的行内各列的排序顺序为降序排列
                    .sortSubgroups(d3.descending);

                // 定义一个弧线的布局函数arc()
                var arc = d3.arc()
                // 设置弧线的内半径
                    .innerRadius(innerRadius)
                    // 设置弧线的外半径
                    .outerRadius(outerRadius);

                // 定义一个弦布局函数ribbon()
                var ribbon = d3.ribbon()
                // 设置弦的半径为弧线的内半径
                    .radius(innerRadius);

                // 定义一个颜色函数color(),返回离散的颜色值，即四种颜色
                var color = d3.scaleOrdinal()
                    .domain(d3.range(4))
                    .range(['#ff0000','#eb4310','#f6941d','#fbb417','#ffff00','#cdd541','#99cc33','#3f9337','#219167','#239676','#24998d','#1f9baa','#0080ff','#3366cc','#333399','#003366','#800080','#a1488e','#c71585','#bd2158']);

                // 定义一个组元素
                var g = svg.append("g")
                    // 将组元素移动到画布的中心处
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

                    // chord(matrix)函数用来将matrix数组转换为chord diagram 所需的数据格式，
                    // 通过datum将转换后用于显示弦图的数据绑定到 g元素上；
                    .datum(chord(matrix));

                // 定义一组g元素，用来绑定弦图的 groups数据，即弧线
                var group = g.append("g")
                    .attr("class", "groups")
                    .selectAll("g")
                    .data(function(chords) { return chords.groups; })
                    .enter().append("g");

                // group元素是用来放置弦图的“弧”的
                group.append("path")
                // 设置弧的填充色用color函数来获取
                    .style("fill", function(d) { return color(d.index); })
                    // 设置弧的边缘线用比其填充色较深的颜色来画
                    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
                    // 绑定arc布局到group的d属性上，用来画弧
                    .attr("d", arc);
                group.append("text")
                    .attr("x", 8)
                    .attr("dy", ".35em")
                    .attr("transform", d => {
                        let angle = ( d.startAngle + d.endAngle ) / 2;
                        if ( angle < Math.PI ) return "rotate("+ ( angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)";
                        return "rotate("+ ( angle * 180 / Math.PI + 90 ) + ") translate(-" + (outerRadius + 16) + ",0)";
                    })
                    .style("text-anchor", d => ( d.startAngle + d.endAngle ) / 2 < Math.PI  ? "start" : "end")
                    .text(function(d) { return labelList === undefined ? null : labelList[d.index]; });

                // 给之前定义的g这个元素添加样式并绑定数据用来画弦图的弦。
                this.ribbons = g.append("g")
                    .attr("class", "ribbons")
                    .attr("id", "ribbons")
                    .selectAll("path")
                    .data(function(chords) { return chords; })
                    .enter().append("path")
                    .attr("d", ribbon)
                    // 弦的填充色是目标点的索引值确定的
                    .style("fill", function(d) { return color(d.target.index); })
                    .style("fill-opacity", 0.0)
                    .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); })
                    .style("stroke-opacity", 0.67);
                // this.transformSvg(document.getElementById('chord-svg'));
            },
            transformSvg: function (svgEl) {
                var svgString = new XMLSerializer().serializeToString(svgEl);
                var preface = '<?xml version="1.0" standalone="no"?>\r\n';
                var svg = new Blob([preface, svgString], {type: "image/svg+xml;charset=utf-8"});
                var canvas = document.createElement("canvas");
                canvas.width = this.chordsize;
                canvas.height = this.chordsize;
                var ctx = canvas.getContext("2d");
                var img = new Image();
                var url = URL.createObjectURL(svg);
                const size = this.size;
                img.onload = function() {
                    ctx.drawImage(img, 0, 0);
                    var png = canvas.toDataURL("image/png");
                    document.getElementById('chord').innerHTML = '<img src="'+png+'" width="'+size+'" height="'+size+'"/>';
                    URL.revokeObjectURL(png);
                };
                img.src = url;
            },
            hierarchicalEdge: function () {
                let diameter = 960, //直径
                    radius = diameter / 2, //半径
                    innerRadius = radius - 120; //环内半径

                let cluster = d3.cluster()
                    .size([360, innerRadius]);

                let line = d3.radialLine()
                    .curve(d3.curveBundle.beta(0.85))
                    .radius(function(d) { return d.y; })
                    .angle(function(d) { return d.x / 180 * Math.PI; });

                let svg = d3.select("body").append("svg")
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .append("g")
                    .attr("transform", "translate(" + radius + "," + radius + ")");

                let link = svg.append("g").selectAll(".link"),
                    node = svg.append("g").selectAll(".node")
                // draw
                function draw(classes) {
                    var root = packageHierarchy(classes)
                        .sum(function(d) { return d.size; });

                    cluster(root);

                    link = link
                        .data(packageImports(root.leaves()))
                        .enter().append("path")
                        .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
                        .attr("class", "link")
                        .attr("d", line);

                    node = node
                        .data(root.leaves())
                        .enter().append("text")
                        .attr("class", "node")
                        .attr("dy", "0.31em")
                        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                        .text(function(d) { return d.data.key; });
                };
                function packageHierarchy(classes) {
                    var map = {};

                    function find(name, data) {
                        var node = map[name], i;
                        if (!node) {
                            node = map[name] = data || {name: name, children: []};
                            if (name.length) {
                                node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                                node.parent.children.push(node);
                                node.key = name.substring(i + 1);
                            }
                        }
                        return node;
                    }

                    classes.forEach(function(d) {
                        find(d.name, d);
                    });

                    return d3.hierarchy(map[""]);
                }

                // Return a list of imports for the given array of nodes.
                function packageImports(nodes) {
                    var map = {},
                        imports = [];

                    // Compute a map from name to node.
                    nodes.forEach(function(d) {
                        map[d.data.name] = d;
                    });

                    // For each import, construct a link from the source to target node.
                    nodes.forEach(function(d) {
                        if (d.data.imports) d.data.imports.forEach(function(i) {
                            imports.push(map[d.data.name].path(map[i]));
                        });
                    });

                    return imports;
                }
            }
        }
    }
</script>

<style scoped>

</style>