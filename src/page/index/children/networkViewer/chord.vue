<template>
    <div id="chord">
        <svg id="chord-svg"></svg>
    </div>
</template>

<script>
    /* eslint-disable */
    import * as d3 from 'd3'
    export default {
        name: "chord",
        props: {
            chordData: Object,
            radius: Number
        },
        mounted() {
        },
        watch: {
            'chordData': function () {
                document.getElementById('chord-svg').innerHTML='';
                this.draw();
            }
        },
        methods: {
            draw: function () {
                let labelList = this.chordData.label;
                let matrix = this.chordData.matrix;
                // var svg = d3.select(this.$el), // 获取svg元素
                var svg = d3.select("#chord-svg")
                        .attr("width",1000)
                        .attr("height",1000), // 获取svg元素
                    width = +svg.attr("width"), // 获取svg元素的宽度
                    height = +svg.attr("height"), //   获取svg元素的高度
                    // 计算外半径尺寸，这里取svg画布的宽、高的最小值的一半，减去40，表示两边留有余地；
                    outerRadius = Math.min(width, height) * 0.5 - 100,
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
                    .text(function(d) { return labelList[d.index]; });

                // 给之前定义的g这个元素添加样式并绑定数据用来画弦图的弦。
                g.append("g")
                    .attr("class", "ribbons")
                    .selectAll("path")
                    .data(function(chords) { return chords; })
                    .enter().append("path")
                    .attr("d", ribbon)
                    // 弦的填充色是目标点的索引值确定的
                    .style("fill", function(d) { return color(d.target.index); })
                    .style("fill-opacity", 0.33)
                    .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); })
                    .style("stroke-opacity", 0.67);
                this.saveSvg(document.getElementById('chord-svg'), 'chord');
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
            },
        }
    }
</script>

<style scoped>

</style>