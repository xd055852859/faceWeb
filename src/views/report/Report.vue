<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import store from "../../store";
import api from "../../utils/services";
import analysisReport from "../../common/analysisReport";
import { ElMessage } from "element-plus";
import { getSearchParamValue } from "../../utils/util";
import Avatar from "../../components/Avatar.vue";
import GlobalHeader from "../../components/globalHeader/GlobalHeader.vue";
import HeaderButton from "../../components/headerButton/HeaderButton.vue";
const deviceInfo = computed(() => store.state.deviceInfo);
const reportId = computed(() => store.state.reportId);
const report = computed(() => store.state.report);
const avatarImg = computed(() => store.state.img);
//defineProps,defineEmits
const reportArr = ref<any>([]);
const reportInfo = ref<any>("");
const imgInfo = ref<any>("");
const viewWidthArr = ref<any>([]);
const viewHeightArr = ref<any>([]);
const name = ref<any>("");
const faceImg = ref<any>("");

const reportEnNameArr = ref<any>([]);
const markState = ref<any>("");
const markNameNum = ref<any>([]);
const markArr = ref<any>([]);
const beautyMark = ref<any>(0);
const option = ref<any>("");
const canvasImg = ref<any>("");
const canvasImgState = ref<any>(false);
const reportImg = ref<any>("");
const miniState = ref<any>(false);
const reportListName = ref<any>([]);
const canvasRef = ref<any>(null);
const reportNameArr = ref<string[]>(["面形", "眉形", "眼形", "鼻形", "嘴形"]);
const markNameArr = ref<string[]>([
  "面型",
  "上停",
  "中停",
  "下停",
  "眉毛",
  "眼睛",
  "鼻子",
  "嘴巴",
]);
const markStateArr = ref<string[]>([
  "颜值欠佳",
  "颜值尚可",
  "颜值良好",
  "颜值优秀",
  "颜值完美",
]);
onMounted(() => {
  if (
    getSearchParamValue(window.location.search, "reportId") ||
    localStorage.getItem("reportId")
  ) {
    let reportId: string = getSearchParamValue(
      window.location.search,
      "reportId"
    )
      ? getSearchParamValue(window.location.search, "reportId")
      : localStorage.getItem("reportId");
    console.log(document.getElementsByTagName("canvas").length);
    getReportDetail(reportId);
  } else if (reportId.value && avatarImg.value.src) {
    console.log(avatarImg.value);
    let scaleNum = 1;
    let img: any = new Image();
    img.src = avatarImg.value.src;
    // img.setAttribute("crossOrigin", 'Anonymous');
    img.onload = function () {
      getReport(
        img,
        img.height * scaleNum,
        img.width * scaleNum,
        scaleNum,
        report.value
      );
    };
  }
});
const getReportDetail = async (reportId: string) => {
  let img = new Image();
  let scaleNum = 1;
  let res: any = await api.request("get", api.baseUrl + "resultDetail", {
    resultId: reportId,
  });
  if (res.msg === "OK") {
    store.dispatch("setImg", {
      src: res.data.picPath,
      scanSrc: "",
      width: res.data.picWidth,
      height: res.data.picHeight,
    });
    store.dispatch("setReport", res.data.result);
    store.dispatch("setReportId", reportId);
    // img.setAttribute("crossOrigin", 'Anonymous');
    img.src = res.data.picPath;
    img.onload = function () {
      imgInfo.value = {
        img: img,
        height: img.height * scaleNum,
        width: img.width * scaleNum,
        scaleNum: scaleNum,
      };
      getReport(
        img,
        img.height * scaleNum,
        img.width * scaleNum,
        scaleNum,
        res.data.result
      );
    };
  } else {
    ElMessage.error(res.msg);
  }
};
const getReport = (
  img: any,
  height: number,
  width: number,
  scaleNum: number,
  report: string
) => {
  reportInfo.value = report.split("x1,x2,y1,y2:").map((item, index) => {
    return "x1,x2,y1,y2:" + item;
  });
  reportInfo.value.splice(0, 1);
  reportInfo.value.forEach((item, index) => {
    let newArr = item.split("angle_yaw")[0].split("【").splice(1);
    //.split("【").splice(1).split("angle_yaw")[0]
    let newReportArr = newArr.map((item, index) => {
      return item
        .split("】")[1]
        .split("beauty:")[0]
        .substring(2)
        .replace(/↵/g, "")
        .replace(/"/g, "");
    });
    reportArr.value.push(newReportArr);
    reportListName.value.push([
      "eye" + index,
      "eyebrow" + index,
      "face" + index,
      "mouth" + index,
      "nose" + index,
      "topArea" + index,
      "middleArea" + index,
      "bottomArea" + index,
    ]);
    reportEnNameArr.value.push([
      "face" + index,
      "eyebrow" + index,
      "eye" + index,
      "nose" + index,
      "mouth" + index,
    ]);
  });
};
watch(canvasRef, (newValue) => {
  console.log(newValue);
  if (newValue) {
    reportListName.value.forEach((item, index: number) => {
      item = JSON.parse(JSON.stringify(item));
      let obj = analysisReport.analysisReport(
        reportInfo.value[index],
        imgInfo.value.height,
        imgInfo.value.width,
        imgInfo.value.img,
        item
      );
      console.log(obj);
      viewWidthArr.value.push(obj.viewWidth);
      viewHeightArr.value.push(obj.viewHeight);
      markArr.value.push(obj.markArr);
    });
  }
  // let scaleNum = 1;
  // let { location, setReport, setImgSrc, history, setReportId } = this.props;

  // }
});
</script>
<template>
  <GlobalHeader headerTitle="查看面相报告" />
  <HeaderButton />
  <div class="report">
    <div class="backImg">
      <img src="../../assets/reportback.jpg" alt="" />
    </div>
    <div class="report-container">
      <div class="img">
        <Avatar
          :index="0"
          :size="140"
          :name="''"
          :avatar="avatarImg.src"
          :type="'person'"
        />
      </div>
      <!-- <div class="top">
        <img
          class="report-message-top-image"
          src="../../assets/home-background-top-image.png"
          alt=""
        />
      </div> -->

      <div
        class="info"
        :style="deviceInfo === 'mobile' ? { width: '80vw' } : { width: '70vw' }"
      >
        <img
          src="../../assets/dialogback.png"
          alt=""
          class="report-img"
          :style="{ top: '-2px' }"
        />
        <div v-for="(item, index) in reportListName" :key="index">
          <div class="box">
            <div class="title">三庭解读</div>
            <div class="subtitle">上停</div>
            <!--    -->
            <div
              class="canvas"
              v-show="reportListName.length > 0"
              :style="{
                width: viewWidthArr[index] + 'px',
                height: viewHeightArr[index] + 'px',
              }"
            >
              <!--            :id="reportListName[index][5] + ''" -->
              <canvas
                :id="item[5] + 'Canvas'"
                class="myCanvas"
                width="600"
                height="600"
                ref="canvasRef"
              ></canvas>
              <canvas
                :id="item[5] + 'BackgroundCanvas'"
                class="backgroundCanvas"
                width="600"
                height="600"
              ></canvas>
              <canvas
                :id="item[5] + 'ImgCanvas'"
                class="backgroundImage"
                width="600"
                height="600"
              ></canvas>
            </div>
            <div class="info">
              {{ reportArr[index][5] }}
            </div>
            <div class="bottom-image">
              <div class="leftSrc"></div>
              <img
                class="line"
                src="../../assets/report-message-line.png"
                alt=""
              />
              <div class="rightSrc"></div>
            </div>
            <div class="subtitle">中停</div>
            <!--          -->
            <div
              class="canvas"
              v-show="reportListName.length > 0"
              :style="{
                width: viewWidthArr[index] + 'px',
                height: viewHeightArr[index] + 'px',
              }"
            >
              <canvas
                :id="item[6] + 'Canvas'"
                class="myCanvas"
                width="600"
                height="600"
              ></canvas>
              <canvas
                :id="item[6] + 'BackgroundCanvas'"
                class="backgroundCanvas"
                width="600"
                height="600"
              ></canvas>
              <canvas
                :id="item[6] + 'ImgCanvas'"
                class="backgroundImage"
                width="600"
                height="600"
              ></canvas>
            </div>
            <div class="info">
              {{ reportArr[index][6] }}
            </div>
            <div class="bottom-image">
              <div class="leftSrc"></div>
              <img
                class="line"
                src="../../assets/report-message-line.png"
                alt=""
              />
              <div class="rightSrc"></div>
            </div>
            <div class="subtitle">下停</div>
            <!--         -->
            <div
              class="canvas"
              v-show="reportListName.length > 0"
              :style="{
                width: viewWidthArr[index] + 'px',
                height: viewHeightArr[index] + 'px',
              }"
            >
              <canvas
                :id="item[7] + 'Canvas'"
                class="myCanvas"
                width="600"
                height="600"
              ></canvas>
              <canvas
                :id="item[7] + 'BackgroundCanvas'"
                class="backgroundCanvas"
                width="600"
                height="600"
              ></canvas>
              <canvas
                :id="item[7] + 'ImgCanvas'"
                class="backgroundImage"
                width="600"
                height="600"
              ></canvas>
            </div>
            <div class="info">
              {{ reportArr[index][7] }}
            </div>
          </div>
          <div class="box" :style="{ paddingBottom: '50px' }">
            <img class="leftIcon" src="../../assets/leftIcon.png" alt="" />
            <img class="rightIcon" src="../../assets/rightIcon.png" alt="" />
            <div class="title" :style="{ marginTop: '20px' }">五官分析</div>
            <div class="subtitle">五官评分</div>
            <div class="mark" v-show="markArr.length > 0">
              <div
                class="mark-div"
                :key="markIndex"
                v-for="(markItem, markIndex) in markNameArr"
              >
                <div class="mark-top">
                  <!--     : -->
                  <div
                    :style="{
                      height:
                        (markArr[index]
                          ? 100 -
                            (markArr[index][markIndex + 1]
                              ? markArr[index][markIndex + 1]
                              : 0)
                          : 0) + '%',
                    }"
                  ></div>
                </div>
                <div class="mark-bottom">
                  {{ markItem }}
                </div>
              </div>
            </div>
            <div class="mark-info">
              <div class="mark-info-top">
                <div>
                  <span>颜值评分：</span
                  ><span
                    >{{ markArr.length > 0 ? markArr[index][0] : 0 }}
                  </span>
                  <span> 总分100分</span>
                </div>
                <div>{{ markState }}</div>
              </div>
              <div class="mark-info-bottom">
                <div :style="{ width: beautyMark + '%' }"></div>
              </div>
            </div>
            <div class="bottom-image">
              <div class="leftSrc"></div>
              <img
                class="line"
                src="../../assets/report-message-line.png"
                alt=""
              />
              <div class="rightSrc"></div>
            </div>

            <div
              :key="key"
              v-for="(value, key) in reportNameArr"
              class="report-box"
            >
              <div class="subtitle">{{ value }}</div>
              <!-- v-show="reportListName.length > 0" -->
              <div
                class="canvas"
                :style="{
                  width: viewWidthArr[index] + 'px',
                  height: viewHeightArr[index] + 'px',
                }"
              >
                <canvas
                  :id="reportEnNameArr[index][key] + 'Canvas'"
                  class="myCanvas"
                  width="600"
                  height="600"
                ></canvas>
                <canvas
                  :id="reportEnNameArr[index][key] + 'BackgroundCanvas'"
                  class="backgroundCanvas"
                  width="600"
                  height="600"
                ></canvas>
                <canvas
                  :id="reportEnNameArr[index][key] + 'ImgCanvas'"
                  class="backgroundImage"
                  width="600"
                  height="600"
                ></canvas>
              </div>
              <div
                class="info"
                :style="
                  key + 1 === reportNameArr.length
                    ? { paddingBottom: '0.5px' }
                    : {}
                "
              >
                {{ reportArr[index][key] }}
              </div>

              <div
                class="bottom-image"
                v-show="key + 1 !== reportNameArr.length"
              >
                <div class="leftSrc"></div>
                <img
                  class="line"
                  src="../../assets/report-message-line.png"
                  alt=""
                />
                <div class="rightSrc"></div>
              </div>
            </div>
          </div>
          <div class="box">
            <img class="leftIcon" src="../../assets/leftIcon.png" alt="" />
            <img class="rightIcon" src="../../assets/rightIcon.png" alt="" />
            <div class="title">面相解读</div>

            <div class="subtitle">五行解读</div>
            <div class="info" :style="{ paddingBottom: '0.4px' }">
              {{ reportArr[index][8] }}
            </div>
            <div class="bottom-image">
              <div class="leftSrc"></div>
              <img
                class="line"
                src="../../assets/report-message-line.png"
                alt=""
              />
              <div class="rightSrc"></div>
            </div>

            <div class="subtitle">情感解读</div>
            <div class="info" style="paddingbottom: '0.4px'">
              {{ reportArr[index][9] }}
            </div>
            <div class="bottom-image">
              <div class="leftSrc"></div>
              <img
                class="line"
                src="../../assets/report-message-line.png"
                alt=""
              />
              <div class="rightSrc"></div>
            </div>

            <div class="subtitle">事业解读</div>
            <div class="info" :style="{ paddingBottom: '0.4px' }">
              {{ reportArr[index][10] }}
            </div>
          </div>
        </div>
        <div>
          <div class="box">
            <img
              class="leftIcon"
              src="../../assets/leftIcon.png"
              alt=""
              :style="{ top: '-45px' }"
            />
            <img
              class="rightIcon"
              src="../../assets/rightIcon.png"
              alt=""
              :style="{ top: '-45px' }"
            />
            <div class="info">
              阴阳五行，化生万物。相由心生，境随心转。古人经常从面部特征推算富贵时运。时光科技A小组利用人脸识别等相关技术，结合相关典籍，帮助用户快速解读面相，将传统文化发扬光大。
            </div>
          </div>
        </div>
        <img
          src="../../assets/dialogback.png"
          alt=""
          class="report-img"
          :style="{ bottom: '-8px' }"
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
/* pages/report/report.wxss */
.report {
  width: 100%;
  background: linear-gradient(90deg, #83a0ce, #9eb8e2);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  padding-bottom: 20px;
  .backImg {
    width: 100%;
    position: absolute;
    z-index: 2;
    overflow: hidden;

    img {
      width: 100%;
    }
  }
  .report-container {
    width: 100%;
    position: relative;
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .img {
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .info {
      width: 90%;
      position: relative;
      z-index: 1;
      .box {
        width: 100%;
        background-image: url("http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png");
        background-size: 100% 100%;
        font-size: 12px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 30px;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        .title {
          width: 100%;
          height: 40px;
          font-size: 32px;
          line-height: 40px;
          text-align: center;
        }
        .subtitle {
          width: 100%;
          height: 30px;
          font-size: 24px;
          line-height: 30px;
          text-align: center;
          margin: 15px 0px;
        }
        .canvas {
          margin: 10px 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          // border-radius: 12px;
          overflow: hidden;
          z-index: 5;
          .myCanvas,
          .backgroundCanvas,
          .backgroundImage {
            position: absolute;
            top: 0px;
            left: 0px;
          }

          .backgroundImage {
            z-index: 12;
          }

          .backgroundCanvas {
            z-index: 13;
          }

          .myCanvas {
            z-index: 20;
          }
        }
        .info {
          width: 100%;
          font-size: 20px;
        }
        .mark {
          height: 150px;
          width: 100%;
          display: flex;
          position: relative;
          z-index: 10;
          padding: 0px 5%;
          box-sizing: border-box;
          margin-top: 30px;
          .mark-div {
            width: 10%;
            height: 100%;
            margin-right: 3%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            &:nth-child(8) {
              margin-right: 0;
            }
          }
          .mark-top {
            width: 10px;
            height: 150px;
            background-color: #989898;
            div {
              width: 100%;
              background-color: #e8e8e8;
            }
          }
          .mark-bottom {
            width: 100%;
            height: 20px;
            margin-top: 8px;
            text-align: center;
            font-size: 12px;
          }
        }

        .mark-info {
          height: 90px;
          width: 100%;
          padding: 0px 5%;
          box-sizing: border-box;
          margin-top: 45px;
          position: relative;
          z-index: 10;
          .mark-info-top {
            height: 50px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666666;
            div {
              height: 100%;
              line-height: 100%;
            }
            span {
              &:nth-child(2) {
                font-size: 40px;
                color: #2a2a2a;
              }
              &:nth-child(3) {
                color: #c3c3c3;
              }
            }
          }
          .mark-info-bottom {
            width: 100%;
            height: 0.1px;
            background: #e8e8e8;
            margin: 0.15px 0px;
            div {
              height: 100%;
              background: #989898;
            }
          }
        }
      }
    }
  }
}
.report-box {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.leftIcon,
.rightIcon {
  width: 15px;
  height: 60px;
  z-index: 7;
  position: absolute;
  top: -22px;
}
.leftIcon {
  left: 5%;
}

.rightIcon {
  left: 92%;
}
.report-img {
  width: 104%;
  height: 26px;
  position: absolute;
  left: -2%;
  z-index: 2;
}
.bottom-image {
  width: 100%;
  height: 40px;
  z-index: 15;
  position: relative;
  // overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .line {
    width: calc(100% - 20px);
    height: 2px;
  }
  .leftSrc,
  .rightSrc {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .leftSrc {
    background-color: #7f98be;
    margin-left: -30px;
  }

  .rightSrc {
    background-color: #91a3c5;
    margin-right: -30px;
  }
}
</style>
