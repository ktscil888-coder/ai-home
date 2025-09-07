import { NextRequest, NextResponse } from 'next/server';

// 微信支付配置
const WECHAT_PAY_CONFIG = {
  appid: process.env.WECHAT_APPID || 'your_wechat_appid', // 微信开放平台审核通过的应用APPID（需要您提供）
  mch_id: '1695232558', // 微信支付分配的商户号
  key: '549684438F44DCA350F85DFB830C38C6', // API密钥
  notify_url: process.env.NOTIFY_URL || 'https://your-domain.com/api/wechat-pay/notify' // 支付结果通知回调地址（需要配置为您的域名）
};

export async function POST(request: NextRequest) {
  try {
    const { planType, amount, description } = await request.json();

    // 验证请求参数
    if (!planType || !amount || !description) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 生成商户订单号
    const out_trade_no = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 构造微信支付统一下单参数
    const params = {
      appid: WECHAT_PAY_CONFIG.appid,
      mch_id: WECHAT_PAY_CONFIG.mch_id,
      nonce_str: Math.random().toString(36).substr(2, 15),
      body: description,
      out_trade_no: out_trade_no,
      total_fee: amount * 100, // 微信支付金额单位为分
      spbill_create_ip: request.ip || '127.0.0.1',
      notify_url: WECHAT_PAY_CONFIG.notify_url,
      trade_type: 'NATIVE' // NATIVE支付类型，用于生成二维码
    };

    // 这里应该调用真实的微信支付API
    // 由于这是演示环境，我们返回模拟数据
    console.log('微信支付请求参数:', params);

    // 模拟微信支付API响应
    const mockResponse = {
      appId: WECHAT_PAY_CONFIG.appid,
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: params.nonce_str,
      package: `prepay_id=wx${Math.random().toString(36).substr(2, 15)}`,
      signType: 'MD5',
      paySign: 'mock_signature_' + Math.random().toString(36).substr(2, 15),
      code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=weixin://wxpay/bizpayurl?pr=${Math.random().toString(36).substr(2, 15)}`,
      out_trade_no: out_trade_no
    };

    // 在实际环境中，这里应该：
    // 1. 生成签名
    // 2. 调用微信支付统一下单API
    // 3. 解析返回的预支付ID
    // 4. 生成前端支付参数

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('微信支付处理错误:', error);
    return NextResponse.json(
      { error: '支付处理失败' },
      { status: 500 }
    );
  }
}