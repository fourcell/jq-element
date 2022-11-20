(function () {

    const defaultOptions = {
        is_open: true,    //初始状态值
        active_color: '#409EFF',  //switch 打开的背景颜色
        inactive_color: '#C0CCDA', //switch 关闭的背景颜色
        active_value: true,  //switch 打开的值 可以是 boolean, String, number
        inactive_value: false, //switch 关闭的值
    }

    class Switch {
        constructor(element, options) {
            this.element = element
            this.options = Object.assign(defaultOptions, options)  //将默认值和配置合并
            this.options.defValue = this.options.is_open ? this.options.active_value : this.options.inactive_value
            this.hold = true
            this.init() //初始化方法, 实例化对象时就执行的方法
        }

        init() {
            this.config()
            this.onClick()
        }

        //根据状态调整 switch css 和 value 值
        stateClass(state) {
            const { active_color, inactive_color, active_value, inactive_value } = this.options
            const element = $(this.element)
            const switch__core = $(element).children(0)
            if (state) {
                switch__core.attr('style', `background-color:${active_color}`)
                $(element).addClass('is-switch')
                $(element).attr('value', active_value)
            } else {
                switch__core.attr('style', `background-color:${inactive_color}`)
                $(element).removeClass('is-switch')
                $(element).attr('value', inactive_value)
            }
        }

        //第一次创建默认的配置
        config() {
            const { defValue, active_value } = this.options
            const value = $(this.element).attr('value') //获取节点的value值
            /**
             * 获取默认的defValue 和 节点上是否配有value 值，
             * 如果有value值，则优先使用value值，
             * 如果没有，将根据 is_open 的值去给 value 默认值
             * **/
            const state = value ? String(active_value) == value : defValue
            this.stateClass(state)

        }

        //点击 switch 的时候
        onClick() {
            const _this = this
            $(this.element).on('click', function () {
                if(!_this.hold){
                    //click return false， 不继续执行
                    _this.hold = true
                    return false
                }
                const { inactive_value } = _this.options
                const val = $(this).attr('value') || inactive_value
                //将多种类型都转为 string 比较，boolean, string, number
                const state = String(val) == String(inactive_value)

                _this.stateClass(state) //修改seitch样式和value
                const callBack = $(this).attr('onclick')
                console.log(callBack)
            })
        }

        //click 事件回调， 将返回一个 Boolean 值，是否继续执行 Switch.onclick 里面的事件
        clickCallBack(result = true) {
            this.hold = result
        }

    }

    $.fn.Switch = function (options = {}) {
        $(this).each(function () { 
            //将每个节点 Switch 实例存储到 data 中
            $(this).data('switch', new Switch($(this), options))
        })
    }
})()