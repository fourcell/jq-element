(() => {


    const defaultOptions = {
        max: 1,
        min: 1
    }
    class Checkbox {
        constructor(element, options) {
            this.element = element
            this.options = Object.assign(defaultOptions, options)
            this.hold = true
            this.init()
        }

        init() {
            const className = $(this.element).attr('class')
            const reg = /^.*(el-checkbox-group)$/i
            console.log(eval(reg).test(className))
            this.config()
            this.onClick()
        }

        //初始化配置
        config() {
            const element = $(this.element)
            const value = element.attr('value')
            const input = element.find('input')
            if (value == 'true') {
                element.addClass('is-checkbox')
                input.attr('checked', 'checked')
            } else {
                element.attr('value', 'false')
            }
        }

        //点击事件
        onClick() {
            const _this = this
            $(this.element).on('click', function () {
                console.log(this)
                if (!_this.hold) {
                    //click return false， 不继续执行
                    _this.hold = true
                    return false
                }
                const value = $(this).attr('value')
                const input = $(this).find('input')
                if (value == 'true') {  //取消操作
                    $(this).removeClass('is-checkbox')
                    $(this).attr('value', false)
                    input.removeAttr('checked', 'checked')
                } else {    //勾选操作
                    $(this).addClass('is-checkbox')
                    $(this).attr('value', true)
                    input.attr('checked', 'checked')
                }
            })
        }

        //click 事件回调， 将返回一个 Boolean 值，是否继续执行 Switch.onclick 里面的事件
        clickCallBack(result = true) {
            this.hold = result
        }
    }



    $.fn.Checkbox = function (options = {}) {
        $(this).each(function () {
            //将每个节点 checkbox 实例存储到 data 中
            $(this).data('checkbox', new Checkbox($(this), options))
        })
    }
})()