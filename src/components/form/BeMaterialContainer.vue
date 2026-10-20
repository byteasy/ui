<template>
  <div class="flex-column w-full el-card">
    <el-text tag="b" size="large" class="p-2">组件</el-text>
    <el-collapse expand-icon-position="left" class="pl-2 pr-2 w-full" :accordion="false">
      <el-collapse-item :title="getLangText(group.name, locale)" :name="group.name"
                        v-for="group in componentGroups" :key="group.name">
        <VueDraggable
          class="flex-row flex-wrap p-2 overflow-auto be-material-source"
          v-model="group.components"
          v-bind="$attrs"
          :clone="clone"
          :on-start="onDragStart"
          :on-end="onDragEnd"
          :on-move="onDragMove"
          :group="{ name: 'material', pull: 'clone', put: false }"
          ghostClass="drag-ghost" chosenClass="drag-chosen"
          :animation="150">
          <div
            :class="{ 'selectable-item flex-column ml-1 justify-content-center align-items-center p-1' : true }"
            v-for="com in group.components" :key="com.id">
            <div class="el-card">
              <be-svg-icon :svg="com.icon" size="48"/>
            </div>
            <be-i18n-value :model-value="com.name"/>
          </div>
        </VueDraggable>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {VueDraggable} from "vue-draggable-plus";

const props = defineProps<{
  onMoveHandle: (event?: any, orginEvent: any) => void
}>()

const {t, locale} = useI18n()
const emit = defineEmits(['dragStart', 'dragEnd'])

