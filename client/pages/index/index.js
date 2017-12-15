//index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config');
const util = require('../../utils/util.js');
const app = getApp();
const zhUrl = 'http://tsn.baidu.com/text2audio?tok=24.7a1cfb22fbd7521622560da4f03f4dfc.2592000.1515433211.282335-1372250&cuid=2e:4b:82:f4:e7:20&ctp=1&lan=zh&spd=5&pit=5&vol=15&per=0&tex=';
const ctUrl = 'http://120.24.87.124/cgi-bin/ekho2.pl?cmd=SPEAK&voice=EkhoCantonese&speedDelta=-10&pitchDelta=0&volumeDelta=0&text=';

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        responseText: '',
        pressed: false,
        cantonese: false,
        voiceButtonName: '按一次说话，再按一次结束',
        tempFilePath: null,
    },

    // 用户登录
    login: function () {
        if (this.data.logged) return

        var that = this;
        if (wx.canIUse('checkIsSupportSoterAuthentication')) {
            wx.checkIsSupportSoterAuthentication({
                success(res) {
                    if (res.supportMode[0] == 'fingerPrint') { // 写法不严谨，正确写法应该是遍历数组查找
                        wx.startSoterAuthentication({
                            requestAuthModes: ['fingerPrint'],
                            challenge: '1234567890',
                            authContent: '请使用指纹登录',
                            success(res) {
                                util.showBusy('正在登录');

                                // 调用登录接口
                                qcloud.login({
                                    success(result) {
                                        if (result) {
                                            util.showSuccess('登录成功')
                                            that.setData({
                                                userInfo: result,
                                                logged: true
                                            })
                                        } else {
                                            // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                                            qcloud.request({
                                                url: config.service.requestUrl,
                                                login: true,
                                                success(result) {
                                                    util.showSuccess('登录成功')
                                                    that.setData({
                                                        userInfo: result.data.data,
                                                        logged: true
                                                    })
                                                },
                                                fail(error) {
                                                    util.showModel('请求失败', error)
                                                    console.log('request fail', error)
                                                }
                                            })
                                        }
                                    },
                                    fail(error) {
                                        util.showModel('登录失败', error)
                                        console.log('登录失败', error)
                                    }
                                });
                            },
                            fail(res) {
                                // console.log('用户取消了指纹识别，或调用出现错误')
                                // util.showModal('用户取消了指纹识别');

                                // 调用登录接口
                                qcloud.login({
                                    success(result) {
                                        if (result) {
                                            that.setData({
                                                userInfo: result,
                                                logged: true
                                            })
                                        } else {
                                            // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                                            qcloud.request({
                                                url: config.service.requestUrl,
                                                login: true,
                                                success(result) {
                                                    that.setData({
                                                        userInfo: result.data.data,
                                                        logged: true
                                                    })
                                                },
                                                fail(error) {
                                                    util.showModel('请求失败', error)
                                                    console.log('request fail', error)
                                                }
                                            })
                                        }
                                    },
                                    fail(error) {
                                        console.log('登录失败', error)
                                    }
                                });
                            }
                        })
                    } else {
                        console.log('当前设备不支持指纹识别');

                        // 调用登录接口
                        qcloud.login({
                            success(result) {
                                if (result) {
                                    util.showSuccess('登录成功')
                                    that.setData({
                                        userInfo: result,
                                        logged: true
                                    })
                                } else {
                                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                                    qcloud.request({
                                        url: config.service.requestUrl,
                                        login: true,
                                        success(result) {
                                            util.showSuccess('登录成功')
                                            that.setData({
                                                userInfo: result.data.data,
                                                logged: true
                                            })
                                        },
                                        fail(error) {
                                            util.showModel('请求失败', error)
                                            console.log('request fail', error)
                                        }
                                    })
                                }
                            },
                            fail(error) {
                                util.showModel('登录失败', error)
                                console.log('登录失败', error)
                            }
                        });
                    }
                },
                fail(res) {

                    // 调用登录接口
                    qcloud.login({
                        success(result) {
                            if (result) {
                                util.showSuccess('登录成功')
                                that.setData({
                                    userInfo: result,
                                    logged: true
                                })
                            } else {
                                // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                                qcloud.request({
                                    url: config.service.requestUrl,
                                    login: true,
                                    success(result) {
                                        util.showSuccess('登录成功')
                                        that.setData({
                                            userInfo: result.data.data,
                                            logged: true
                                        })
                                    },
                                    fail(error) {
                                        util.showModel('请求失败', error)
                                        console.log('request fail', error)
                                    }
                                })
                            }
                        },
                        fail(error) {
                            util.showModel('登录失败', error)
                            console.log('登录失败', error)
                        }
                    });
                }
            });
        } else {
            console.log('当前设备不支持指纹识别');

            // 调用登录接口
            qcloud.login({
                success(result) {
                    if (result) {
                        util.showSuccess('登录成功')
                        that.setData({
                            userInfo: result,
                            logged: true
                        })
                    } else {
                        // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                        qcloud.request({
                            url: config.service.requestUrl,
                            login: true,
                            success(result) {
                                util.showSuccess('登录成功')
                                that.setData({
                                    userInfo: result.data.data,
                                    logged: true
                                })
                            },
                            fail(error) {
                                util.showModel('请求失败', error)
                                console.log('request fail', error)
                            }
                        })
                    }
                },
                fail(error) {
                    util.showModel('登录失败', error)
                    console.log('登录失败', error)
                }
            });
        }
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...');
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success(result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail(error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    tapVoiceButton: function (event) {
        if (!this.data.logged) {
            util.showModal('请先登录');
            return;
        }

        var that = this;
        var start = this.data.voiceButtonName != '结束说话';
        this.setData({
            voiceButtonName: start ? '结束说话' : (this.data.responseText == '' ? '按一次说话，再按一次结束' : decodeURI(this.data.responseText))
        });
        if (start) {
            this.setData({
                pressed: true
            });
            wx.startRecord({
                success: function (res) {
                    console.log('录音成功' + JSON.stringify(res));
                    that.setData({
                        voiceButtonName: '按一次说话，再按一次结束',
                        tempFilePath: res.tempFilePath
                    });
                    util.showBusy('正在登录');
                    wx.showToast({
                        title: '语音识别中',
                        icon: 'loading',
                        duration: 10000,
                        mask: true
                    });
                    var languageUrl = that.data.cantonese ? config.service.cantoneseUrl : config.service.mandarinUrl;
                    wx.uploadFile({
                        url: languageUrl,
                        filePath: res.tempFilePath,
                        name: 'file',
                        // header: {}, // 设置请求的 header
                        formData: {
                            'msg': 'voice'
                        }, // HTTP 请求中其他额外的 form data
                        success: function (res) {
                            // success
                            var json = JSON.parse(res.data);
                            console.log('Request text:' + json.requestText);
                            var resText = json.restext;
                            if (resText === undefined) {
                                resText = encodeURI("抱歉，未能听懂您的指令");
                            }
                            console.log(decodeURI(resText));
                            that.setData({
                                voiceButtonName: decodeURI(resText),
                                responseText: resText
                            });
                            var audioContext = wx.createAudioContext('response');
                            var queryString = that.data.cantonese ? ctUrl + resText : zhUrl + resText;
                            audioContext.setSrc(queryString);
                            console.log(queryString);
                            wx.hideToast();
                            audioContext.play();
                            wx.showToast({
                                title: '语音播放中',
                                icon: 'loading',
                                duration: 10000,
                                mask: true
                            });
                            console.log('开始播放')
                        },
                        fail: function (err) {
                            // fail
                            console.log(err);
                            util.showModal("录音失败");
                        },
                        complete: function () {
                            // complete
                        }
                    })
                },
                fail: function (res) {
                    //录音失败
                    this.setData({
                        voiceButtonName: that.data.responseText == '' ? '按一次说话，再按一次结束' : decodeURI(that.data.responseText)
                    });
                    console.log('录音失败' + JSON.stringify(res));
                }
            })
            setTimeout(function () {
                //结束录音
                wx.stopRecord();
                that.setData({
                    pressed: false
                });
            }, 60000)
        } else {
            wx.stopRecord();
            this.setData({
                pressed: false
            })
        }
    },

    // 切换语言的按钮
    switchLanguage: function (e) {
        if (!this.data.logged) {
            util.showModal('请先登录')
        }

        var checked = e.detail.value;

        if (checked) {
            this.setData({
                cantonese: true
            })
        } else {
            this.setData({
                cantonese: false
            })
        }
    },

    onLoad: function () {
        console.log('onLoad');
    },

    playVoiceButton: function (event) {
        if (!this.data.logged) {
            util.showModal('请先登录');
            return;
        }
        var audioContext = wx.createAudioContext('response');
        audioContext.play();
        wx.showToast({
            title: '语音播放中',
            icon: 'loading',
            duration: 10000,
            mask: true
        });
        console.log('开始播放')
    }
});
