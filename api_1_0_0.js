//一 乙方流程

//1 用户点击甲方小程序的响应 catchtap 或者 bindtap = "clickMiniProgram"
function clickMiniProgram()
{

}

//2 获取登录code
wx.login
({
    success (res) 
    {
        if (res.code) 
        {
            console.log(res)
            var sellcode = res.code
        } 
    }
})

//3 调用小程序跳转API进行跳转
wx.navigateToMiniProgram
({
    appId: '', //甲方小程序AppID
    extraData: 
    {
        tradeid: '',//交易ID，在交易详情中查询
        sellcode:sellcode //上一步获取的登录code
    },
    success(res) 
    {
        console.log(res)
        // 打开成功
    }
})

//4 打开小程序成功后，用POST方法上报阿拉丁服务器
wx.request
({
    url: 'https://aladingreport.quyue.ren/sell',
    method:'POST',
    data: 
    {
        tradeid:tradeid,//交易ID
        sellcode:sellcode //上一步获取的登录code
    },

    success (res) 
    {
        console.log(res)
    }
})

//5 完整代码流程
function clickMiniProgram()
{
    wx.login
    ({
        success (res) 
        {
            if (res.code) 
            {
                console.log(res)
                var sellcode = res.code

                wx.navigateToMiniProgram
                ({
                    appId: '', //甲方小程序AppID
                    extraData: 
                    {
                        tradeid:tradeid,//交易ID
                        sellcode:sellcode //乙方的登录code
                    },
                    success(res) 
                    {
                        console.log(res)
                        // 打开成功
                        wx.request
                        ({
                            url: 'https://aladingreport.quyue.ren/sell',
                            method:'POST',
                            data: 
                            {
                                tradeid:tradeid,//交易ID
                                sellcode:sellcode //乙方的登录code
                            },
                        
                            success (res) 
                            {
                                console.log(res)
                            }
                        })
                    }
                })
            } 
        }
    })
}

//二 甲方流程

//1 在小程序的onLaunch中获得交易ID和乙方的sellcode
function onLaunch(options)
{
    if(options.referrerInfo&&options.referrerInfo.extraData)
    {
        var tradeid = referrerInfo.extraData.tradeid
        var sellcode = referrerInfo.extraData.sellcode
    }
}

//2 获取登录code
wx.login
({
    success (res) 
    {
        if (res.code) 
        {
            console.log(res)
            var buycode = res.code
        } 
    }
})

//3 用POST方法上报阿拉丁服务器
wx.request
({
    url: 'https://aladingreport.quyue.ren/buy',
    method:'POST',
    data: 
    {
        tradeid:tradeid,//交易ID
        sellcode:sellcode, //乙方登录code
        buycode:buycode,//上一步获得的登录code
    },

    success (res) 
    {
        console.log(res)
    }
})

//4 完整代码
function onLaunch(options)
{

    if(options.referrerInfo&&options.referrerInfo.extraData)
    {
        var tradeid = options.referrerInfo.extraData.tradeid
        var sellcode = options.referrerInfo.extraData.sellcode

        if(tradeid&&sellcode)
        {
            wx.login
            ({
                success (res) 
                {
                    if (res.code) 
                    {
                        console.log(res)
                        var buycode = res.code
    
                        wx.request
                        ({
                            url: 'https://aladingreport.quyue.ren/buy',
                            method:'POST',
                            data: 
                            {
                                tradeid:tradeid,//交易ID
                                sellcode:sellcode, //乙方登录code
                                buycode:buycode,//甲方登录code
                            },
                            success (res) 
                            {
                                console.log(res)
                            }
                        })
                    } 
                }
            })
        }
    }
}

//三 注意事项
//1 API接入前，请确保甲乙双方的小程序绑定了同一个公众号
//2 记得将 https://aladingreport.quyue.ren 添加为小程序的 request合法域名
//3 上报API返回结果如下

// 0=>'数据正常',
// 41001=>'tradeid为空',
// 41002=>'sellcode为空',
// 41003=>'buycode为空',
// 41004=>'tradeid不存在',
// 41005=>'甲方的appid不存在',
// 41006=>'甲方的appsecret不存在',
// 41007=>'甲方的appid和appsecret不存在',
// 41008=>'乙方的appid不存在',
// 41009=>'乙方的appsecret不存在',
// 41010=>'乙方的appid和appsecret不存在',
// 51001=>'交易未开始,无法上报数据',
// 51002=>'交易已拒绝,无法上报数据',
// 51003=>'交易已删除,无法上报数据',
// 51004=>'交易已结算,数据上报无效',
// 51005=>'交易状态异常,无法上报数据',
// 51006=>'buycode无法获取有效用户',
// 51007=>'sellcode无法获取有效用户',

//任何问题 请联系 微信 ubiyowo   备注API对接