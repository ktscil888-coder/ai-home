'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  X, 
  CheckCircle, 
  Clock,
  Smartphone,
  Shield,
  ArrowRight
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: string;
  amount: number;
  description: string;
}

export function PaymentModal({ isOpen, onClose, planType, amount, description }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  // 模拟生成支付二维码
  const generatePaymentQR = async () => {
    try {
      const response = await fetch('/api/wechat-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          amount,
          description
        }),
      });

      const data = await response.json();
      setQrCodeUrl(data.code_url);
      setOrderId(data.out_trade_no);
      
      // 模拟支付状态检查
      setTimeout(() => {
        setPaymentStatus('success');
      }, 5000);
      
    } catch (error) {
      console.error('生成支付二维码失败:', error);
      setPaymentStatus('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            微信支付
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 订单信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">商品</span>
              <span className="font-medium text-gray-900">{description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">金额</span>
              <span className="text-2xl font-bold text-blue-600">¥{amount}</span>
            </div>
          </div>

          {/* 支付状态 */}
          {paymentStatus === 'pending' && (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  {qrCodeUrl ? (
                    <QrCode className="w-40 h-40 text-gray-400" />
                  ) : (
                    <div className="text-center">
                      <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">正在生成二维码...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {!qrCodeUrl && (
                <Button 
                  onClick={generatePaymentQR}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  生成支付二维码
                </Button>
              )}
              
              {qrCodeUrl && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    请使用微信扫描上方二维码完成支付
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>二维码有效时间：15分钟</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">支付成功！</h3>
              <p className="text-gray-600 mb-4">
                感谢您的购买，我们已为您开通{description}服务
              </p>
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  订单号：{orderId}
                </p>
              </div>
              <Button 
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                开始使用
              </Button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">支付失败</h3>
              <p className="text-gray-600 mb-4">
                支付过程中出现错误，请重试
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={generatePaymentQR}
                  className="w-full"
                >
                  重新生成二维码
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={onClose}
                  className="w-full"
                >
                  取消支付
                </Button>
              </div>
            </div>
          )}

          {/* 安全提示 */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>支付安全由微信支付保障，请放心支付</span>
            </div>
          </div>

          {/* 支付流程说明 */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2">支付流程：</h4>
            <ol className="text-xs text-blue-800 space-y-1">
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">1</span>
                <span>点击"生成支付二维码"</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">2</span>
                <span>使用微信扫描二维码</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">3</span>
                <span>确认支付金额并完成支付</span>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}