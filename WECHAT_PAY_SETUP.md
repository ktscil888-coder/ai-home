# 微信支付集成指南

## 概述
本项目已经集成了微信支付功能，支持扫码支付（NATIVE）和H5支付。

## 配置步骤

### 1. 微信支付申请
1. 注册微信支付商户平台：https://pay.weixin.qq.com/
2. 申请成为商户（需要企业资质）
3. 获取商户号（mch_id）和API密钥（key）
4. 在微信开放平台创建应用并获取APPID

### 2. 配置文件
在 `src/app/api/wechat-pay/route.ts` 中更新以下配置：

```typescript
const WECHAT_PAY_CONFIG = {
  appid: 'your_wechat_appid',           // 微信开放平台APPID
  mch_id: 'your_merchant_id',           // 微信支付商户号
  key: 'your_api_key',                  // API密钥（32位）
  notify_url: 'https://your-domain.com/api/wechat-pay/notify' // 回调地址
};
```

### 3. 安装依赖
```bash
npm install axios crypto-js
```

### 4. 真实微信支付API集成
替换 `/api/wechat-pay/route.ts` 中的模拟代码：

```typescript
import axios from 'axios';
import crypto from 'crypto-js';

// 生成签名
function generateSign(params: any, key: string): string {
  const sortedParams = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== '')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return crypto.MD5(`${sortedParams}&key=${key}`).toString().toUpperCase();
}

// 统一下单API
export async function POST(request: NextRequest) {
  try {
    const { planType, amount, description } = await request.json();
    
    const params = {
      appid: WECHAT_PAY_CONFIG.appid,
      mch_id: WECHAT_PAY_CONFIG.mch_id,
      nonce_str: Math.random().toString(36).substr(2, 15),
      body: description,
      out_trade_no: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      total_fee: amount * 100, // 金额单位：分
      spbill_create_ip: request.ip || '127.0.0.1',
      notify_url: WECHAT_PAY_CONFIG.notify_url,
      trade_type: 'NATIVE' // 扫码支付
    };
    
    // 生成签名
    params.sign = generateSign(params, WECHAT_PAY_CONFIG.key);
    
    // 调用微信支付统一下单API
    const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', {
      ...params
    }, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });
    
    // 解析XML响应
    const result = await parseXMLResponse(response.data);
    
    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      // 返回前端支付参数
      return NextResponse.json({
        appId: WECHAT_PAY_CONFIG.appid,
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        nonceStr: params.nonce_str,
        package: `prepay_id=${result.prepay_id}`,
        signType: 'MD5',
        paySign: generateSign({
          appId: WECHAT_PAY_CONFIG.appid,
          timeStamp: Math.floor(Date.now() / 1000).toString(),
          nonceStr: params.nonce_str,
          package: `prepay_id=${result.prepay_id}`,
          signType: 'MD5'
        }, WECHAT_PAY_CONFIG.key),
        code_url: result.code_url, // 二维码链接
        out_trade_no: params.out_trade_no
      });
    } else {
      throw new Error(result.return_msg || '支付请求失败');
    }
    
  } catch (error) {
    console.error('微信支付处理错误:', error);
    return NextResponse.json(
      { error: '支付处理失败' },
      { status: 500 }
    );
  }
}
```

### 5. 支付结果通知处理
微信支付会在支付完成后向您的 `notify_url` 发送通知：

```typescript
// XML解析函数
function parseXMLResponse(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // 使用XML解析器解析微信返回的XML数据
    // 这里需要实现XML解析逻辑
  });
}

// 验证签名
function verifySign(params: any, key: string): boolean {
  const receivedSign = params.sign;
  delete params.sign;
  
  const calculatedSign = generateSign(params, key);
  return receivedSign === calculatedSign;
}
```

## 支付流程

### 前端流程
1. 用户选择套餐并点击"立即购买"
2. 弹出支付模态框
3. 点击"生成支付二维码"
4. 调用 `/api/wechat-pay` 生成支付参数
5. 显示二维码供用户扫描
6. 轮询支付状态或等待微信支付回调

### 后端流程
1. 接收支付请求
2. 生成商户订单号
3. 调用微信支付统一下单API
4. 获取预支付ID和二维码链接
5. 返回前端支付参数
6. 接收微信支付回调通知
7. 验证签名并处理支付结果
8. 更新订单状态

## 安全注意事项

1. **HTTPS必须**：微信支付要求使用HTTPS协议
2. **签名验证**：所有回调必须验证签名
3. **金额验证**：回调时需要验证金额是否匹配
4. **订单状态**：防止重复处理同一订单
5. **API密钥安全**：妥善保管商户API密钥

## 测试环境

微信支付提供测试环境：
- 测试商户号：需要申请
- 测试APPID：需要申请
- 测试金额：可以使用测试金额进行测试

## 常见问题

1. **签名错误**：检查参数顺序和API密钥
2. **回调失败**：确保notify_url可以公网访问
3. **金额单位**：微信支付金额单位为分
4. **跨域问题**：配置CORS允许微信支付回调

## 支持的支付方式

- **NATIVE**：扫码支付（推荐）
- **JSAPI**：公众号内支付
- **H5**：手机浏览器支付
- **APP**：APP支付

## 费率说明

微信支付费率一般为：
- 扫码支付：0.38%
- 公众号支付：0.6%
- H5支付：0.6%
- APP支付：0.6%

具体费率以微信支付官方公布为准。