const componentGroups = [
  {
    id: "Layout",
    name: "{\"zh_CN\":\"布局组件\",\"en\":\"Layout Component\"}",
    components: [
      {
        id: "LayoutCard",
        name: "{\"zh_CN\":\"卡片\",\"en\":\"Card Layout\"}",
        path: '/components/form/BeLayoutCard.vue',
        render: '/components/formRender/BeRenderLayoutCard.vue',
        icon: '<svg t="1783756757184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5169" width="200" height="200"><path d="M853.333333 827.733333H170.666667c-66.030933 0-102.4-36.369067-102.4-102.4v-426.666666c0-66.030933 36.369067-102.4 102.4-102.4h682.666666c66.030933 0 102.4 36.369067 102.4 102.4v426.666666c0 66.030933-36.369067 102.4-102.4 102.4z m-750.933333-341.333333v238.933333c0 47.223467 21.0432 68.266667 68.266667 68.266667h682.666666c47.223467 0 68.266667-21.0432 68.266667-68.266667v-238.933333H102.4z m0-34.133333h819.2v-136.533334H102.4v136.533334z m1.0752-170.666667h817.066667c-4.829867-35.242667-26.112-51.2-67.208534-51.2H170.666667c-41.079467 0-62.3616 15.957333-67.191467 51.2z m409.378133 460.8h-170.666666a17.066667 17.066667 0 1 1 0-34.133333h170.666666a17.066667 17.066667 0 1 1 0 34.133333z m-256 0H170.666667a17.066667 17.066667 0 1 1 0-34.133333h86.186666a17.066667 17.066667 0 1 1 0 34.133333z" p-id="5170"></path></svg>',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutCard.vue'},
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style'},
        ],
        properties: {
          width: '100%',
          height: '100%',
        },
      },
      {
        id: "LayoutGrid",
        name: "{\"zh_CN\":\"网格\",\"en\":\"Grid Layout\"}",
        path: '/components/form/BeLayoutGrid.vue',
        render: '/components/formRender/BeRenderLayoutGrid.vue',
        icon: '<svg t="1783756821998" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6144" width="200" height="200"><path d="M179.712 501.28896l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L464.67072 216.33024c0-11.32544-9.15456-20.48-20.48-20.48L179.712 195.85024c-11.32544 0-20.48 9.15456-20.48 20.48l0 264.47872C159.232 492.11392 168.40704 501.28896 179.712 501.28896zM200.192 236.81024l223.51872 0 0 223.51872L200.192 460.32896 200.192 236.81024z" p-id="6145"></path><path d="M529.63328 501.28896l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L814.592 216.33024c0-11.32544-9.15456-20.48-20.48-20.48L529.63328 195.85024c-11.32544 0-20.48 9.15456-20.48 20.48l0 264.47872C509.15328 492.11392 518.32832 501.28896 529.63328 501.28896zM550.11328 236.81024l223.51872 0 0 223.51872L550.11328 460.32896 550.11328 236.81024z" p-id="6146"></path><path d="M179.712 851.21024l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L464.67072 566.23104c0-11.32544-9.15456-20.48-20.48-20.48L179.712 545.75104c-11.32544 0-20.48 9.15456-20.48 20.48l0 264.47872C159.232 842.0352 168.40704 851.21024 179.712 851.21024zM200.192 586.71104l223.51872 0 0 223.51872L200.192 810.22976 200.192 586.71104z" p-id="6147"></path><path d="M509.15328 830.73024c0 11.32544 9.15456 20.48 20.48 20.48l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L814.592 566.23104c0-11.32544-9.15456-20.48-20.48-20.48L529.63328 545.75104c-11.32544 0-20.48 9.15456-20.48 20.48L509.15328 830.73024zM550.11328 586.71104l223.51872 0 0 223.51872L550.11328 810.22976 550.11328 586.71104z" p-id="6148"></path></svg>',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutGrid.vue'},
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style'},
        ],
        properties: {
          gutter: 10,
          width: '100%',
          height: '100%',
        },
        children: [
          {
            id: "LayoutGridItem",
            name: "{\"zh_CN\":\"网格元素\",\"en\":\"Grid Layout Item\"}",
            path: '/components/form/BeLayoutGridItem.vue',
            render: '/components/formRender/BeRenderLayoutGridItem.vue',
            propsForm: [
              { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutGridItem.vue' },
              { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
            ],
            properties: {
              colSpan: 8,
              width: '100%',
              height: '100%',
            }
          },
          {
            id: "LayoutGridItem",
            name: "{\"zh_CN\":\"网格元素\",\"en\":\"Grid Layout Item\"}",
            path: '/components/form/BeLayoutGridItem.vue',
            render: '/components/formRender/BeRenderLayoutGridItem.vue',
            propsForm: [
              { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutGridItem.vue' },
              { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
            ],
            properties: {
              colSpan: 8,
              width: '100%',
              height: '100%',
            }
          },
          {
            id: "LayoutGridItem",
            name: "{\"zh_CN\":\"网格元素\",\"en\":\"Grid Layout Item\"}",
            path: '/components/form/BeLayoutGridItem.vue',
            render: '/components/formRender/BeRenderLayoutGridItem.vue',
            propsForm: [
              { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutGridItem.vue' },
              { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
            ],
            properties: {
              colSpan: 8,
              width: '100%',
              height: '100%',
            }
          },
        ],
      },
      {
        id: "LayoutTab",
        name: "{\"zh_CN\":\"选项卡\",\"en\":\"Tab Layout\"}",
        path: '/components/form/BeLayoutTab.vue',
        render: '/components/formRender/BeRenderLayoutTab.vue',
        icon: '<svg t="1783756853842" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7138" width="200" height="200"><path d="M0 265.142857v713.142857h1024v-713.142857H0z m987.428571 676.571429H36.571429v-640h950.857142v640zM54.857143 228.571429h914.285714a18.285714 18.285714 0 0 0 0-36.571429H54.857143a18.285714 18.285714 0 0 0 0 36.571429zM109.714286 155.428571h804.571428a18.285714 18.285714 0 0 0 0-36.571428H109.714286a18.285714 18.285714 0 0 0 0 36.571428zM164.571429 82.285714h694.857142a18.285714 18.285714 0 0 0 0-36.571428H164.571429a18.285714 18.285714 0 0 0 0 36.571428z" fill="" p-id="7139"></path></svg>',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutTab.vue'},
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style'},
        ],
        properties: {
          width: '100%',
          height: '100%',
        },
        children: [
          {
            id: "LayoutTabPane",
            name: "{\"zh_CN\":\"选项卡页\",\"en\":\"Layout Tab Pane\"}",
            path: '/components/form/BeLayoutTabPane.vue',
            render: '/components/formRender/BeRenderLayoutTabPane.vue',
            propsForm: [
              { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutTabPane.vue' },
              { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
            ],
            properties: {
              title: "{\"zh_CN\":\"未命名\",\"en\":\"Untitled name\"}",
              width: '100%',
              height: '100%',
            }
          },
        ]
      },
      {
        id: "LayoutForm",
        name: "{\"zh_CN\":\"表单\",\"en\":\"Form Layout\"}",
        path: '/components/form/BeLayoutForm.vue',
        render: '/components/formRender/BeRenderLayoutForm.vue',
        icon: '<svg t="1783756877704" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8152" width="200" height="200"><path d="M277.333333 449.185185h469.333334v35.555556H277.333333z m0 143.407408h469.333334v35.555555H277.333333z m0 143.407407h312.888889v36.740741H277.333333zM626.962963 90.074074q-7.111111-37.925926-39.703704-64T512 0q-42.666667 0-75.259259 26.074074T397.037037 90.074074H43.851852v933.925926h936.296296V90.074074z m-213.333333 92.444445l20.148148-9.481482V107.851852q0-29.62963 23.111111-50.370371T512 36.740741q32 0 55.111111 20.74074T590.222222 107.851852v65.185185l20.148148 9.481482q58.074074 30.814815 84.148149 86.518518H329.481481q26.074074-55.703704 84.148149-86.518518z m527.407407 804.74074H82.962963V125.62963h311.703704v26.074074q-46.222222 23.703704-77.037037 64t-40.296297 90.074074h469.333334q-9.481481-49.777778-40.296297-90.074074t-77.037037-64V125.62963h311.703704z" p-id="8153"></path></svg>',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutForm.vue'},
          { title: "{\"zh_CN\":\"接口定义\",\"en\":\"Component Properties\"}", form: 'components.form.interface'},
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style'},
        ],
        properties: {
          width: '100%',
          height: '100%',
        },
      },
      {
        id: "LayoutCollapse",
        name: "{\"zh_CN\":\"折叠面板\",\"en\":\"Collapse Layout\"}",
        path: '/components/form/BeLayoutCollapse.vue',
        render: '/components/formRender/BeRenderLayoutCollapse.vue',
        icon: '<svg t="1783756908266" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9128" width="200" height="200"><path d="M972.8 998.4H51.2a25.6 25.6 0 0 1-25.6-25.6V51.2A25.6 25.6 0 0 1 51.2 25.6h921.6a25.6 25.6 0 0 1 25.6 25.6v921.6a25.6 25.6 0 0 1-25.6 25.6z m-896-51.2h870.4V76.8H76.8v870.4z" p-id="9129"></path><path d="M870.4 537.6H153.6a25.6 25.6 0 1 1 0-51.2h716.8a25.6 25.6 0 1 1 0 51.2z" p-id="9130"></path></svg>',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutCollapse.vue'},
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style'},
        ],
        properties: {
          width: '100%',
          height: '100%',
        },
        children: [
          {
            id: "LayoutCollapseItem",
            name: "{\"zh_CN\":\"面板页\",\"en\":\"Layout Collapse Item\"}",
            path: '/components/form/BeLayoutCollapseItem.vue',
            render: '/components/formRender/BeRenderLayoutCollapseItem.vue',
            propsForm: [
              { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutCollapseItem.vue' },
              { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
            ],
            properties: {
              title: "{\"zh_CN\":\"未命名\",\"en\":\"Untitled name\"}",
              width: '100%',
              height: '100%',
            }
          },
        ]
      },
      {
        id: "LayoutSplitter",
        name: "{\"zh_CN\":\"分隔板\",\"en\":\"Splitter Layout\"}",
        path: '/components/form/BeLayoutSplitter.vue',
        render: '/components/formRender/BeRenderLayoutSplitter.vue',
        icon: '<svg t="1791873982617" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5206" width="200" height="200"><path d="M469.76 384.426667V128.213333h-341.333333v766.933334h341.333333V597.333333h-42.666667v255.146667h-256V170.88h256v213.546667h42.666667zM896 128.64H554.666667v255.786667h42.666666V171.306667h256v681.386666H597.333333V597.333333h-42.666666v298.026667h341.333333V128.64z" p-id="5207"></path><path d="M704 597.333333h42.666667v-170.666666h-42.666667v64H320v-64h-42.666667v170.666666h42.666667v-64h384z" p-id="5208"></path></svg>',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutSplitter.vue'},
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style'},
        ],
        properties: {
          width: '100%',
          height: '100%',
          layout: 'horizontal',
        },
        children: [
          {
            id: "LayoutSplitterItem",
            name: "{\"zh_CN\":\"分割页\",\"en\":\"Layout Splitter Item\"}",
            path: '/components/form/BeLayoutSplitterItem.vue',
            render: '/components/formRender/BeRenderLayoutSplitterItem.vue',
            propsForm: [
              { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutSplitterItem.vue' },
              { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
            ],
            properties: {
              width: '100%',
              height: '100%',
              size: '30%',
              resizable: true,
              collapsible: true,
            }
          },
          {
            id: "LayoutSplitterItem",
            name: "{\"zh_CN\":\"分割页\",\"en\":\"Layout Splitter Item\"}",
            path: '/components/form/BeLayoutSplitterItem.vue',
            render: '/components/formRender/BeRenderLayoutSplitterItem.vue',
            propsForm: [
              { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.BeLayoutSplitterItem.vue' },
              { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
            ],
            properties: {
              width: '100%',
              height: '100%',
              size: '70%',
              resizable: true,
              collapsible: true,
            }
          },
        ]
      },
    ]
  },
  {
    id: "Input",
    name: "{\"zh_CN\":\"输入组件\",\"en\":\"Form Field Component\"}",
    components: [
      {
        id: "FormInputSlider",
        name: "{\"zh_CN\":\"滑块\",\"en\":\"Slider\"}",
        path: '/components/form/BeFormInput.vue',
        render: '/components/formRender/BeRenderFormInput.vue',
        icon: '<svg t="1783757046589" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10111" width="200" height="200"><path d="M320 682.666667a106.666667 106.666667 0 0 1 6.997333 213.12L320 896a106.666667 106.666667 0 0 1-104.533333-85.333333H106.666667a21.333333 21.333333 0 0 1-3.84-42.325334L106.666667 768h108.8a106.709333 106.709333 0 0 1 97.536-85.12L320 682.666667z m0 42.666666a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m597.333333 42.666667a21.333333 21.333333 0 0 1 3.84 42.325333L917.333333 810.666667h-426.666666a21.333333 21.333333 0 0 1-3.84-42.325334L490.666667 768h426.666666z m-213.333333-362.666667a106.666667 106.666667 0 0 1 6.997333 213.12l-6.997333 0.213334a106.666667 106.666667 0 0 1-104.533333-85.333334H106.666667a21.333333 21.333333 0 0 1-3.84-42.325333l3.84-0.341333h492.8a106.709333 106.709333 0 0 1 97.536-85.12L704 405.333333z m0 42.666667a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m213.333333 42.666667a21.333333 21.333333 0 0 1 3.84 42.325333l-3.84 0.341333h-42.666666a21.333333 21.333333 0 0 1-3.84-42.325333l3.84-0.341333h42.666666zM448 128a106.666667 106.666667 0 0 1 6.997333 213.12L448 341.333333a106.666667 106.666667 0 0 1-104.533333-85.333333H106.666667a21.333333 21.333333 0 0 1-3.84-42.325333L106.666667 213.333333h236.8a106.709333 106.709333 0 0 1 97.536-85.12L448 128z m0 42.666667a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m469.333333 42.666666a21.333333 21.333333 0 0 1 3.84 42.325334L917.333333 256h-298.666666a21.333333 21.333333 0 0 1-3.84-42.325333L618.666667 213.333333h298.666666z" fill="#888888" p-id="10112"></path></svg>',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputSlider' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'slider', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}' },
      },
      {
        id: "FormInputNumber",
        name: "{\"zh_CN\":\"数字输入\",\"en\":\"Number\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1783757089055" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13181" width="200" height="200"><path d="M957.44 291.84v512H97.28V291.84h860.16z m-40.96 40.96H138.24v430.08h778.24V332.8z" p-id="13182"></path><path d="M241.4848 644.15744V480.3584c-23.2704 23.3984-38.9376 35.0976-46.99648 35.0976-3.85024 0-7.26528-2.01216-10.24-6.03136-2.97984-4.0192-4.46464-8.66816-4.46464-13.94688 0-6.12352 1.46432-10.624 4.39296-13.50144 2.93376-2.88256 8.11008-6.59968 15.53408-11.1616 11.0848-6.84032 19.94752-14.03904 26.58816-21.59616a140.88704 140.88704 0 0 0 17.664-25.38496c5.13024-9.35936 8.4736-15.11936 10.03008-17.28 1.55648-2.15552 4.49024-3.23584 8.79616-3.23584 4.85376 0 8.75008 2.4576 11.67872 7.37792 2.93376 4.92032 4.39808 11.6992 4.39808 20.34176v206.10048c0 24.12032-6.272 36.17792-18.82624 36.17792-5.59104 0-10.07616-2.4576-13.4656-7.37792-3.39456-4.92032-5.08928-12.18048-5.08928-21.78048zM392.11008 626.33472h71.73632c7.14752 0 12.60032 1.92 16.35328 5.76 3.75808 3.84 5.63712 9.0624 5.63712 15.66208 0 5.87776-1.48992 10.85952-4.46976 14.94016-2.97472 4.08064-7.48544 6.1184-13.53216 6.1184H366.68416c-6.87104 0-12.23168-2.48832-16.0768-7.47008-3.85024-4.98176-5.77536-10.8288-5.77536-17.55136 0-4.31616 1.23904-10.04544 3.712-17.18784 2.47296-7.1424 5.17632-12.7488 8.11008-16.82944 12.1856-16.55808 23.17824-30.75072 32.98304-42.5728 9.79968-11.81696 16.80896-19.58912 21.02272-23.30624 7.51616-6.9632 13.76768-13.952 18.75968-20.97152 4.99712-7.01952 8.79616-14.21824 11.40736-21.60128 2.6112-7.37792 3.9168-14.60736 3.9168-21.68832 0-7.68-1.39776-14.55104-4.19328-20.608-2.7904-6.06208-6.59456-10.77248-11.40224-14.1312-4.8128-3.35872-10.05568-5.0432-15.73888-5.0432-12.00128 0-21.43744 6.90176-28.30848 20.70016-0.91648 1.80224-2.45248 6.72256-4.60288 14.76096-2.15552 8.0384-4.5824 14.22336-7.28576 18.53952-2.70336 4.32128-6.66624 6.48192-11.88864 6.48192-4.57728 0-8.38144-1.98144-11.40736-5.9392-3.0208-3.96288-4.5312-9.35936-4.5312-16.19968 0-8.28416 1.41824-16.9216 4.25984-25.92256a78.41792 78.41792 0 0 1 12.71296-24.47872c5.632-7.3216 12.77952-13.23008 21.43744-17.73056 8.65792-4.50048 18.80576-6.74816 30.4384-6.74816 14.01856 0 25.97376 2.87744 35.87072 8.63744 6.41536 3.84 12.04736 9.11872 16.90112 15.84128 4.85888 6.71744 8.63744 14.4896 11.3408 23.31136 2.70336 8.81664 4.05504 17.96608 4.05504 27.44832 0 14.87872-2.82112 28.41088-8.45312 40.59136-5.63712 12.18048-11.38176 21.71904-17.24928 28.6208-5.8624 6.89664-15.68768 17.72544-29.47584 32.4864-13.78816 14.76096-23.24992 26.21952-28.38016 34.3808a105.0112 105.0112 0 0 0-6.7328 11.6992zM573.65504 509.5168c8.42752 0 15.68768-3.24096 21.78048-9.72288 6.0928-6.4768 9.1392-15.77984 9.1392-27.89888 0-9.23648-2.42688-17.18784-7.28576-23.84896-4.85376-6.66112-11.40736-9.98912-19.65056-9.98912-5.59104 0-10.19392 1.01888-13.81376 3.05664a23.63904 23.63904 0 0 0-8.58624 8.10496c-2.10944 3.35872-4.10112 7.68-5.98016 12.95872a758.09792 758.09792 0 0 0-5.15072 14.94016 11.2896 11.2896 0 0 1-4.95104 5.9392c-2.3808 1.43872-5.13024 2.16064-8.2432 2.16064-3.66592 0-7.03488-1.95072-10.10176-5.85216s-4.60288-9.088-4.60288-15.56992c0-6.24128 1.44384-12.81024 4.3264-19.70688 2.88768-6.90176 7.10144-13.47072 12.6464-19.712 5.53984-6.24128 12.43648-11.24864 20.67968-15.03232 8.24832-3.77856 17.45408-5.66784 27.62752-5.66784 8.8832 0 16.99328 1.59232 24.32512 4.77184a54.75328 54.75328 0 0 1 19.0976 13.76768 60.3392 60.3392 0 0 1 12.23168 20.87936c2.74944 7.92064 4.12672 16.44032 4.12672 25.55904 0 12.00128-1.9968 22.29248-5.98016 30.8736-3.98336 8.576-9.68704 16.9472-17.11104 25.10848 7.14752 5.03808 13.17376 10.79808 18.0736 17.28a70.47168 70.47168 0 0 1 11.06432 21.50912c2.47296 7.8592 3.70688 16.35328 3.70688 25.472 0 10.92096-1.66912 21.4784-5.01248 31.67744s-8.2688 19.29216-14.77632 27.26912a70.56896 70.56896 0 0 1-23.15776 18.72384c-8.92928 4.50048-18.80064 6.74816-29.61408 6.74816-10.99264 0-20.84352-2.58048-29.54752-7.74144-8.704-5.15584-15.872-11.60704-21.50912-19.34848-5.632-7.74144-9.89184-15.74912-12.77952-24.02816-2.88768-8.28416-4.3264-15.11936-4.3264-20.52096 0-6.9632 1.7152-12.5696 5.15072-16.82944 3.43552-4.25984 7.72096-6.38976 12.8512-6.38976 2.56512 0 5.03808 0.98816 7.41888 2.9696 2.38592 1.97632 3.9424 4.34688 4.67456 7.10656 4.7616 16.68096 9.87136 29.07136 15.32416 37.1712 5.44768 8.09984 13.12256 12.14976 23.01952 12.14976 5.67808 0 11.15136-1.82784 16.41984-5.48864 5.26848-3.6608 9.62048-9.088 13.056-16.29184 3.43552-7.19872 5.15584-15.5392 5.15584-25.01632 0-14.04416-2.93376-25.05216-8.79616-33.03424-5.8624-7.97696-14.01856-11.96544-24.46336-11.96544-1.83296 0-4.66944 0.23552-8.51968 0.7168-3.85024 0.48128-6.3232 0.72192-7.41888 0.72192-5.0432 0-8.9344-1.64864-11.68384-4.95104-2.74944-3.3024-4.1216-7.88992-4.1216-13.76768 0-5.76 1.64864-10.41408 4.94592-13.952 3.29728-3.53792 8.20224-5.30944 14.70464-5.30944h5.63712z" p-id="13183"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputNumber' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'number', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}' },
      },
      {
        id: "FormInputText",
        name: "{\"zh_CN\":\"文本输入\",\"en\":\"Text Input\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1783757116600" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14165" width="200" height="200"><path d="M848.4864 522.3936a134.4 134.4 0 0 1 95.0272 229.4784l-168.96 168.96a32.1536 32.1536 0 0 1-10.752 7.0144l-4.096 1.3312-110.2848 27.648a83.456 83.456 0 0 1-79.0016-21.8624 83.3024 83.3024 0 0 1-21.9136-79.0528l27.5456-110.2848a32.3072 32.3072 0 0 1 8.3968-14.848l168.96-168.96a134.5024 134.5024 0 0 1 95.0784-39.424z m0 64c-18.6368 0-36.5568 7.3728-49.7664 20.5824l-161.4848 161.4336-1.2288 1.28-0.4096 1.6896-25.088 100.0448a19.2512 19.2512 0 0 0 23.3984 23.2448l99.9936-25.088 1.6896-0.3584 1.3312-1.28 106.0864-106.0864 4.5056-4.5568-49.7152-49.664a32.0512 32.0512 0 0 1 22.8864-53.76 32.1024 32.1024 0 0 1 17.5104 4.864l4.9152 3.7888 45.1584 45.056 4.608 4.608 4.5056-4.8128 1.024-1.024-0.0512-0.0512a70.2976 70.2976 0 0 0-0.0512-99.328h-0.0512a70.5024 70.5024 0 0 0-49.7664-20.5824z" p-id="14166"></path><path d="M716.8 70.4A236.7488 236.7488 0 0 1 953.6 307.2v102.4a31.9488 31.9488 0 0 1-64 0V307.2A172.8 172.8 0 0 0 716.8 134.4H307.2A172.8 172.8 0 0 0 134.4 307.2v409.6A172.8 172.8 0 0 0 307.2 889.6h102.4a31.9488 31.9488 0 0 1 0 64H307.2A236.7488 236.7488 0 0 1 70.4 716.8V307.2A236.7488 236.7488 0 0 1 307.2 70.4h409.6z" p-id="14167"></path><path d="M665.6 352a31.9488 31.9488 0 0 1 0 64h-121.344V640a31.9488 31.9488 0 0 1-64 0V416H358.4a31.9488 31.9488 0 0 1 0-64h307.2z" p-id="14168"></path></svg><path d="M118.784 727.04h778.24V296.96h-778.24v430.08zM77.824 256h860.16v512H77.824V256zM194.56 409.6v204.8c0 12.288 8.192 20.48 20.48 20.48s20.48-8.192 20.48-20.48V409.6c0-12.288-8.192-20.48-20.48-20.48s-20.48 8.192-20.48 20.48z" p-id="2683"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputText' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'text', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}', type: 'text', minlength: 0, maxlength: 60 , clearable: true, editable: true },
      },
      {
        id: "FormInputDate",
        name: "{\"zh_CN\":\"日期选择\",\"en\":\"Date Input\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg class="icon" viewBox="0 0 1126 1024" width="200" height="200"><path d="M1026.727234 67.501098H828.960858V0h-40.263813v67.501098H561.324924V0h-40.263813v67.501098H264.083245V0h-39.079584v67.501098H26.053056q-10.658068 0-18.355562 7.697494T0 93.554154v836.066237q0 11.842298 7.697494 19.539791T26.053056 956.857676h1000.674178q10.658068 0 18.355562-7.697494T1052.780289 929.620391V93.554154q0-10.658068-7.697493-18.355562T1026.727234 67.501098z m7.105379 26.053056v836.066237q0 3.552689-1.776345 5.329034T1026.727234 936.725769H26.053056q-2.36846 0-4.73692-1.776344t-2.368459-5.329034V93.554154q0-3.552689 2.368459-5.329034t4.73692-1.776345h198.950605v66.316869h39.079584V86.448775h256.977866v66.316869h40.263813V86.448775h227.372121v66.316869h40.263813V86.448775h197.766376q3.552689 0 5.329034 1.776345T1033.832613 93.554154zM166.976401 245.135568h152.765644v111.317601H166.976401z m298.425909 0h152.765644v111.317601H465.40231z m267.635934 0h152.765644v111.317601H733.038244zM166.976401 452.375782h152.765644v111.317601H166.976401z m298.425909 0h152.765644v111.317601H465.40231z m267.635934 0h152.765644v111.317601H733.038244zM166.976401 659.615997h152.765644v111.317601H166.976401z m298.425909 0h152.765644v111.317601H465.40231z m267.635934 0h152.765644v111.317601H733.038244z" p-id="5104"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputDate' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'date', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}', type: 'date', format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD', clearable: true, editable: true },
      },
      {
        id: "FormInputTag",
        name: "{\"zh_CN\":\"标签输入\",\"en\":\"Tag Input\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1783758668311" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19753" width="200" height="200"><path d="M3.584 626.048H297.28v74.176H188.256v261.856H112.608v-262.464H3.648l-0.064-73.568zM523.168 625.952h-73.28L313.344 962.016h347.968l-138.144-336.064z m-37.408 98.592l63.072 162.016H420.48l65.28-162.016zM947.936 732.64h72.384v-48.544s4.928-58.144-50.592-58.144h-208.064s-42.88-3.68-42.88 43.392v248.672h1.408s0 43.968 44.256 43.968h206.688s48.512 0.832 48.512-43.968v-155.872h-163.776v71.68h91.36v52.704h-153.248v-186.976h152.576l1.376 33.088zM509.344 58.656a232 232 0 1 0 0 464 232 232 0 0 0 0-464z m0 426.688a194.656 194.656 0 1 1 0-389.312 194.656 194.656 0 0 1 0 389.312z" p-id="19754"></path><path d="M386.496 269.344h245.344v40h-245.344z" p-id="19755"></path><path d="M490.176 162.656h38.016V416h-38.016z" p-id="19756"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputTag' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'tagInput', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}', clearable: true, editable: true },
      },
      {
        id: "FormInputRadio",
        name: "{\"zh_CN\":\"单选框\",\"en\":\"Radio Input\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1783758860745" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21029" width="200" height="200"><path d="M512 65.984C266.08 65.984 65.984 266.08 65.984 512c0 245.952 200.064 446.016 446.016 446.016 245.952 0 446.016-200.064 446.016-446.016C958.016 266.08 757.952 65.984 512 65.984zM512 894.016C301.344 894.016 129.984 722.624 129.984 512 129.984 301.344 301.344 129.984 512 129.984c210.624 0 382.016 171.36 382.016 382.016C894.016 722.624 722.624 894.016 512 894.016z" fill="#5E6570" p-id="21030"></path><path d="M512 352c-88.224 0-160 71.776-160 160s71.776 160 160 160 160-71.776 160-160S600.224 352 512 352z" fill="#5E6570" p-id="21031"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputRadio' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'radioInput', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}', clearable: true, editable: true, type: 'string' },
      },
      {
        id: "FormInputCheckbox",
        name: "{\"zh_CN\":\"复选框\",\"en\":\"Checkbox Input\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1783758950683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22006" width="200" height="200"><path d="M843.294118 347.015529h60.235294V963.764706H60.235294V120.470588h505.554824v60.235294H120.470588v722.82353h722.82353V347.015529zM292.382118 490.676706l-42.646589 42.646588 206.848 206.848L913.588706 46.742588l-50.296471-33.189647L446.945882 645.300706 292.382118 490.676706z" p-id="22007"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputCheckbox' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'checkboxInput', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}', clearable: true, editable: true, type: 'string' },
      },
      {
        id: "FormInputSelect",
        name: "{\"zh_CN\":\"下拉单选\",\"en\":\"Select Input\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1783759902437" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24662" width="200" height="200"><path d="M793.6 189.867l64 64c4.267 4.266 10.667 4.266 14.933 0l64-64c6.4-6.4 0-19.2-8.533-19.2H800c-8.533 0-14.933 12.8-6.4 19.2zM170.667 384c-46.934 0-85.334 38.4-85.334 85.333s38.4 85.334 85.334 85.334S256 516.267 256 469.333 217.6 384 170.667 384z m0 128C147.2 512 128 492.8 128 469.333s19.2-42.666 42.667-42.666 42.666 19.2 42.666 42.666S194.133 512 170.667 512z m746.666 0H362.667c-10.667 0-21.334-8.533-21.334-21.333V448c0-10.667 8.534-21.333 21.334-21.333h554.666c10.667 0 21.334 8.533 21.334 21.333v42.667c0 12.8-8.534 21.333-21.334 21.333zM170.667 682.667c-46.934 0-85.334 38.4-85.334 85.333s38.4 85.333 85.334 85.333S256 814.933 256 768s-38.4-85.333-85.333-85.333z m0 128C147.2 810.667 128 791.467 128 768s19.2-42.667 42.667-42.667 42.666 19.2 42.666 42.667-19.2 42.667-42.666 42.667z m746.666 0H362.667c-10.667 0-21.334-8.534-21.334-21.334v-42.666c0-10.667 8.534-21.334 21.334-21.334h554.666c10.667 0 21.334 8.534 21.334 21.334v42.666c0 12.8-8.534 21.334-21.334 21.334zM704 256H106.667c-10.667 0-21.334-8.533-21.334-21.333V192c0-10.667 8.534-21.333 21.334-21.333H704c10.667 0 21.333 8.533 21.333 21.333v42.667c0 12.8-8.533 21.333-21.333 21.333z" p-id="24663"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputSelect' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'selectInput', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}', clearable: true, editable: true },
      },
      {
        id: "FormInputMultiSelect",
        name: "{\"zh_CN\":\"下拉多选\",\"en\":\"Multi Select Input\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1783759927167" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25687" width="200" height="200"><path d="M137.29792 232.6528a28.672 28.672 0 0 1 28.672-28.672h151.83872a28.672 28.672 0 0 1 28.672 28.672v151.83872a28.672 28.672 0 0 1-28.672 28.672H165.96992a28.672 28.672 0 0 1-28.672-28.672V232.61184z m49.152 20.48v110.87872h110.87872V253.09184H186.44992zM137.29792 637.41952a28.672 28.672 0 0 1 28.672-28.672h151.83872a28.672 28.672 0 0 1 28.672 28.672v151.83872a28.672 28.672 0 0 1-28.672 28.672H165.96992a28.672 28.672 0 0 1-28.672-28.672v-151.83872z m49.152 20.48v110.87872h110.87872v-110.87872H186.44992z" fill="#707070" p-id="25688"></path><path d="M422.33856 204.96384m8.192 0l465.92 0q8.192 0 8.192 8.192l0 51.2q0 8.192-8.192 8.192l-465.92 0q-8.192 0-8.192-8.192l0-51.2q0-8.192 8.192-8.192Z" fill="#707070" p-id="25689"></path><path d="M422.33856 609.73056m8.192 0l465.92 0q8.192 0 8.192 8.192l0 51.2q0 8.192-8.192 8.192l-465.92 0q-8.192 0-8.192-8.192l0-51.2q0-8.192 8.192-8.192Z" fill="#707070" p-id="25690"></path><path d="M422.33856 373.5552m8.192 0l279.10144 0q8.192 0 8.192 8.192l0 32.768q0 8.192-8.192 8.192l-279.10144 0q-8.192 0-8.192-8.192l0-32.768q0-8.192 8.192-8.192Z" fill="#707070" p-id="25691"></path><path d="M422.33856 778.32192m8.192 0l279.10144 0q8.192 0 8.192 8.192l0 32.768q0 8.192-8.192 8.192l-279.10144 0q-8.192 0-8.192-8.192l0-32.768q0-8.192 8.192-8.192Z" fill="#707070" p-id="25692"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.InputMultiSelect' },
          { title: "{\"zh_CN\":\"字段属性\",\"en\":\"Field Properties\"}", form: 'components.form.base.field' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'multiSelectInput', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}', clearable: true, editable: true },
      },
      {
        id: "FormLabel",
        name: "{\"zh_CN\":\"文本展示\",\"en\":\"Text Display\"}",
        path: '/components/form/BeFormInput.vue',
        icon: '<svg t="1792484809152" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1687" width="200" height="200"><path d="M926.293333 481.706667l-213.333333-213.333334A42.666667 42.666667 0 0 0 682.666667 256H213.333333a128 128 0 0 0-128 128v256a128 128 0 0 0 128 128h469.333334a42.666667 42.666667 0 0 0 30.293333-12.373333l213.333333-213.333334a42.666667 42.666667 0 0 0 0-60.586666zM665.173333 682.666667H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V384a42.666667 42.666667 0 0 1 42.666666-42.666667h451.84l170.666667 170.666667z" p-id="1688"></path></svg>',
        render: '/components/formRender/BeRenderFormInput.vue',
        propsForm: [
          { title: "{\"zh_CN\":\"组件属性\",\"en\":\"Component Properties\"}", form: 'components.form.FormLabel' },
          { title: "{\"zh_CN\":\"样式属性\",\"en\":\"Component Properties\"}", form: 'components.form.base.style' },
        ],
        properties: { width: '100%', height: '100%', component: 'label', fieldTitle: '{\"zh_CN\":\"未命名\",\"en\":\"Title\"}'},
      },
    ]
  },
  {
    id: "Table",
    name: "{\"zh_CN\":\"表格组件\",\"en\":\"Table Column Component\"}",
    components: [
      {
        id: "TableColumnImage",
        name: "{\"zh_CN\":\"图片\",\"en\":\"Image\"}",
        path: '/components/BeTableColumnImage.vue',
        icon: 'Picture'
      },
      {
        id: "TableColumnEnum",
        name: "{\"zh_CN\":\"枚举\",\"en\":\"Enum\"}",
        path: '/components/BeTableColumnEnum.vue',
        icon: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M237.937778 443.804444a43.946667 43.946667 0 0 0-27.875556-8.533333 48.142222 48.142222 0 0 0-27.875555 8.533333A52.337778 52.337778 0 0 0 163.555556 473.955556h88.32a45.155556 45.155556 0 0 0-13.937778-30.151112z" ></path><path d="M896 352V192.782222C896 91.093333 654.577778 64 512 64s-384 27.093333-384 128.782222V352h-18.275556A45.724444 45.724444 0 0 0 64 397.724444v196.551112A45.724444 45.724444 0 0 0 109.724444 640H128v191.217778C128 932.835556 369.351111 960 512 960s384-27.164444 384-128.782222V640h18.275556a45.724444 45.724444 0 0 0 45.724444-45.724444V397.724444a45.724444 45.724444 0 0 0-45.724444-45.724444zM512 128.426667c190.933333 0 307.342222 40.106667 323.982222 64.426666-16.64 24.248889-133.048889 64.426667-323.982222 64.426667s-307.342222-40.106667-323.982222-64.426667c16.64-24.32 133.048889-64.426667 323.982222-64.426666zM187.093333 267.022222c80.568889 41.528889 226.275556 54.542222 324.906667 54.542222s244.337778-13.013333 324.977778-54.613333v85.333333H187.093333z m203.377778 151.253334a69.973333 69.973333 0 0 1 37.902222-9.315556q27.875556 0 41.813334 15.502222a55.751111 55.751111 0 0 1 14.222222 38.684445v122.311111h-31.217778V473.955556a43.733333 43.733333 0 0 0-9.315555-29.44A31.075556 31.075556 0 0 0 419.128889 433.777778q-20.124444 0-37.902222 20.906666a77.226667 77.226667 0 0 0-17.777778 51.84v78.933334h-31.075556V412.017778h31.004445v32.497778a99.555556 99.555556 0 0 1 27.093333-26.311112zM783.573333 640c-54.044444 18.631111-146.915556 35.555556-271.573333 35.555556s-217.528889-17.137778-271.573333-35.555556zM682.666667 585.457778h-31.288889v-32.497778a100.195556 100.195556 0 0 1-27.093334 26.311111 69.973333 69.973333 0 0 1-37.902222 9.315556q-27.875556 0-41.813333-15.502223a55.68 55.68 0 0 1-14.222222-38.684444V412.017778H561.777778v111.502222a43.662222 43.662222 0 0 0 9.315555 29.44 30.933333 30.933333 0 0 0 24.746667 10.808889q20.124444 0 37.902222-20.906667A77.297778 77.297778 0 0 0 651.377778 490.666667V412.017778H682.666667z m-554.666667-86.755556q0-41.813333 24.035556-65.777778A82.844444 82.844444 0 0 1 213.333333 408.96a72.32 72.32 0 0 1 53.404445 20.906667q20.906667 20.906667 20.906666 68.906666H162.062222q0 34.062222 14.72 48a50.844444 50.844444 0 0 0 36.408889 14.222223 43.733333 43.733333 0 0 0 27.875556-8.533334 40.248889 40.248889 0 0 0 14.222222-25.528889h34.062222a64 64 0 0 1-24.746667 44.871111A80.213333 80.213333 0 0 1 213.333333 588.515556a82.773333 82.773333 0 0 1-61.155555-23.964445Q128 540.444444 128 498.702222z m384 396.871111c-197.12 0-314.808889-42.666667-324.906667-64.426666V685.511111c80.64 41.6 226.346667 54.613333 324.906667 54.613333s244.693333-13.084444 325.191111-54.755555v143.573333c-10.382222 23.893333-128.071111 66.631111-325.191111 66.631111z m384-310.186666h-31.004444V460.017778a34.56 34.56 0 0 0-3.128889-15.502222 12.515556 12.515556 0 0 0-12.373334-6.186667 26.026667 26.026667 0 0 0-20.124444 11.591111 46.862222 46.862222 0 0 0-9.315556 30.222222v105.315556H789.333333V460.017778a34.702222 34.702222 0 0 0-3.057777-15.502222 12.515556 12.515556 0 0 0-12.373334-6.186667 26.026667 26.026667 0 0 0-20.124444 11.662222 46.862222 46.862222 0 0 0-9.315556 30.222222v105.244445h-31.004444V412.017778h31.004444v23.253333a60.728889 60.728889 0 0 1 18.56-19.342222 42.097778 42.097778 0 0 1 23.253334-7.111111 31.928889 31.928889 0 0 1 20.906666 7.111111 35.555556 35.555556 0 0 1 11.591111 19.342222 64.711111 64.711111 0 0 1 17.777778-19.342222 38.542222 38.542222 0 0 1 22.471111-7.111111 36.124444 36.124444 0 0 1 27.875556 10.097778 40.746667 40.746667 0 0 1 9.315555 28.444444z" ></path></svg>',
        hasParam: true,
        paramForm: 'components.BeEnumSelect.vue'
      },
    ]
  },
  {
    id: "PageTemplate",
    name: "{\"zh_CN\":\"页面模板\",\"en\":\"Page Template\"}",
    components: [
      {
        id: "PageTable",
        name: "{\"zh_CN\":\"通用表格\",\"en\":\"Table Template\"}",
        path: '/views/template/BeStdPageLayout.vue',
        icon: '<svg t="1780901383943" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10450" width="200" height="200"><path d="M807.845873 105.546818l-592.286316 0c-92.76818 0-167.695184 74.928027-167.695184 167.695184l0 476.921428c0 92.76818 74.928027 168.289753 167.695184 168.289753l592.286316 0c92.76818 0 168.289753-75.522597 168.289753-168.289753l0-476.921428C976.135627 180.473821 900.61303 105.546818 807.845873 105.546818zM77.596938 750.163429l0-406.156409 179.588619 0 0 544.712575-41.627023 0C139.442391 888.720618 77.596938 826.280595 77.596938 750.163429zM488.510926 888.720618l-201.591781 0L286.919145 712.699415l201.591781 0C488.510926 712.699415 488.510926 888.720618 488.510926 888.720618zM488.510926 682.965828l-201.591781 0L286.919145 528.353217l201.591781 0C488.510926 528.353217 488.510926 682.965828 488.510926 682.965828zM488.510926 498.61963l-201.591781 0 0-154.61261 201.591781 0C488.510926 344.00702 488.510926 498.61963 488.510926 498.61963zM719.835272 888.720618 518.243491 888.720618 518.243491 712.699415l201.591781 0L719.835272 888.720618zM719.835272 682.965828 518.243491 682.965828 518.243491 528.353217l201.591781 0L719.835272 682.965828zM719.835272 498.61963 518.243491 498.61963l0-154.61261 201.591781 0L719.835272 498.61963zM946.403062 750.163429c0 76.117166-62.440023 138.557189-138.557189 138.557189l-58.277013 0L749.56886 712.699415l196.834202 0L946.403062 750.163429zM946.403062 682.965828 749.56886 682.965828 749.56886 528.353217l196.834202 0L946.403062 682.965828zM946.403062 498.61963 749.56886 498.61963l0-154.61261 196.834202 0L946.403062 498.61963zM946.403062 314.273432l-868.805101 0 0-41.03143c0-76.117166 61.845453-137.96262 137.96262-137.96262l592.286316 0c76.117166 0 138.557189 61.845453 138.557189 137.96262L946.404085 314.273432z" p-id="10451"></path></svg>'
      },
    ]
  },
]

function onDragStart(event) {
  emit('dragStart', event)
}

function onDragEnd(event) {
  emit('dragEnd', event)
}

function clone(element: Record<any>) {
  const obj = JSON.parse(JSON.stringify(element))
  obj.id = obj.id + '-' + new Date().getTime();
  if(obj.children === undefined) {
    obj.children = []
  } else {
    let ts = new Date().getTime()
    obj.children.forEach(child => {
      ts = ts + 1
      child.id = child.id + '-' + ts
    })
  }
  if(obj.properties === undefined) {
    obj.properties = {}
  }
  return obj
}

function onDragMove(event, originalEvent) {
  return props.onMoveHandle(event, originalEvent)
}
</script>
