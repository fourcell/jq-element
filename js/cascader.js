(function () {


    class Cascader {
        constructor(evn, options) {
            this.evn = evn  //将节点保存
            console.log(evn, options)
        }

        //点击聚焦
        focus() {
            const { evn } = this
            $(evn).on('focus', function () {
                console.log(666)
            })
        }
    }


    //添加 cascader 方法
    $.fn.cascader = function (options = {}) {
        $(this).each(function () {
            //将每个节点 Switch 实例存储到 data 中
            $(this).data('switch', new Cascader($(this), options))
        })
    }

})()