"ui";

//开屏提示 2021-5-5xzy修改
var iff = files.read("./if.txt");
if (iff == ""){
    alert("必读说明", "!!!请将学习强国设置为允许通知且允许在顶部悬浮显示!!!\n免责声明：\n本程序只供个人学习Auto.js使用，不得盈利传播，不得用于违法用途，否则造成的一切后果自负！\n如果继续使用此应用即代表您同意此协议\n说明：此应用仅适用于Android7.0以上的版本。\n打开应用后请先点击第一个按钮打开无障碍和悬浮窗权限，如果没有反应则是已经开启。\n特别鸣谢：苯巴比妥\n请确保进入学习强国时位于 主界面");
    files.write("./if.txt", "1");
}

/*----------------UI部分-----------------*/
ui.layout(
    <frame>
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="在线接双人对战" />
                <tabs id="tabs"/>
            </appbar>
            <viewpager id="viewpager">
            <frame>
            <ScrollView>
            <vertical>
                <button id="auto" w="*" text="先点我开启无障碍和悬浮窗权限 并开启防息屏弹窗" style="Widget.AppCompat.Button.Colored" />
                <button id="online" w="*" text="点我开始接双人" style="Widget.AppCompat.Button.Colored" />
                <button id="about" w="*" text="程序说明" style="Widget.AppCompat.Button.Colored" />
                </vertical>
            </ScrollView>
            </frame>
            <frame>
                    <vertical>
                        <webview id="webview" h="300" margin="0 16"/>
                        <text text="官方网站：http://xzy.center/" />
                        <text text="扫码赞助我" />
                        <img src="http://www.xzy.center/pic/fullsizerender(2).jpg" />
                    </vertical>
                </frame>
            </viewpager>
        </vertical>
    </frame>
);

//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu=>{
    menu.add("关于");
});
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item)=>{
    switch(item.getTitle()){
        case "关于":
            alert("关于", "SRQuestion_online，gingmzmzx制作");
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["自动", "xzy的网站"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);

ui.webview.loadUrl("http://xzy.center/");

ui.about.click(function () {
 alert("使用说明",
       "!!!请将学习强国设置为允许通知且允许在顶部悬浮显示!!!\n本程序原理为：\n监听通知，如果是学习强国通知，就点进通知，如果是双人对战则前往对战，完成后继续监听通知，不是则退出，继续监听。\n由于是监听通知，所以请将学习强国允许通知顶部悬浮显示。\n〇程序需要 悬浮窗， 通知权限 和 无障碍权限（设置→辅助功能→无障碍→本 APP）\n 〇程序工作原理为模拟点击，基于Auto.js框架+JavaScript脚本执行 \n◎请确保进入学习强国时位于 主界面，模拟点击从主界面开始 \n ●免责声明：本程序只供个人学习Auto.js使用，不得盈利传播，不得用于违法用途，否则造成的一切后果自负！"
      )
});

/*----------------自动部分-----------------*/
var thread = null;

ui.auto.on("click", ()=>{
    thread = threads.start(function () {toast("选择'自动学习强国'开启无障碍");
        engines.execScript("选择'自动学习强国'开启无障碍","auto.waitFor();console.show();console.hide();");
        var toastTime = 1;
        while(true){
            if(toastTime == 5){
                toast("防息屏呀，awa");
                toastTime = 1;
            }else{
                toastTime++;
            }
            delay(1);
        }
    });
});

ui.online.on("click", ()=>{
     auto.waitFor();//等待获取无障碍辅助权限
     
    thread = threads.start(function () {
         console.show();
    main();
    });
});

/** 
 * @description: 主程序，监听红点，进入答题页面
 * @param: null
 * @return: null
 */
function main(){
    events.observeNotification();
    events.on("notification", function(n){
        log("收到新通知:\n 标题: %s, 内容: %s, \n包名: %s", n.getTitle(), n.getText(), n.getPackageName());
        var content = n.getText();
        if(content != null){
        var iff = content.indexOf("分享");
        if(iff != -1){
            log("包含分享");
            n.click();
            while(!id("ll_left_operation").exists());
            var ci = 0;
            while(ci != -1){
                delay(2);
                log("第"+ci+"次点击");
                if(!click("双人对战",ci)){
                    log("不是双人");
                    back();back();back();back();
                    ci = -1;
                    continue;
                }
            delay(3);
            //如果擂台已解散
            if(className("android.widget.Button").exists()){
                log("擂台已解散");
                click("知道了");
                ci++;
                delay(1);
                continue;
            }else{
                ci = -1;
                answer();
            }
            }
        }
        }
    });
}

function answer(){
            log("等待答题完成");
            while(!className("android.view.View").text("继续挑战").exists());
            log("退出");
            back();
            delay(0.5);
            back();
            delay(0.5);
            className("android.widget.Button").text("退出").findOne().click();
            back();
            delay(0.5);
            back();
            delay(0.5);
            back();
            delay(2);
            //main();
        }

/**
 * @description: 定义延时函数
 * @param: seconds-延迟秒数
 * @return: null
 */
function delay(seconds) {
    sleep(1000 * seconds);//sleep函数参数单位为毫秒所以乘1000
}