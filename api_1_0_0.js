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
        console.log(res.data)
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
                                console.log(res.data)
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
        console.log(res.data)
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
                                console.log(res.data)
                            }
                        })
                    } 
                }
            })
        }
    }
}