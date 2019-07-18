# left-wrapper - 移动端H5 左滑插件

## demo

```html
<style>
.slide {
    height: 500px;
    width: 100%;
}

.left-slide {
    color: white;
    font-size: 50px;
    background-color: red;
}
.right-slide {
    background-color: green;
}
.right-slide p {
    color: white;
    font-size: 50px;
    float: right;
}
</style>   
<body>
  <div id='wrapper' class='left-wraper'>
    <div class="left-slide slide"></div>
    <div class="right-slide slide"></div>
	</div>
</body>

<script>
const wrapper1 = document.getElementById('wrapper1');
new LeftWrapper(wrapper1, {
    slideWidth: 200
});
</script>

```

## 参数

* wrapper：HTMLElement对象
* opts：配置
  * slideWidth    左滑最大值，number类型
  * duration       滑动结束后动画持续时间，单位ms。非必填，默认300
