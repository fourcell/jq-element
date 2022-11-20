(function () {

    const defaultOptions = {
        valueName: 'value',    //指定选项的值为选项对象的某个属性值
        lableName: 'label',     //指定选项标签为选项对象的某个属性值
        childrenName: 'children',     //指定选项标签为选项对象的某个属性值
        separator: '/',         //分隔符
        options: [],            //数据源
    }

    class Cascader {
        constructor(evn, data) {
            this.options = Object.assign(defaultOptions, data)
            this.evn = evn  //将节点保存
            this.parent = null  //父节点
            this.model = []    //选中的值
            this.activeNode = []    //选中节点
            this.activeOpions = []  //当前选中的 children 集合


            this.init()  //初始化方法
        }

        init() {
            this.click()
            this.blur()
        }

        //点击聚焦
        click() {
            const { evn } = this
            const _this = this

            $(evn).on('click', function () {
                const input = $(evn).find('input')  //获取 cascader 下的 input 节点

                const dropdown = document.getElementsByClassName('el-cascader__dropdown')   //获取弹窗节点
                const { left, top } = $(input).offset()  //cascader 节点的 x y
                const height = $(input).outerHeight()    //cascader 节点的高度

                // 弹窗显示的 style
                const style = `position: absolute; top: ${top + height}px; left: ${left}px;
                transform-origin: center top; z-index: 2005;`

                if (!dropdown.length) {
                    console.log('没有 cascader 弹窗需要创建一个')
                    const { options, valueName, lableName, childrenName } = _this.options

                    $('body').append(`
                    <div style = "${style}"
                     class="el-popper el-cascader__dropdown" >
                     <div class="el-cascader-panel">
                        <div class="el-scrollbar el-cascader-menu">
                            <div style="margin-bottom: -17px; margin-right: -17px;" class="el-cascader-menu__wrap el-scrollbar__wrap"> 
                                <ul class="el-scrollbar__view el-cascader-menu__list">
                                    ${options.map((item, inx) => {
                        return `<li role="menuitem" node=0 value=${item[valueName]} id="cascader-menu-1120-0-${inx}" tabindex="-1" class="el-cascader-node" aria-owns="cascader-menu-1120-0-${inx}">
                                            <span class="el-cascader-node__label">${item[lableName]}</span>
                                            <i class="icon-youjiantou el-cascader-node__postfix">
                                        </i>`
                    })
                        }
                                </ul>
                            </div>
                        </div>
                    </div>
                     </div>
                     <div class="popper__arrow"></div>
                     </div>`)

                    _this.preventDefault()
                    _this.liClick()
                } else {
                    $('.el-cascader__dropdown').show()
                    $('.el-cascader__dropdown').attr('style', style)
                }
            })
        }

        //点击弹窗不失去焦点
        preventDefault() {
            $('.el-cascader__dropdown').on('mousedown', function (e) {
                e.preventDefault()
            })
        }

        //失去焦点
        blur() {
            const { evn } = this
            $(evn).find('input').on('blur', function () {
                // $('.el-cascader__dropdown').hide()
            })
        }

        //点击数据项时
        liClick() {
            const _this = this
            $('.el-cascader__dropdown').on('click', 'li', function () {
                const value = $(this).attr('value')     //节点的 value 值
                const node = Number($(this).attr('node'))   //节点层级
                _this.model = []

                //去除上一个选中节点的样式，
                if (_this.activeNode.length) {
                    const prevNode = _this.activeNode.splice(node, 1, this)
                    $(prevNode).removeClass('in-active-path')
                } else {
                    _this.activeNode.push(this)
                }
                //添加当前选中样式
                $(this).addClass('in-active-path')

                if (node == 0) {  //当点击第一级时，需要把后面前一个一级子节点隐藏
                    $('.el-cascader__dropdown .el-cascader-panel .el-cascader-menu').each(function (i) {
                        if (i != 0) {
                            $(this).attr('style', 'display: none')
                        }
                    })
                }

                const { options, valueName, childrenName, } = _this.options
                const activeArrt = node == 0 ? options : _this.activeOpions
                const activeOpions = (activeArrt.find(i => i[valueName] == value) || {})[childrenName] || []

                //获取下一级的 children, 并渲染出来
                _this.setChildrenNode(activeOpions, node)

                //获取选中的值
                _this.getOptionskey(activeOpions, value)

            })
        }

        //设置子节点的值
        setChildrenNode(activeOpions, node) {
            const { valueName, lableName, childrenName, } = this.options

            if (activeOpions.length) { //添加子节点数据 
                this.activeOpions = activeOpions
                const next = $('.el-cascader__dropdown .el-cascader-panel').eq(node + 1)
                //子节点模板
                const htmlTpl = `
                <div class="el-scrollbar el-cascader-menu">
                <div style="margin-bottom: -17px; margin-right: -17px;" class="el-cascader-menu__wrap el-scrollbar__wrap"> 
                    <ul class="el-scrollbar__view el-cascader-menu__list">
                        ${activeOpions.map((item, inx) => {
                    return `<li role="menuitem" node=${node + 1} value=${item[valueName]} id="cascader-menu-1120-0-${inx}" tabindex="-1" class="el-cascader-node" aria-owns="cascader-menu-1120-0-${inx}">
                                <span class="el-cascader-node__label">${item[lableName]}</span>
                                ${(item[childrenName] || []).length ? ' <i class="icon-youjiantou el-cascader-node__postfix">' : ''}
                            </i>`
                })
                    }
                    </ul>
                </div>
                `
                if (!next.length) {
                    $('.el-cascader__dropdown .el-cascader-panel').append(htmlTpl)
                } else {
                    $('.el-cascader__dropdown .el-cascader-panel').html(htmlTpl)
                }
            }
        }

        //根据 选中的枚举值去获取 key 和 value
        //activeOpions 子节点数源  key，当前节点的 value 值
        getOptionskey(activeOpions, key) {
            const { options } = this.options
            console.log(options, key, this.activeNode, activeOpions)
        }

    }


    //添加 cascader 方法
    $.fn.cascader = function (data = {}) {
        $(this).each(function () {
            //将每个节点 Switch 实例存储到 data 中
            $(this).data('switch', new Cascader($(this), data))
        })
    }

})()