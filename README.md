# left-wrapper - 移动端H5 左滑插件

## demo

```html
<style>
 * {
    margin: 0;
    padding: 0;
}  
.slide {
    height: 200px;
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
     <div class="left-slide slide"><p>左滑部分</p></div>
     <div class="right-slide slide"><p>删除</p></div>
  </div>
</body>

<script>
const wrapper = document.getElementById('wrapper');
new LeftWrapper(wrapper, {
    slideWidth: 100
});
</script>

```

Using npm
```js
$ npm install left-wrapper --save
```

## params

* wrapper：HTMLElement对象
* opts：配置
  * slideWidth     左滑最大值，number类型
  * duration       滑动结束后动画持续时间，单位ms。非必填，默认300
