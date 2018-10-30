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

//4 用POST方法上报阿拉丁服务器
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
//1 请本地做好数据记录
//2 记得将 https://aladingreport.quyue.ren 添加为小程序的 request合法域名
//3 上报返回结果为以下内容

// 0=>'数据正常',
// 41001=>'tradeid不能为空',
// 41002=>'sellcode不能为空',
// 41003=>'buycode不能为空',
// 41004=>'tradeid不正确',
// 41005=>'没有甲方的appid',
// 41006=>'没有甲方的appsecret',
// 41007=>'没有甲方的appid和appsecret',
// 41008=>'没有乙方的appid',
// 41009=>'没有乙方的appsecret',
// 41010=>'没有乙方的appid和appsecret',
// 51001=>'交易未开始,不能上报数据',
// 51002=>'交易已拒绝,不能上报数据',
// 51003=>'交易已删除,不能上报数据',
// 51004=>'交易已结算',
// 51005=>'交易状态异常,不能上报数据',
// 51006=>'buycode无法获取用户信息',
// 51007=>'sellcode无法获取用户信息',
// 51008=>'sellcode没有匹配的用户数据',
// 51009=>'数据正常,已存在此用户的openid',